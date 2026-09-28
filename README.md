# Keshav Naram — Portfolio

My personal site: projects, blog posts, and a way to get in touch.

**Live:** https://naramkeshav59.github.io/

The landing page has a 3D Spider-Man hanging from the navbar. He follows your cursor, aims with whichever hand is closer, and shoots a web at wherever you click. Click on him and he spins.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router, static export)
- [Tailwind CSS](https://tailwindcss.com/)
- [three.js](https://threejs.org/) with [React Three Fiber](https://r3f.docs.pmnd.rs/) and [drei](https://drei.docs.pmnd.rs/)
- `react-markdown` for the blog

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To check the production build:

```bash
npm run build
npx http-server out
```

## Project layout

```
app/                  Next.js routes, layout, global styles
components/           Page sections (Home, Projects, Blog, Contact, Navigation, Footer)
components/SpiderMan3D.js   The 3D hero: model loading, posing, web shots
data/portfolio-data.js      Profile, projects and blog metadata
public/content/blogs/       Blog posts in Markdown
public/models/              Compressed GLB model
```

Most content changes only need `data/portfolio-data.js` or a new Markdown file in `public/content/blogs/`.

## How the Spider-Man works

The model is a rigged GLB with a Mixamo skeleton. Instead of playing canned animations, the pose is solved every frame:

- the head bone turns toward the cursor, clamped to a natural range
- the upper arm on the cursor's side is aimed at it; the other arm hangs
- the legs use a small two-bone IK so the knees bend out into a diamond with the feet together on the web
- the aiming hand folds its middle and ring fingers into the "thwip" pose and flicks when a web fires

Web shots come from a small pool of pre-built meshes, so firing one is instant. The original download was ~17 MB; it's compressed to ~1.5 MB with [gltf-transform](https://gltf-transform.dev/) (WebP textures + meshopt).

The figure is hidden on screens narrower than 768px.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the static site and publishes it to GitHub Pages.

## Credits

- Spider-Man 3D model: ["Spider-Man No Way Home (Rigged)"](https://sketchfab.com/3d-models/spider-man-no-way-home-rigged-9f0f2ab778194c52911a549110e597e0) by [Visiion](https://sketchfab.com/VisiionLovesYou), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Compressed for the web; otherwise unmodified.
- Spider-Man is a trademark of Marvel. This is a personal fan project with no affiliation.
