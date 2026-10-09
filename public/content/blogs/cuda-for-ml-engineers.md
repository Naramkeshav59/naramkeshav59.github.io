---
title: "CUDA for ML Engineers: The Four Ideas That Make Kernels Fast (and When to Use Triton Instead)"
date: "2026-10-05"
tags: ["CUDA", "GPU", "Performance", "Triton"]
---

Most ML engineers never write a CUDA kernel, and that's fine: PyTorch, cuBLAS and cuDNN already ship excellent ones. But custom kernels are back in fashion. Fused attention, quantized matmuls and custom activations are where real speedups come from, and even if you never write one, knowing *why* kernels are fast changes how you write PyTorch.

Almost all of GPU performance comes down to four ideas.

## The mental model

A kernel is a function that thousands of threads run at once. Threads are grouped into **blocks**, and blocks are scheduled onto the GPU's streaming multiprocessors (SMs). Within a block, threads are executed 32 at a time in **warps**, and all 32 threads of a warp execute the same instruction together.

```cpp
__global__ void add(const float* a, const float* b, float* c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // this thread's element
    if (i < n) c[i] = a[i] + b[i];
}
// launch: enough 256-thread blocks to cover n elements
add<<<(n + 255) / 256, 256>>>(a, b, c, n);
```

The GPU has enormous compute and comparatively scarce memory bandwidth, so **most kernels are limited by memory, not math**. The four ideas are all about moving fewer bytes, or moving them efficiently.

## 1. Coalesced memory access

When the 32 threads of a warp read 32 consecutive floats, the hardware combines them into a few wide memory transactions. When they read addresses scattered far apart, each one can cost its own transaction, and effective bandwidth collapses.

The rule: **neighboring threads should touch neighboring addresses.** In a row-major matrix, that means `threadIdx.x` should move along columns. Swapping which index follows `threadIdx.x` can make the same arithmetic several times slower.

## 2. Shared memory and tiling

A naive matrix multiply reads every element of A and B from global memory N times. A tiled kernel loads a small tile into **shared memory** (fast, on-chip, shared by the block), and every thread reuses it many times:

```cpp
#define TILE 16
__global__ void matmul_tiled(const float* A, const float* B, float* C, int N) {
    __shared__ float As[TILE][TILE], Bs[TILE][TILE];
    int row = blockIdx.y * TILE + threadIdx.y;
    int col = blockIdx.x * TILE + threadIdx.x;
    float acc = 0.f;
    for (int t = 0; t < N; t += TILE) {
        As[threadIdx.y][threadIdx.x] = A[row * N + t + threadIdx.x];   // cooperative load
        Bs[threadIdx.y][threadIdx.x] = B[(t + threadIdx.y) * N + col];
        __syncthreads();                                                // tile is ready
        for (int k = 0; k < TILE; ++k) acc += As[threadIdx.y][k] * Bs[k][threadIdx.x];
        __syncthreads();                                                // before overwriting
    }
    C[row * N + col] = acc;
}
```

Each value loaded from global memory is now used TILE times instead of once. This is the core of every fast matmul, and the same idea, in more elaborate form, is what makes FlashAttention fast: keep data on-chip and reuse it before going back to memory.

## 3. Occupancy and latency hiding

GPUs hide memory latency by switching between warps: while one warp waits for data, another computes. That only works if each SM has enough warps resident. **Occupancy** is that ratio, and it's capped by how many registers and how much shared memory each block uses.

More occupancy isn't automatically better, since sometimes fewer threads doing more work each wins. But a kernel with very low occupancy has nothing to switch to while it waits.

## 4. Warp divergence

All 32 threads in a warp execute the same instruction. If an `if` sends half of them one way and half the other, the warp runs both paths in turn, with half its threads idle each time. Branch on values that are uniform across a warp, or restructure the data so they are.

## Know which wall you're hitting

The **roofline model** frames all of this. Compute a kernel's *arithmetic intensity*, the FLOPs per byte moved from memory:

- **Low intensity** (element-wise ops, activations, layer norm): memory-bound. Speed up by moving fewer bytes, usually by **fusing** several ops into one kernel so intermediates never leave the chip.
- **High intensity** (large matmuls, convolutions): compute-bound. Speed up with better tiling and **tensor cores**, the dedicated units for low-precision matrix math (FP16, BF16, INT8).

This is why `torch.compile` speeds up models: much of the gain is fusing chains of memory-bound ops.

## CUDA vs Triton vs just PyTorch

| | PyTorch ops | Triton | CUDA C++ |
| --- | --- | --- | --- |
| **You write** | Tensor code | Python, at the level of *blocks* | C++, at the level of *threads* |
| **Handles for you** | Everything | Coalescing, shared memory, many details | Nothing |
| **Typical use** | Default | Fused custom ops, attention variants | Last few percent, unusual hardware features |
| **Learning curve** | None | Moderate | Steep |

Start with PyTorch and `torch.compile`. When profiling shows a hot path that needs a custom fused kernel, reach for Triton, which handles much of the tiling and coalescing for you. Drop to CUDA C++ when you need control Triton doesn't expose.

## Takeaways

1. Most kernels are memory-bound: count bytes before FLOPs.
2. Neighboring threads should read neighboring addresses.
3. Reuse data on-chip (shared memory, tiling, fusion) before going back to global memory.
4. Profile first. Nsight Compute will tell you which wall you're hitting, and guessing usually picks the wrong one.
