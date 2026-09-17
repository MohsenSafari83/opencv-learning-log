<!--
  BANNER — replace this placeholder with your own designed banner image.
  Suggested spec: ~1200x300px, matching the site's blue → cyan → green
  gradient. Once ready:
  ![OpenCV Learning Log banner](./docs/banner.png)
-->
<!-- <p align="center"><img src="./docs/banner.png" alt="OpenCV Learning Log" width="100%" /></p> -->

<h1 align="center">OpenCV Learning Log</h1>

<p align="center"><b>A structured, hands-on log of learning computer vision with OpenCV — from fundamentals to real-world systems.</b></p>

<p align="center">
  <!-- Site stack -->
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel" alt="Deployed on Vercel" />
  <br />
  <!-- Course content stack -->
  <img src="https://img.shields.io/badge/Python-3-3776AB?logo=python&logoColor=white" alt="Python 3" />
  <img src="https://img.shields.io/badge/Jupyter-Notebook-F37626?logo=jupyter&logoColor=white" alt="Jupyter Notebook" />
  <img src="https://img.shields.io/badge/OpenCV-4-5C3EE8?logo=opencv&logoColor=white" alt="OpenCV" />
  <img src="https://img.shields.io/badge/NumPy-013243?logo=numpy&logoColor=white" alt="NumPy" />
  <br />
  <img src="https://img.shields.io/badge/status-active-brightgreen" alt="status: active" />
  <img src="https://img.shields.io/badge/modules-4%2F9%20complete-blue" alt="modules: 4/9 complete" />
</p>

<p align="center">
  🌐 <a href="https://opencv-learning-log.vercel.app/">Live Site</a> •
  <a href="#getting-started">Local Setup</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#content-status">Content Status</a> •
  <a href="#credits">Credits</a>
</p>

<p align="center" dir="rtl" lang="fa">
مسیر یادگیری من از مبانی OpenCV تا سیستم‌های واقعی، با کد، تصویر، تمرین و پروژه‌های کاربردی.
</p>

---

## About

This repository is a personal, public learning log built while working through a computer vision curriculum based on [Alireza Akhavan's class.vision](https://github.com/Alireza-Akhavan/class.vision) course. Instead of keeping notes in scattered notebooks, everything — theory, cheat sheets, practical pitfalls, real-world applications, exercises, and projects — is organized into a proper website, module by module.

The goal isn't just to *finish* the course, but to leave behind something structured enough that it's actually useful to revisit later, and open enough that anyone else learning OpenCV can follow the same path.

## Features

- **9-module curriculum** — thresholding & binarization, morphology, contours, edge detection, and on through more advanced topics, each with theory, a cheat sheet, practical notes, real-world applications, and a project
- **Hands-on exercises** — each with a clear goal, expected result, hints, and a reference solution (notebook + plain `.py` script)
- **Real projects per module** — framed as engineering briefs (problem, requirements, constraints) rather than worked examples
- **Searchable, bilingual-friendly content** — command palette search, reading progress, section deep-links
- **Fully data-driven** — module/exercise metadata is generated from the actual content files (`scripts/generate-modules.mjs`), so the site can never drift out of sync with what's really been written

## Tech Stack

**Site**
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

**Course content**
- **Language:** Python 3
- **Notebooks:** Jupyter Notebook
- **Core library:** OpenCV, NumPy

## Project Structure

```
.
├── .github/workflows/      # CI
├── app/                    # Next.js App Router pages (home, modules, exercises, projects)
├── components/             # UI components (Hero, Navbar, CodePanel, module readers, ...)
├── content/                # The actual course content — one folder per module
│   ├── module-1/ .. module-9/
│   │   ├── notes.html          # Theory / lesson content
│   │   ├── exercises.html      # Exercises for this module
│   │   ├── cheatsheet.html     # Function reference, common mistakes
│   │   ├── practical.html      # Practical notes not usually covered in class
│   │   ├── applications.html   # Where this technique shows up in the real world
│   │   └── project.html        # This module's real project brief
│   └── _templates/         # Templates for adding new module content
├── lib/                    # Content loading, module metadata, utilities
│   └── modules-data.generated.json   # Auto-generated from /content — never hand-edited
├── public/                 # Static assets
├── scripts/
│   └── generate-modules.mjs   # Scans /content and generates module metadata
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- npm (comes with Node.js)

### Setup

```bash
# clone the repo
git clone https://github.com/MohsenSafari83/opencv-learning-log.git
cd opencv-learning-log

# install dependencies
npm install

# run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

> `npm run dev` and `npm run build` both automatically run `scripts/generate-modules.mjs` first (via the `predev`/`prebuild` hooks), which scans `/content` and regenerates `lib/modules-data.generated.json`. You never need to run it manually or hand-edit that file.

```bash
# production build
npm run build
npm run start
```

## Content Status

| Module | Notes | Exercises | Cheat Sheet | Applications | Project |
|---|---|---|---|---|---|
| 1 – Thresholding & Binarization | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 – Morphological Operations | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 – Connected Components & Contours | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4–9 | 🚧 planned | | | | |

Module status is generated automatically from `/content` — see `scripts/generate-modules.mjs`.

## Credits

- Course structure based on [class.vision](https://github.com/Alireza-Akhavan/class.vision) by Alireza Akhavan
- Built and maintained by [@MohsenSafari83](https://github.com/MohsenSafari83)

## License

This repository documents personal coursework and learning notes. Course notebooks referenced from class.vision remain under their original license — see that repository for details.
