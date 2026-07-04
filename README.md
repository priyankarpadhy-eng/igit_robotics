# IGIT Robotics Society — Official Website

The official website for the IGIT Robotics Society at Indira Gandhi Institute of Technology, Sarang. A high-fidelity, single-page React application with GSAP-powered animations, a Vanta.js 3D globe, and a smooth Lenis scroll experience.

---

## Tech Stack

| Layer       | Technology                                              |
|-------------|---------------------------------------------------------|
| Frontend    | React 19 + Vite 8                                       |
| Styling     | Vanilla CSS (custom design system)                      |
| Animations  | GSAP 3 + ScrollTrigger + Lenis (smooth scroll)          |
| 3D / WebGL  | Vanta.js (Globe), Three.js, React Three Fiber           |
| Backend     | Express.js (API proxy)                                  |
| Database    | Supabase (Firestore indexes also present)               |
| Deployment  | Firebase Hosting / Vercel                               |

---

## Project Structure

```
robotics/
├── frontend/               # Vite + React SPA
│   ├── public/             # Static assets (images, icons, logos)
│   │   ├── club-logo.png           # Club logo used in Navbar & Footer
│   │   ├── satys-sworup.png        # Profile image: Satya Sworup Pradhan
│   │   ├── pritiparna-nayak.png    # Profile image: Pritiparana Nayak
│   │   ├── pritish-kumar-nayak.png # Profile image: Pritish Nayak
│   │   ├── profile-icon.jpg        # Default fallback profile icon
│   │   ├── team_section_bg.png     # Background for the Team section
│   │   ├── cool-bg.svg            # Decorative background
│   │   ├── favicon.svg            # Browser tab icon
│   │   └── icons.svg              # Icon sprite sheet
│   └── src/
│       ├── pages/Home.jsx  # Main page (all sections live here)
│       ├── App.jsx          # Root component with router
│       ├── App.css          # Global component styles
│       ├── index.css        # Design tokens & base styles
│       ├── components/      # Shared UI components
│       ├── context/         # React context providers
│       ├── hooks/           # Custom React hooks
│       ├── services/        # API service layer
│       └── assets/          # Imported assets (campus image, etc.)
├── backend/                # Express API server
│   ├── server.js           # Entry point
│   └── middleware/         # Express middleware
├── package.json            # Root workspace config (npm workspaces)
├── firebase.json           # Firebase hosting config
└── supabase_schema.sql     # Database schema reference
```

---

## Adding Profile Images

Profile images are placed in `frontend/public/` and referenced by filename in `Home.jsx`.

### Current profiles using images:

| Person                  | File                            | Referenced in `Home.jsx`       |
|-------------------------|---------------------------------|--------------------------------|
| Satya Sworup Pradhan    | `frontend/public/satys-sworup.png`        | `/satys-sworup.png`   |
| Pritiparana Nayak       | `frontend/public/pritiparna-nayak.png`    | `/pritiparna-nayak.png` |
| Pritish Nayak           | `frontend/public/pritish-kumar-nayak.png` | `/pritish-kumar-nayak.png` |

### To add a new profile image:

1. Place the image in `frontend/public/` (PNG recommended, square aspect ratio).
2. Name it in kebab-case matching the person's name, e.g. `john-doe.png`.
3. In `Home.jsx`, find the member data arrays inside `TeamSection` (~line 760–790) and add an `img` property:
   ```js
   { n: 'John Doe', r: 'Role Title', c: '#95d5b2', b: '44th Batch', img: '/john-doe.png' }
   ```
4. If no `img` is provided, the fallback `/profile-icon.jpg` is used automatically.

### Image guidelines:
- **Format**: PNG or JPG
- **Size**: ~400×400px minimum, square crop preferred
- **File size**: Keep under 1 MB for fast loading

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+

### Install & Run

```bash
# Clone the repo
git clone https://github.com/priyankarpadhy-eng/igit_robotics.git
cd igit_robotics

# Install all workspace dependencies
npm install

# Run both frontend & backend concurrently
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API on its configured port.

### Run individually

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Build for production

```bash
npm run build
```

---

## Environment Variables

Create `.env` files from the templates:

**`frontend/.env`** — Supabase & Firebase keys  
**`backend/.env`** — API keys and secrets

> These files are gitignored. Ask a maintainer for the values.

---

## Sections Overview

| Section          | Description                                                    |
|------------------|----------------------------------------------------------------|
| **Hero**         | Full-screen landing with campus image and animated tagline     |
| **Ticker**       | Scrolling marquee with club stats                              |
| **Deconstructed Flip** | Interactive project showcase cards                       |
| **Gallery**      | Auto-scrolling image rows with lightbox modal                  |
| **Events**       | Event cards with dates, locations, status badges               |
| **Achievements** | Club milestones and competition wins                           |
| **Our People**   | Team profiles with Vanta.js 3D globe background               |
| **Footer**       | Links, social media, and club branding                         |

---

## Deployment

### Firebase Hosting

```bash
# Build the frontend
npm run build -w frontend

# Deploy
npx firebase deploy --only hosting
```

### Vercel

Connect the GitHub repo to Vercel. Set the **Root Directory** to `frontend` and the **Build Command** to `npm run build`. The **Output Directory** is `dist`.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is maintained by the IGIT Robotics Society, IGIT Sarang.
