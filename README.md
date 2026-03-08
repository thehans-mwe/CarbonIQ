<div align="center">

<a href="https://carboniq-six.vercel.app">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,50:d4a017,100:f5c842&height=240&section=header&text=🌍%20CarbonIQ&fontSize=70&fontColor=ffffff&fontAlignY=30&desc=Your%20carbon%20footprint.%20Measured.%20Understood.%20Reduced.&descSize=18&descAlignY=52&descColor=d1d5db&animation=fadeIn" width="100%" />
</a>

<br />

<a href="https://carboniq-six.vercel.app">
  <img src="https://readme-typing-svg.demolab.com?font=Cormorant+Garamond&weight=600&size=30&duration=3000&pause=1500&color=D4A017&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=80&lines=Science-Backed+Carbon+Intelligence;EPA+2025+%C2%B7+AI-Powered+%C2%B7+Works+Offline" alt="Typing SVG" />
</a>

<br /><br />

[![Live Demo](https://img.shields.io/badge/▶_LIVE_DEMO-carboniq--six.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=f5c842)](https://carboniq-six.vercel.app)
&nbsp;&nbsp;
[![Stars](https://img.shields.io/github/stars/thehans-mwe/CarbonIQ?style=for-the-badge&logo=github&logoColor=f5c842&color=000&labelColor=0a0a0a)](https://github.com/thehans-mwe/CarbonIQ)

<br />

![React 18](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite 6](https://img.shields.io/badge/Vite_6-0a0a0a?style=flat-square&logo=vite&logoColor=646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0a0a0a?style=flat-square&logo=tailwindcss&logoColor=06B6D4)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0a0a0a?style=flat-square&logo=framer&logoColor=FF0055)
![Recharts](https://img.shields.io/badge/Recharts-0a0a0a?style=flat-square&logo=chartdotjs&logoColor=f5c842)
![GPT-4o-mini](https://img.shields.io/badge/GPT--4o--mini-0a0a0a?style=flat-square&logo=openai&logoColor=00A67E)
![Vercel](https://img.shields.io/badge/Vercel-0a0a0a?style=flat-square&logo=vercel&logoColor=white)

<br /><br />

> **5 questions. 2 minutes. Science-backed emissions breakdown.**
> **Personalized AI recommendations to shrink your carbon footprint.**

<br />

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

</div>

<br />

## ✦ What is CarbonIQ?

CarbonIQ is a **premium carbon footprint calculator** that transforms 5 quick lifestyle questions into a detailed emissions breakdown with personalized AI-powered recommendations. It combines real-time API calculations with a graceful offline-first architecture, ensuring reliable results whether you're connected or not.

**No data is stored. No accounts required. Completely free.**

<br />

## <img src="https://media.giphy.com/media/WUlplcMpOCEmTGBtBW/giphy.gif" width="28"> Features

<table>
<tr>
<td width="50%">

### 🧮 Multi-Step Calculator
5-step wizard with animated horizontal slides<br />
**Transport → Energy → Flights → Diet → Lifestyle**<br />
<sub>Custom range sliders · Card selectors · Custom dropdown · Progress bar</sub>

</td>
<td width="50%">

### 🧠 AI Recommendations
GPT-4o-mini generates personalized reduction tips<br />
**Ranked by impact · Estimated kg CO₂ savings**<br />
<sub>Structured JSON output · Curated offline fallback tips</sub>

</td>
</tr>
<tr>
<td width="50%">

### 📊 Results Dashboard
Comprehensive emissions breakdown with visualizations<br />
**Green Score (0-100) · Category bars · Equivalencies**<br />
<sub>Trees absorbed · Driving km equivalent · Percentile ranking</sub>

</td>
<td width="50%">

### 🔮 What-If Simulator
Interactive sliders to model behavior changes<br />
**"What if I switched to an EV?" → Live kg CO₂ saved**<br />
<sub>Real-time recalculation · Visual savings feedback</sub>

</td>
</tr>
<tr>
<td width="50%">

### 🌐 Offline-First Architecture
Works without internet using verified emission factors<br />
**EPA 2025 · DEFRA 2025 · Scarborough et al. 2023**<br />
<sub>Auto-detects connectivity · Seamless API fallback</sub>

</td>
<td width="50%">

### 🎨 Glassmorphic Design
Dark luxury UI with gold accents and micro-interactions<br />
**Frosted glass cards · Mouse-tracking glow · Floating orbs**<br />
<sub>Framer Motion springs · Scroll-triggered reveals · Gold accent bars</sub>

</td>
</tr>
</table>

<br />

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />
</div>

<br />

## 🔬 Emission Factor Sources

CarbonIQ uses peer-reviewed and government-published data — the same sources used by professionals:

| Category | Source | Data |
|:---------|:-------|:-----|
| 🚗 **Transport** | EPA 2025 — *GHG from a Typical Passenger Vehicle* | 0.400 kg CO₂/mi (gasoline) |
| ⚡ **Electricity** | EPA eGRID2022 — US national grid average | 0.373 kg CO₂/kWh |
| 🔥 **Natural Gas** | EPA GHG Emission Factors Hub 2025 | 5.29 kg CO₂/therm |
| ✈️ **Short Flights** | DEFRA 2025 GHG Conversion Factors | 255 kg CO₂e/flight |
| ✈️ **Long Flights** | DEFRA 2025 (incl. radiative forcing) | 1,102 kg CO₂e/flight |
| 🥗 **Diet** | Scarborough et al. 2023 (*Nature Food*) | 2.89–7.19 kg CO₂e/day |
| 📱 **Streaming** | IEA 2024 — Data centre emissions | 0.036 kg CO₂e/hr |
| 🔋 **EV Efficiency** | DOE 2023 | 3.60 mi/kWh |

<br />

## 🏗️ Architecture

```
                    ┌──────────────────────────────────┐
                    │         React Frontend           │
                    │   Calculator → Results → What-If │
                    └────────────┬─────────────────────┘
                                 │
                    ┌────────────┴─────────────────────┐
                    │         Online?                   │
                    │    ┌────────┬────────┐            │
                    │    ▼ YES   │        ▼ NO          │
                    │  Vercel    │   Local Calc Engine  │
                    │  Serverless│   EPA/DEFRA/IPCC     │
                    │  Functions │   Curated Tips       │
                    │    │       │        │             │
                    │    ▼       │        ▼             │
                    │  Carbon    │   offlineCalc.js     │
                    │  Interface │                      │
                    │  API       │                      │
                    │    +       │                      │
                    │  OpenAI    │                      │
                    │  GPT-4o   │                      │
                    └────────────┴─────────────────────┘
                                 │
                    ┌────────────┴─────────────────────┐
                    │          Results Dashboard        │
                    │  Green Score · Charts · AI Tips   │
                    │  Equivalencies · What-If Simulator│
                    └──────────────────────────────────┘
```

<br />

## 🎯 Green Score

A weighted score (0-100) benchmarked against US per-capita averages:

| Category | Weight | Benchmark |
|:---------|:------:|:----------|
| 🚗 Transport | 25% | 77 kg CO₂/week |
| ⚡ Energy | 25% | 51 kg CO₂/week |
| 🥗 Diet | 20% | 39.4 kg CO₂/week |
| ✈️ Flights | 15% | 10 kg CO₂/week |
| 🛍️ Lifestyle | 15% | 13 kg CO₂/week |

**Score tiers:**

| Score | Tier | Color |
|:-----:|:-----|:------|
| 85+ | 🌿 Eco Master | Emerald |
| 60-84 | 🌍 Conscious Citizen | Amber |
| 30-59 | ⚠️ Room to Grow | Orange |
| < 30 | 🔥 Just Getting Started | Red |

US weekly average: **~182 kg CO₂** — percentile calculated using tanh-based distribution.

<br />

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />
</div>

<br />

## 🎨 Design System

<table>
<tr>
<td align="center" width="20%">
<br />
<img src="https://img.shields.io/badge/_%20-000000?style=for-the-badge" /><br />
<img src="https://img.shields.io/badge/_%20-0a0a0a?style=for-the-badge" /><br />
<img src="https://img.shields.io/badge/_%20-d4a017?style=for-the-badge" /><br />
<img src="https://img.shields.io/badge/_%20-f5c842?style=for-the-badge" /><br />
<img src="https://img.shields.io/badge/_%20-c49b12?style=for-the-badge" /><br />
<br />
<sub><b>Gold on Black</b></sub>
</td>
<td width="80%">

| Element | Implementation |
|:--------|:---------------|
| **Background** | Pure black `#000` with floating gold orbs + subtle grid pattern |
| **Cards** | Glassmorphism — `backdrop-blur(20px) saturate(150%)` + gold accent bar on hover |
| **Typography** | [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) headings + [Inter](https://rsms.me/inter/) body |
| **Interactions** | Mouse-tracking radial glow · Spring physics hover · Scroll-triggered reveals |
| **Easing** | `cubic-bezier(0.16, 1, 0.3, 1)` — buttery deceleration curve |
| **Effects** | Noise texture overlay · Animated gradient text · Badge pulse · Gold dividers |

</td>
</tr>
</table>

<br />

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|:------|:-------------|
| **UI** | React 18 · Tailwind CSS 3.4 · Framer Motion 11 |
| **Build** | Vite 6 |
| **Charts** | Recharts 2.15 · react-countup |
| **AI** | OpenAI GPT-4o-mini (via Vercel serverless) |
| **APIs** | Carbon Interface API (vehicle/electricity/flights) |
| **Deploy** | Vercel (static + serverless functions) |

</div>

<br />

## 📁 Project Structure

```
CarbonIQ/
├── api/                          # Vercel serverless functions
│   ├── carbon.js                 # Carbon Interface API proxy
│   └── recommend.js              # OpenAI GPT-4o-mini recommendations
│
├── public/
│   └── favicon.svg               # Gold leaf logo
│
├── src/
│   ├── components/
│   │   ├── Calculator.jsx        # 5-step wizard with sliders & custom dropdowns
│   │   ├── ResultsDashboard.jsx  # Score ring, category bars, equivalencies, AI tips
│   │   ├── WhatIfSimulator.jsx   # Interactive behavior-change modeling
│   │   ├── Hero.jsx              # Landing hero with parallax + floating cards
│   │   ├── Navbar.jsx            # Fixed nav with cross-view section routing
│   │   ├── Dashboard.jsx         # Preview charts (area + pie) on landing
│   │   ├── Features.jsx          # Bento grid feature cards
│   │   ├── Testimonials.jsx      # Review cards with DiceBear avatars
│   │   ├── About.jsx             # Milestones, values, creator
│   │   ├── CTA.jsx               # Call to action
│   │   ├── Footer.jsx            # Footer with shimmer divider
│   │   ├── BackgroundEffects.jsx # Floating orbs, grid, noise overlay
│   │   ├── BackToTop.jsx         # Scroll-triggered back-to-top
│   │   └── SplashScreen.jsx      # Loading screen
│   │
│   ├── services/
│   │   ├── api.js                # API client with auto offline fallback
│   │   ├── offlineCalc.js        # EPA 2025 / DEFRA 2025 emission factors
│   │   └── demoData.js           # Demo mode preloaded data
│   │
│   ├── App.jsx                   # View routing + state management
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles + animations + glassmorphism
│
├── index.html                    # Vite entry
├── vite.config.js                # Vite + Tailwind + PostCSS (unified config)
├── vercel.json                   # Serverless routing
└── package.json
```

<br />

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />
</div>

<br />

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/thehans-mwe/CarbonIQ.git
cd CarbonIQ

# Install dependencies
npm install

# Start development server
npm run dev
```

> Opens at `http://localhost:5173`

### Environment Variables <sub>(optional)</sub>

Create a `.env` file in the root:

```env
CARBON_API_KEY=your_carbon_interface_api_key
OPENAI_API_KEY=your_openai_api_key
```

<details>
<summary><b>💡 Works perfectly without API keys</b></summary>
<br />

Without keys, the app automatically falls back to **accurate offline calculations** using:
- **EPA 2025** emission factors for transport & energy
- **DEFRA 2025** for flights (including radiative forcing)
- **Scarborough et al. 2023** for dietary emissions
- **Curated offline tips** instead of AI recommendations

The offline engine uses the same peer-reviewed data — results are equally reliable.

</details>

### Build & Deploy

```bash
# Production build
npm run build

# Deploy to Vercel
npx vercel --prod
```

<br />

## 🔒 Privacy

- **Zero data storage** — nothing is saved, logged, or sent to third parties
- **No accounts** — no sign-up, no cookies, no tracking
- **API calls proxy through Vercel serverless** — your API keys are never exposed to the client
- **Open source** — verify everything yourself

<br />

## 📝 License

Open source under the [MIT License](LICENSE).

<br />

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,50:d4a017,100:f5c842&height=120&section=footer" width="100%" />

<br />

**Built with ☕ and a carbon-conscious mindset.**

<br />

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-carboniq--six.vercel.app-d4a017?style=for-the-badge&logo=vercel&logoColor=white)](https://carboniq-six.vercel.app)

<sub>
<a href="https://github.com/thehans-mwe/CarbonIQ/issues">Report Bug</a> · <a href="https://github.com/thehans-mwe/CarbonIQ/issues">Request Feature</a>
</sub>

</div>
