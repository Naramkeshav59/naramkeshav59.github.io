'use client';

import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Outlines, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const RED = '#e23636';
const BLUE = '#1f4fbf';
const INK = '#0a1026';
const WEB = '#f1f5f9';
const WEB_EDGE = '#a9b5cf'; // readable on both light and dark backgrounds

// Model is built upright in "model units" (feet at y=-1.8, top of head ~2.2)
// and then flipped so he hangs upside-down from his web.
const MODEL_H = 4;
const FEET_Y = -1.8;
const HEAD_Y = 1.55;
const HAND = new THREE.Vector3(0, 0, 1.25);
const TOP_PX = 110; // leaves a stretch of web visible below the navbar
const OUTLINE = 0.035;

const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _ndc = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();

function figurePx(width) {
  if (width >= 1280) return 390;
  if (width >= 1024) return 340;
  return 280;
}

// Screen pixel -> world point on the z=0 plane.
function screenToWorld(x, y, size, viewport, out = new THREE.Vector3()) {
  return out.set((x / size.width - 0.5) * viewport.width, (0.5 - y / size.height) * viewport.height, 0);
}

// Turn `obj` to face `target` smoothly instead of snapping.
function easeLookAt(obj, target, t) {
  _q.copy(obj.quaternion);
  obj.lookAt(target);
  const goal = obj.quaternion.clone();
  obj.quaternion.copy(_q).slerp(goal, t);
}

function Suit({ color }) {
  return <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} />;
}

function Capsule({ from, to, radius, color }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    return {
      length: dir.length(),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()),
      position: a.add(b).multiplyScalar(0.5),
    };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <capsuleGeometry args={[radius, length, 8, 16]} />
      <Suit color={color} />
      <Outlines thickness={OUTLINE} color={INK} />
    </mesh>
  );
}

function useMaskTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const g = canvas.getContext('2d');
    g.fillStyle = RED;
    g.fillRect(0, 0, 1024, 512);
    g.strokeStyle = 'rgba(70, 8, 18, 0.8)';
    g.lineWidth = 3;

    // Web radiates from the nose (u=0.25 is the sphere's +Z face).
    // Drawn twice, one texture-width apart, so it wraps without a seam.
    for (const cx of [256, 1280]) {
      const cy = 290;
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI) / 8;
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(cx + Math.cos(a) * 1400, cy + Math.sin(a) * 1400);
        g.stroke();
      }
      for (let r = 36; r < 1000; r += 44) {
        g.beginPath();
        for (let i = 0; i <= 16; i++) {
          const a = (i * Math.PI) / 8;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (i === 0) {
            g.moveTo(x, y);
          } else {
            const m = a - Math.PI / 16;
            g.quadraticCurveTo(cx + Math.cos(m) * r * 0.9, cy + Math.sin(m) * r * 0.9, x, y);
          }
        }
        g.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, []);
}

function Lens({ side, lensRef }) {
  const { position, quaternion } = useMemo(() => {
    const dir = new THREE.Vector3(side * 0.36, 0.2, 0.9).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), side * 0.5));
    return { position: dir.multiplyScalar(0.55).multiply(new THREE.Vector3(1, 1.12, 1)), quaternion: q };
  }, [side]);

  return (
    <group position={position} quaternion={quaternion}>
      <group ref={lensRef}>
        <mesh scale={[0.24, 0.16, 0.05]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color={INK} roughness={0.4} />
        </mesh>
        <mesh scale={[0.19, 0.115, 0.05]} position={[0, 0, 0.012]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.35} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Arm({ armRef, side }) {
  return (
    <group ref={armRef} position={[side * 0.55, 0.95, 0]}>
      <Capsule from={[0, 0, 0]} to={[0, 0, 0.55]} radius={0.13} color={BLUE} />
      <Capsule from={[0, 0, 0.55]} to={[0, 0, 1.02]} radius={0.12} color={RED} />
      <mesh position={[0, 0, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 1.14]}>
        <sphereGeometry args={[0.15, 20, 16]} />
        <Suit color={RED} />
        <Outlines thickness={OUTLINE} color={INK} />
      </mesh>
    </group>
  );
}

function SpiderEmblem() {
  const legs = [
    [0.09, 0.12, 0.5],
    [0.1, 0.03, 0.2],
    [0.1, -0.05, -0.3],
    [0.09, -0.14, -0.6],
  ];
  return (
    <group position={[0, 0.72, 0.3]}>
      <mesh scale={[0.05, 0.07, 0.02]} position={[0, 0.05, 0]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh scale={[0.06, 0.1, 0.02]} position={[0, -0.07, 0]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      {legs.flatMap(([x, y, a], i) =>
        [1, -1].map((s) => (
          <mesh key={`${i}${s}`} position={[s * x, y, 0]} rotation={[0, 0, s * a]}>
            <boxGeometry args={[0.16, 0.015, 0.015]} />
            <meshStandardMaterial color={INK} />
          </mesh>
        ))
      )}
    </group>
  );
}

// Web shots come from a fixed pool of meshes that are built (and their shaders
// compiled) up front, so firing a web costs nothing but a few property writes.
const SHOT_POOL = 6;
const SHOT_DRAW = 0.09; // seconds for the line to reach its target
const SHOT_LIFE = 1.0;

function createShotPool() {
  return Array.from({ length: SHOT_POOL }, () => ({
    born: -Infinity,
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
    px: 0,
  }));
}

function WebShots({ pool }) {
  const slots = useRef([]);
  const geometry = useMemo(
    () => ({
      line: new THREE.CylinderGeometry(1, 1, 1, 8),
      spoke: new THREE.BoxGeometry(1, 1, 0.001),
      ring: new THREE.TorusGeometry(1, 0.1, 4, 8),
    }),
    []
  );
  const dir = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    pool.forEach((shot, i) => {
      const slot = slots.current[i];
      const age = t - shot.born;
      if (age > SHOT_LIFE) {
        for (const m of slot.materials) m.opacity = 0;
        return;
      }

      const p = Math.min(1, age / SHOT_DRAW);
      dir.copy(shot.to).sub(shot.from);
      const length = dir.length();
      dir.normalize();
      for (const [mesh, radius] of [[slot.line, 2.2 * shot.px], [slot.core, 1.2 * shot.px]]) {
        mesh.quaternion.setFromUnitVectors(up, dir);
        mesh.position.copy(shot.from).addScaledVector(dir, (length * p) / 2);
        mesh.scale.set(radius, Math.max(length * p, 1e-4), radius);
      }

      // Splat pops in once the line lands, with a little overshoot.
      const sp = THREE.MathUtils.clamp((age - SHOT_DRAW) / 0.2, 0, 1);
      const pop = sp === 0 ? 1e-4 : 1 + 2.2 * Math.pow(sp - 1, 3) + 1.2 * Math.pow(sp - 1, 2);
      slot.splat.position.copy(shot.to);
      slot.splat.scale.setScalar(pop * shot.px);

      const fade = 1 - THREE.MathUtils.clamp((age - 0.6) / 0.4, 0, 1);
      for (const m of slot.materials) m.opacity = fade;
    });
  });

  // Materials start at opacity 0 but stay "visible" so their shaders compile on the first frame.
  const material = (i, color) => (
    <meshBasicMaterial
      ref={(m) => m && !slots.current[i].materials.includes(m) && slots.current[i].materials.push(m)}
      color={color}
      transparent
      opacity={0}
      depthTest={false}
      depthWrite={false}
      toneMapped={false}
    />
  );

  return pool.map((_, i) => {
    slots.current[i] ??= { materials: [] };
    const slot = slots.current[i];
    return (
      <group key={i}>
        <mesh ref={(m) => (slot.line = m)} geometry={geometry.line} renderOrder={10} scale={1e-4}>
          {material(i, '#3a4770')}
        </mesh>
        <mesh ref={(m) => (slot.core = m)} geometry={geometry.line} renderOrder={11} scale={1e-4}>
          {material(i, WEB)}
        </mesh>
        <group ref={(g) => (slot.splat = g)} scale={1e-4}>
          {Array.from({ length: 8 }, (_, k) => (
            <mesh key={k} geometry={geometry.spoke} rotation={[0, 0, (k * Math.PI) / 4]} scale={[34, 1.6, 1]} renderOrder={12}>
              {material(i, WEB_EDGE)}
            </mesh>
          ))}
          {[7, 13].map((r) => (
            <mesh key={r} geometry={geometry.ring} scale={[r, r, 1]} renderOrder={12}>
              {material(i, WEB_EDGE)}
            </mesh>
          ))}
        </group>
      </group>
    );
  });
}

// ---------------------------------------------------------------------------
// Figures. Each one registers a small "rig" API so the scene can drive it
// without caring whether it's the built-in figure or the downloaded model.
// ---------------------------------------------------------------------------

function useRegisterRig(rigRef, api) {
  useLayoutEffect(() => {
    rigRef.current = api;
    return () => {
      if (rigRef.current === api) rigRef.current = null;
    };
  }, [rigRef, api]);
}

// Built-in figure made from primitives: shown while the model loads, or if it fails.
function ProceduralFigure({ rigRef }) {
  const maskTexture = useMaskTexture();
  const root = useRef();
  const head = useRef();
  const armL = useRef();
  const armR = useRef();
  const lensL = useRef();
  const lensR = useRef();

  const api = useMemo(() => {
    // Screen-side -1 / 1 maps to whichever arm is on that side (he is upside-down).
    const bySide = (side) => {
      const l = armL.current.getWorldPosition(new THREE.Vector3());
      const r = armR.current.getWorldPosition(new THREE.Vector3());
      return (side < 0) === (l.x < r.x) ? armL.current : armR.current;
    };
    return {
      hitObject: () => root.current,
      headWorld: (out) => head.current.getWorldPosition(out),
      shoulderWorld: (side, out) => bySide(side).getWorldPosition(out),
      handWorld: (side, out) => bySide(side).localToWorld(out.copy(HAND)),
      pose: ({ look, arms, snap, lens }) => {
        easeLookAt(head.current, _v.set(look.x, look.y, 3.2), 0.15);
        for (const side of [-1, 1]) easeLookAt(bySide(side), arms[side], snap === side ? 1 : 0.2);
        for (const l of [lensL, lensR]) l.current.scale.set(lens.x, lens.y, 1);
        armL.current.updateMatrixWorld(true);
        armR.current.updateMatrixWorld(true);
      },
    };
  }, []);
  useRegisterRig(rigRef, api);

  return (
    <group ref={root} position={[0, -FEET_Y, 0]}>
      {/* torso with blue side panels and trunks */}
      <group scale={[1.1, 1, 0.72]}>
        <Capsule from={[0, 0.2, 0]} to={[0, 0.9, 0]} radius={0.42} color={RED} />
        <Capsule from={[-0.36, 0.1, 0]} to={[-0.44, 0.85, 0]} radius={0.2} color={BLUE} />
        <Capsule from={[0.36, 0.1, 0]} to={[0.44, 0.85, 0]} radius={0.2} color={BLUE} />
        <Capsule from={[-0.22, 0, 0]} to={[0.22, 0, 0]} radius={0.34} color={BLUE} />
      </group>
      <SpiderEmblem />
      <Capsule from={[0, 1.0, 0]} to={[0, 1.2, 0]} radius={0.17} color={RED} />
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.55, 0.95, 0]}>
          <sphereGeometry args={[0.2, 20, 16]} />
          <Suit color={BLUE} />
        </mesh>
      ))}

      {/* legs: blue thighs, red boots, feet wrapped around the web */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Capsule from={[side * 0.22, -0.1, 0]} to={[side * 0.55, -0.95, 0.15]} radius={0.16} color={BLUE} />
          <Capsule from={[side * 0.55, -0.95, 0.15]} to={[side * 0.08, FEET_Y + 0.05, 0]} radius={0.14} color={RED} />
        </group>
      ))}

      <Arm armRef={armL} side={-1} />
      <Arm armRef={armR} side={1} />

      <group ref={head} position={[0, HEAD_Y, 0]} up={[0, -1, 0]}>
        <mesh scale={[1, 1.12, 1]}>
          <sphereGeometry args={[0.55, 48, 32]} />
          <meshStandardMaterial map={maskTexture} roughness={0.55} />
          <Outlines thickness={OUTLINE} color={INK} />
        </mesh>
        <Lens side={-1} lensRef={lensL} />
        <Lens side={1} lensRef={lensR} />
      </group>
    </group>
  );
}

const MODEL_URL = '/models/spiderman.glb';
const BONE_NAMES = [
  'Hips', 'Neck', 'Head',
  'LeftArm', 'LeftForeArm', 'LeftHand', 'RightArm', 'RightForeArm', 'RightHand',
  'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'RightUpLeg', 'RightLeg', 'RightFoot',
];
const HEAD_MAX_TURN = THREE.MathUtils.degToRad(55);
const LEG_BEND = 0.62; // hip-to-feet distance as a fraction of leg length: lower = wider diamond
const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'];
const FINGER_BEND = [1.3, 1.65, 1.05]; // radians per joint at full curl (knuckle, middle, tip)
const HAND_THWIP = { Index: 0.05, Middle: 1, Ring: 1, Pinky: 0 }; // middle + ring folded
const HAND_RELAXED = { Index: 0.2, Middle: 0.28, Ring: 0.34, Pinky: 0.4 };

// Bend a joint from its rest pose around a precomputed local axis.
function setCurl(joint, angle) {
  joint.bone.quaternion.copy(joint.rest).multiply(_q.setFromAxisAngle(joint.axis, angle));
}
// Rotate `bone` (in world space) so the segment bone -> end points along `dir`.
function aimBone(bone, end, dir, maxAngle = Math.PI) {
  const from = bone.getWorldPosition(new THREE.Vector3());
  const current = end.getWorldPosition(new THREE.Vector3()).sub(from).normalize();
  rotateBoneWorld(bone, current, dir, maxAngle);
}

function rotateBoneWorld(bone, current, dir, maxAngle = Math.PI) {
  const delta = new THREE.Quaternion().setFromUnitVectors(current, dir.clone().normalize());
  const angle = 2 * Math.acos(THREE.MathUtils.clamp(delta.w, -1, 1));
  if (angle > maxAngle) delta.copy(new THREE.Quaternion().slerp(delta, maxAngle / angle));
  const parentWorld = bone.parent.getWorldQuaternion(new THREE.Quaternion());
  const boneWorld = bone.getWorldQuaternion(new THREE.Quaternion());
  bone.quaternion.copy(parentWorld.invert().multiply(delta.multiply(boneWorld)));
  bone.updateMatrixWorld(true);
}

// Downloaded, rigged model (Mixamo skeleton). Posed by rotating its bones.
function ModelFigure({ rigRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const root = useRef();
  const norm = useRef();
  const hitbox = useRef();

  const rig = useMemo(() => {
    const bones = {};
    scene.traverse((o) => {
      if (o.isMesh) o.frustumCulled = false; // bones move the mesh outside its bind-pose bounds
      const match = o.isBone && o.name.match(/^mixamorig:?([A-Za-z]+\d?)_/);
      if (match && !bones[match[1]]) bones[match[1]] = o;
    });
    const missing = BONE_NAMES.filter((n) => !bones[n]);
    if (missing.length) throw new Error(`Spider-Man model is missing bones: ${missing.join(', ')}`);

    // The loaded scene is cached, so remember its rest pose only the first time.
    for (const bone of Object.values(bones)) {
      bone.userData.rest ??= bone.quaternion.clone();
      bone.quaternion.copy(bone.userData.rest);
    }
    const rest = {};
    for (const n of BONE_NAMES) rest[n] = bones[n].userData.rest;

    // Work out which way the model is facing so it can be stood up in a known frame:
    // +Y up (hips -> head), +X towards his left, +Z out of his chest.
    scene.removeFromParent(); // measure it on its own, not under a previous mount
    scene.updateMatrixWorld(true);
    const at = (b) => bones[b].getWorldPosition(new THREE.Vector3());
    const up = at('Head').sub(at('Hips')).normalize();
    const left = at('LeftArm').sub(at('RightArm'));
    left.addScaledVector(up, -left.dot(up)).normalize();
    const forward = new THREE.Vector3().crossVectors(left, up).normalize();
    const basis = new THREE.Matrix4().makeBasis(left, up, forward);
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(basis).invert();

    // Scale to the standard figure height with his feet at the origin.
    const probe = new THREE.Group();
    probe.quaternion.copy(quaternion);
    probe.add(scene);
    probe.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const thigh = at('LeftUpLeg').distanceTo(at('LeftLeg'));
    const shin = at('LeftLeg').distanceTo(at('LeftFoot'));
    const hipHeight = at('LeftUpLeg').y - box.min.y;
    const shoulders = at('LeftArm').distanceTo(at('RightArm'));

    // Hands: for the wrist and every finger joint, find the local axis that curls it toward the palm.
    const hands = {};
    for (const side of ['Left', 'Right']) {
      const joint = (finger, n) => bones[`${side}Hand${finger}${n}`];
      if (!FINGERS.every((finger) => joint(finger, 1))) continue;
      const hand = bones[`${side}Hand`];
      const across = at(`${side}HandPinky1`).sub(at(`${side}HandIndex1`));
      const pointing = at(`${side}HandMiddle1`).sub(at(`${side}Hand`));
      const palm = new THREE.Vector3().crossVectors(across, pointing).normalize();
      if (side === 'Right') palm.negate(); // mirror-image hand
      const curlJoint = (bone, child) => {
        const along = child.getWorldPosition(new THREE.Vector3()).sub(bone.getWorldPosition(new THREE.Vector3()));
        const axis = new THREE.Vector3().crossVectors(along, palm).normalize();
        return { bone, rest: bone.userData.rest, axis: axis.applyQuaternion(bone.getWorldQuaternion(new THREE.Quaternion()).invert()) };
      };
      const fingers = {};
      for (const finger of FINGERS) {
        fingers[finger] = [1, 2, 3]
          .filter((n) => joint(finger, n) && joint(finger, n + 1))
          .map((n) => curlJoint(joint(finger, n), joint(finger, n + 1)));
      }
      hands[side] = {
        wrist: curlJoint(hand, joint('Middle', 1)),
        fingers,
        curl: { ...HAND_RELAXED },
        bend: 0,
      };
    }
    probe.remove(scene);
    const scale = MODEL_H / (box.max.y - box.min.y);
    const center = box.getCenter(new THREE.Vector3());
    // Bent legs are shorter than straight ones, so pull the body toward the web to match.
    const legDrop = hipHeight - (thigh + shin) * LEG_BEND;
    const position = new THREE.Vector3(-center.x, -box.min.y - legDrop, -center.z).multiplyScalar(scale);

    return {
      bones,
      rest,
      quaternion,
      scale,
      position,
      thigh,
      shin,
      hands,
      // Hitbox around his torso only, so clicks next to him still fire webs.
      hitWidth: shoulders * 1.4 * scale,
      hitDepth: shoulders * scale,
      arms: { [-1]: new THREE.Vector3(), [1]: new THREE.Vector3() },
      look: new THREE.Vector3(),
      primed: false,
    };
  }, [scene]);

  const api = useMemo(() => {
    const { bones, rest } = rig;
    // Screen-side -1 / 1 maps to whichever of his arms is on that side right now.
    const armBones = (side) => {
      const l = bones.LeftArm.getWorldPosition(new THREE.Vector3());
      const r = bones.RightArm.getWorldPosition(new THREE.Vector3());
      const leftOnLeft = l.x < r.x;
      const useLeft = side < 0 ? leftOnLeft : !leftOnLeft;
      return useLeft
        ? { key: 'Left', arm: bones.LeftArm, fore: bones.LeftForeArm, hand: bones.LeftHand }
        : { key: 'Right', arm: bones.RightArm, fore: bones.RightForeArm, hand: bones.RightHand };
    };

    return {
      hitObject: () => hitbox.current,
      headWorld: (out) => bones.Head.getWorldPosition(out),
      shoulderWorld: (side, out) => armBones(side).arm.getWorldPosition(out),
      handWorld: (side, out) => {
        const { fore, hand } = armBones(side);
        const h = hand.getWorldPosition(out);
        const dir = h.clone().sub(fore.getWorldPosition(new THREE.Vector3())).normalize();
        return h.addScaledVector(dir, 0.12 * norm.current.getWorldScale(_v).x);
      },
      pose: ({ look, arms, snap, aimSide, fireAge }) => {
        for (const n of BONE_NAMES) bones[n].quaternion.copy(rest[n]);
        norm.current.updateMatrixWorld(true);

        // Ease the targets, then solve the pose from rest every frame (no drift).
        const ease = rig.primed ? 0.18 : 1;
        rig.look.lerp(look, ease);
        for (const side of [-1, 1]) rig.arms[side].lerp(arms[side], snap === side ? 1 : ease);
        rig.primed = true;

        // Legs: knees out and slightly forward in a diamond, feet together on the web.
        const unit = norm.current.getWorldScale(new THREE.Vector3()).x;
        const facing = new THREE.Vector3(0, 0, 1).applyQuaternion(norm.current.getWorldQuaternion(new THREE.Quaternion()));
        const feet = root.current.getWorldPosition(new THREE.Vector3());
        const hips = {
          Left: bones.LeftUpLeg.getWorldPosition(new THREE.Vector3()),
          Right: bones.RightUpLeg.getWorldPosition(new THREE.Vector3()),
        };
        for (const [side, other] of [['Left', 'Right'], ['Right', 'Left']]) {
          const hip = hips[side];
          const outward = hip.clone().sub(hips[other]).normalize();
          const foot = feet.clone().addScaledVector(outward, 0.03 * unit);
          const l1 = rig.thigh * unit;
          const l2 = rig.shin * unit;
          const toFoot = foot.clone().sub(hip);
          const d = Math.min(toFoot.length(), (l1 + l2) * 0.999);
          toFoot.normalize();
          // Two-bone IK: place the knee where both segment lengths fit, bent toward outward+forward.
          const along = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
          const out = Math.sqrt(Math.max(0, l1 * l1 - along * along));
          const bend = outward.clone().addScaledVector(facing, 0.35);
          bend.addScaledVector(toFoot, -bend.dot(toFoot)).normalize();
          const knee = hip.clone().addScaledVector(toFoot, along).addScaledVector(bend, out);
          aimBone(bones[`${side}UpLeg`], bones[`${side}Leg`], knee.sub(hip));
          const kneeNow = bones[`${side}Leg`].getWorldPosition(new THREE.Vector3());
          aimBone(bones[`${side}Leg`], bones[`${side}Foot`], foot.sub(kneeNow));
        }

        // Arms: aim the upper arm; the forearm follows.
        for (const side of [-1, 1]) {
          const { arm, fore } = armBones(side);
          const shoulder = arm.getWorldPosition(new THREE.Vector3());
          aimBone(arm, fore, rig.arms[side].clone().sub(shoulder));
        }

        // Head: turn its facing direction toward the cursor, within a natural limit.
        const head = bones.Head.getWorldPosition(new THREE.Vector3());
        const want = rig.look.clone().setZ(head.z + 3.2).sub(head);
        rotateBoneWorld(bones.Head, facing, want, HEAD_MAX_TURN);

        // Hands: the aiming hand holds the "thwip" (middle + ring folded, wrist cocked back)
        // and flicks when it fires; the other hand hangs loosely curled.
        const thwipKey = aimSide ? armBones(aimSide).key : null;
        for (const [key, hand] of Object.entries(rig.hands)) {
          const thwip = key === thwipKey;
          const goal = thwip ? HAND_THWIP : HAND_RELAXED;
          const handEase = thwip && snap ? 1 : 0.3;
          for (const finger of FINGERS) hand.curl[finger] += (goal[finger] - hand.curl[finger]) * handEase;
          hand.bend += ((thwip ? -0.75 : 0.15) - hand.bend) * handEase;
          const flick = thwip ? Math.max(0, 1 - fireAge / 0.22) * 0.35 : 0;
          setCurl(hand.wrist, hand.bend - flick);
          for (const finger of FINGERS) {
            hand.fingers[finger].forEach((joint, i) => setCurl(joint, hand.curl[finger] * FINGER_BEND[i]));
          }
        }
      },
    };
  }, [rig]);
  useRegisterRig(rigRef, api);

  return (
    <group ref={root}>
      <group ref={norm} quaternion={rig.quaternion} scale={rig.scale} position={rig.position}>
        <primitive object={scene} />
      </group>
      {/* invisible hitbox so clicking him is cheap to detect */}
      <mesh ref={hitbox} position={[0, MODEL_H / 2, 0]}>
        <boxGeometry args={[rig.hitWidth, MODEL_H * 0.95, rig.hitDepth]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

class FallbackOnError extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.warn('Spider-Man model failed to load, using the built-in figure.', error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Soft studio lighting generated locally (no HDR download), so the suit's
// PBR materials read properly.
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Scene({ input, visible, thwips }) {
  const { camera, size, viewport } = useThree();
  const rigRef = useRef(null);

  const anchor = useRef();
  const flip = useRef();
  const body = useRef();

  const state = useRef({
    drop: -1, // 0 = hanging in place, -1 = pulled up out of view
    yaw: 0,
    spinStart: -10,
    lastFire: -10,
    squintUntil: 0,
    nextBlink: 2,
    blinkUntil: 0,
    lens: 1,
  });
  const pool = useMemo(createShotPool, []);
  const nextShot = useRef(0);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useFrame(({ clock }, delta) => {
    const rig = rigRef.current;
    if (!rig) return;
    const t = clock.elapsedTime;
    const s = state.current;
    const wpp = viewport.height / size.height; // world units per CSS pixel
    const px = figurePx(size.width);
    const scale = (px * wpp) / MODEL_H;

    // Drop in / zip back up, with a springy settle.
    const dropGoal = visible ? 0 : -1;
    s.drop += (dropGoal - s.drop) * Math.min(1, delta * (visible ? 5 : 7));
    const dropPx = s.drop * (px + TOP_PX + 120);

    // Hang at the top-right of the page and scroll with it.
    const feetX = size.width - Math.max(90, size.width * 0.06) - px * 0.2;
    const feetY = TOP_PX - window.scrollY + dropPx;
    screenToWorld(feetX, feetY, size, viewport, anchor.current.position);
    anchor.current.rotation.z = reducedMotion ? 0 : Math.sin(t * 1.4) * 0.035;
    flip.current.scale.setScalar(scale);

    const cursor = input.current.has
      ? screenToWorld(input.current.x, input.current.y, size, viewport, new THREE.Vector3())
      : null;
    anchor.current.updateMatrixWorld(true);
    const headWorld = rig.headWorld(new THREE.Vector3());

    // Whole body yaws toward the cursor for depth; clicking him does a spin.
    const gx = cursor ? THREE.MathUtils.clamp((cursor.x - headWorld.x) / 3, -1, 1) : 0;
    s.yaw += (-gx * 0.5 - s.yaw) * 0.08;
    const spinT = (t - s.spinStart) / 0.9;
    const spin = spinT < 1 ? (1 - Math.pow(1 - spinT, 3)) * Math.PI * 2 : 0;
    body.current.rotation.y = s.yaw + spin;
    body.current.updateMatrixWorld(true);

    // Where to look and where each arm points (-1 = screen-left arm, 1 = screen-right arm).
    const look = cursor ? cursor.clone() : headWorld.clone().add(new THREE.Vector3(-0.5, -1, 0));
    const aimSide = cursor && cursor.x < headWorld.x ? -1 : 1;
    const arms = {};
    for (const side of [-1, 1]) {
      const shoulder = rig.shoulderWorld(side, new THREE.Vector3());
      arms[side] =
        cursor && side === aimSide
          ? cursor.clone().setZ(0.8)
          : shoulder.add(new THREE.Vector3(side * 0.35 * scale * 4, -scale * 4, 0.35 * scale * 4));
    }

    // Lenses (built-in figure): blink, squint when firing, widen when you get close.
    if (t > s.nextBlink) {
      s.blinkUntil = t + 0.12;
      s.nextBlink = t + 2.5 + Math.random() * 3.5;
    }
    const near = cursor && cursor.distanceTo(headWorld) < 130 * wpp;
    const lensGoal = t < s.blinkUntil ? 0.1 : t < s.squintUntil ? 0.5 : near ? 1.18 : 1;
    s.lens += (lensGoal - s.lens) * 0.35;

    // Handle clicks: clicking Spidey makes him spin, anything else gets webbed.
    let snap = 0;
    const webs = [];
    for (const click of input.current.clicks.splice(0)) {
      _ndc.set((click.x / size.width) * 2 - 1, -(click.y / size.height) * 2 + 1);
      _raycaster.setFromCamera(_ndc, camera);
      if (_raycaster.intersectObject(rig.hitObject(), true).length) {
        if (!reducedMotion) s.spinStart = t;
        continue;
      }
      const to = screenToWorld(click.x, click.y, size, viewport, new THREE.Vector3());
      snap = to.x < headWorld.x ? -1 : 1;
      arms[snap] = to.clone().setZ(0.8);
      webs.push({ side: snap, to });
      s.lastFire = t;
    }

    rig.pose({
      look,
      arms,
      snap,
      aimSide: snap || (cursor ? aimSide : 0),
      fireAge: t - s.lastFire,
      lens: { x: near ? 1.08 : 1, y: s.lens },
    });

    for (const web of webs) {
      s.squintUntil = t + 0.26;
      const i = nextShot.current++ % SHOT_POOL;
      const shot = pool[i];
      rig.handWorld(web.side, shot.from);
      shot.to.copy(web.to);
      shot.px = wpp;
      shot.born = t;

      // "THWIP!" is a plain DOM label placed over his hand; restarting its CSS animation is instant.
      const label = thwips.current[i];
      if (label) {
        const p = shot.from.clone().project(camera);
        label.style.left = `${((p.x + 1) / 2) * size.width}px`;
        label.style.top = `${((1 - p.y) / 2) * size.height}px`;
        const text = label.firstChild;
        text.classList.remove('spidey-thwip-3d');
        void text.offsetWidth;
        text.classList.add('spidey-thwip-3d');
      }
    }
  });

  const fallback = <ProceduralFigure rigRef={rigRef} />;

  return (
    <>
      <StudioEnvironment />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 6]} intensity={1.2} />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#6ea8ff" />

      <group ref={anchor}>
        <group ref={flip} rotation={[0, 0, Math.PI]}>
          {/* web line he hangs from */}
          <mesh position={[0, -20, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 40, 6]} />
            <meshBasicMaterial color={WEB_EDGE} />
          </mesh>

          <group ref={body}>
            <FallbackOnError fallback={fallback}>
              <Suspense fallback={fallback}>
                <ModelFigure rigRef={rigRef} />
              </Suspense>
            </FallbackOnError>
          </group>
        </group>
      </group>

      <WebShots pool={pool} />
    </>
  );
}

export default function SpiderMan3D({ visible = true }) {
  const input = useRef({ x: 0, y: 0, has: false, clicks: [] });
  const visibleRef = useRef(visible);
  const thwips = useRef([]);
  const [wide, setWide] = useState(false);

  visibleRef.current = visible;

  // Only render on tablet/desktop widths so he never covers the hero on phones.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      Object.assign(input.current, { x: e.clientX, y: e.clientY, has: true });
    };
    // Fire on press rather than on click (which waits for the button to be released).
    const onPress = (e) => {
      if (!visibleRef.current || !e.isPrimary || e.button !== 0) return;
      Object.assign(input.current, { x: e.clientX, y: e.clientY, has: true });
      input.current.clicks.push({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onPress, true);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onPress, true);
    };
  }, []);

  if (!wide) return null;

  return (
    <>
      <Canvas
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 40 }}
        camera={{ position: [0, 0, 10], fov: 35 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene input={input} visible={visible} thwips={thwips} />
      </Canvas>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[41] overflow-hidden">
        {Array.from({ length: SHOT_POOL }, (_, i) => (
          <div key={i} ref={(el) => (thwips.current[i] = el)} className="absolute -translate-x-1/2 -translate-y-1/2">
            <span className="spidey-thwip-label">THWIP!</span>
          </div>
        ))}
      </div>
    </>
  );
}
