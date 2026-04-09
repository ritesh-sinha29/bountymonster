<div align="center">
  <h1>🐉 Bounty Monster 🐉</h1>
  <p><strong>Hunt Bounties. Earn XP. Level Up Your Character.</strong></p>
  <p>Welcome to the official repository of <strong>Bounty Monster</strong>, the ultimate gamified task and bounty-hunting platform.</p>
</div>

---

## 📖 About The Project

**Bounty Monster** is a next-generation platform designed to revolutionize how individuals and organizations create, manage, and complete tasks (bounties). By blending productivity with RPG-style gamification, we make getting things done highly engaging and rewarding.

Users create customizable "Characters", gain Experience Points (XP), maintain streaks, and climb the Leaderboards by successfully completing Quest Submissions. Creators can publish bounties with specific tasks, set XP/Reward pools, and review hunter submissions seamlessly.

## ✨ Core Features

- **Gamified Profiles:** Create and customize a Character avatar. Earn XP and level up as you complete bounties.
- **Bounty Creation & Management:** Publish active bounties, set reward amounts & XP, and establish required levels.
- **Quest Submissions:** Hunters can take on bounties by submitting proof-of-work (URLs, notes) for review.
- **Approval Workflow:** Creators can approve or reject submissions securely.
- **Leaderboards & Analytics:** Track top hunters globally and view personal progress and completed tasks.
- **Daily Streaks & Bonuses:** Keep the momentum going with daily login bonuses and milestone claims.
- **Premium Tiers:** Built-in subscription plans (Free, Pro, Elite) using Razorpay for access to premium hunts and features.
- **Real-time Notifications:** Web-socket based instant notifications for bounty updates, approvals, and level-ups.

## 🛠 Tech Stack

Our platform is engineered for scale, responsiveness, and developer experience using modern web technologies:

- **Framework:** [Next.js 16](https://nextjs.org/) (React 19)
- **Backend & Real-time Database:** [Convex](https://www.convex.dev/)
- **Authentication:** [Clerk](https://clerk.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (shadcn/ui customized)
- **Payments:** [Razorpay](https://razorpay.com/)
- **File Uploads:** [UploadThing](https://uploadthing.com/)
- **Error Tracking:** [Sentry](https://sentry.io/)

## 📂 Project Structure

The project is structured modularly within the `src/modules` directory for high maintainability:

```text
src/
 ├── modules/
 │    ├── analytics/     # User performance and progress tracking
 │    ├── auth/          # Authentication flows and Clerk integrations
 │    ├── bounty/        # Core bounty viewing, creation, and submission logic
 │    ├── characters/    # Avatar, XP, level, and player character management
 │    ├── home/          # Main dashboard and landing views
 │    ├── leaderboard/   # Rankings and competitive elements
 │    ├── subscription/  # Razorpay integrations and plan/tier management
 │    └── web/           # Generic shared UI elements and marketing pages
```

Backend logic, schema, and real-time functions reside in the `/convex` directory at the project root.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have [pnpm](https://pnpm.io/) installed:

```bash
npm install -g pnpm
```

You will also need API keys for:

- Clerk
- Convex
- Razorpay
- UploadThing
- Sentry

**Linting & Formatting**
Please ensure your code passes our linting rules before submitting:

```bash
pnpm lint
pnpm format
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <i>Built with ❤️ by the Bounty Monster Team.</i>
</div>
