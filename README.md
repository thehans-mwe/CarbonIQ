<div align="center">

# 🌍 CarbonIQ

### Track your carbon footprint. Understand your impact. Take action.

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-carboniq--six.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://carboniq-six.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=flat-square&logo=framer&logoColor=white)](https://motion.dev)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

<br />

<img src="https://raw.githubusercontent.com/thehans-mwe/CarbonIQ/main/public/favicon.svg" width="80" alt="CarbonIQ Logo" />

<br />

*A premium, dark-theme carbon impact tracker with real-time API calculations,*
*AI-powered recommendations, and competition-grade micro-interactions.*

---

</div>

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Multi-Step Wizard** | 4-step calculator (Transport → Energy → Flights → Diet) with horizontal slide animations and animated progress bar |
| **Glassmorphic UI** | Floating cards with backdrop blur, animated gradient borders, and cursor spotlight effect |
| **Dramatic Result Reveal** | Sequential 4-stage reveal — particle burst, animated score ring, comparison bars, then full dashboard |
| **Emotional UI** | Ambient glow color shifts based on your footprint: 🟢 green (excellent) → 🟡 gold (good) → 🟠 amber (average) → 🔴 red (high) |
| **Real API Integration** | Carbon Interface API for live emission estimates with smart offline fallback |
| **AI Recommendations** | OpenAI GPT-4o-mini generates personalized tips ranked by impact and savings |
| **EPA-Accurate Data** | Emission factors sourced from EPA 2024, DEFRA 2024, and IPCC AR6 |
| **Interactive Charts** | Weekly trend, daily breakdown, and category pie charts via Recharts |
| **Demo Mode** | One-click demo account with preloaded data — no setup required |

<br />

## 🎨 Design Language

- **Color Scheme** — Pure black backgrounds with gold accent palette (`#d4a017`, `#f5c842`, `#e6b830`)
- **Typography** — [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) serif headings + [Inter](https://rsms.me/inter/) body text
- **Animations** — SolarVision-inspired blur reveals with custom `cubic-bezier(0.22, 1, 0.36, 1)` easing
- **Effects** — Cursor spotlight, floating parallax orbs, noise texture overlay, rotating conic-gradient borders

<br />

## 🛠️ Tech Stack

```
Frontend        React 18 · Vite 6 · Tailwind CSS 3.4
Animation       Framer Motion 11 · react-countup
Charts          Recharts 2.15
APIs            Carbon Interface · OpenAI GPT-4o-mini
Deployment      Vercel (Serverless Functions + Static)
```

<br />

## 📁 Project Structure

```
CarbonIQ/
├── api/
│   ├── carbon.js            # Vercel serverless — Carbon Interface API proxy
│   └── recommend.js         # Vercel serverless — OpenAI recommendations
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Calculator.jsx       # Multi-step wizard with glowing inputs
│   │   ├── ResultsDashboard.jsx # Dramatic reveal + emotional UI
│   │   ├── Hero.jsx             # Landing hero with blur reveal
│   │   ├── Navbar.jsx           # Fixed nav with section routing
│   │   ├── Dashboard.jsx        # Preview charts (landing page)
│   │   ├── Features.jsx         # Feature cards with stagger entrance
│   │   ├── Testimonials.jsx     # Reviews with DiceBear avatars
│   │   ├── About.jsx            # Privacy notice + values
│   │   ├── CTA.jsx              # Call to action
│   │   └── Footer.jsx           # Shimmer divider footer
│   ├── services/
│   │   ├── api.js               # API client with offline fallback
│   │   ├── offlineCalc.js       # EPA/DEFRA/IPCC emission factors
│   │   └── demoData.js          # Demo account data
│   ├── App.jsx                  # View state management
│   └── index.css                # Global styles, glass utilities
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── package.json
```

<br />

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/thehans-mwe/CarbonIQ.git
cd CarbonIQ

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Environment Variables (optional)

Create a `.env` file for full API functionality:

```env
CARBON_API_KEY=your_carbon_interface_api_key
OPENAI_API_KEY=your_openai_api_key
```

> Without API keys, the calculator falls back to accurate offline calculations using EPA/DEFRA emission factors. AI recommendations are replaced with curated offline tips.

<br />

## 📊 How It Works

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  User Input  │────▶│  Carbon Interface │────▶│  Results Dashboard │
│  (4 steps)   │     │  API / Offline    │     │  + AI Tips         │
└─────────────┘     └──────────────────┘     └───────────────────┘
                           │                          │
                           ▼                          ▼
                    EPA 2024 Factors           OpenAI GPT-4o-mini
                    DEFRA 2024                 Personalized recs
                    IPCC AR6                   Impact + savings
```

**Green Score Formula** — Weighted across 4 categories:
- 🚗 Transport: 30% · ⚡ Energy: 30% · ✈️ Flights: 20% · 🥗 Diet: 20%
- Benchmarked against US per-capita weekly average (~182 kg CO₂)

<br />

## 🌐 Deployment

The app is deployed on **Vercel** with serverless functions for API proxying:

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

<br />

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

<br />

<div align="center">

---

**Built with ☕ and a carbon-conscious mindset.**

[Live Demo](https://carboniq-six.vercel.app) · [Report Bug](https://github.com/thehans-mwe/CarbonIQ/issues) · [Request Feature](https://github.com/thehans-mwe/CarbonIQ/issues)

</div>
