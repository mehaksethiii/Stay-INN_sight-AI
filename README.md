# INN Sight AI — Guest Review Classifier System

An intelligent review classifier system which is capable of classifying customer reviews into three categories: positive, negative, and neutral. The system automatically identifies guest satisfaction level, detects recurring complaints, keeps track of customer visits, and generates actionable recommendations for homestay management.

---

## Week 2 — Frontend Skeleton

Built the full frontend skeleton of the app using React and Bootstrap.

- Home page with Navbar, Hero section, 3 Cards in a grid, and Footer
- 3 additional page routes: About, Dashboard, Login — each with Navbar, Footer, and placeholder content
- All 4 core components (Navbar, Hero, Card, Footer) are in the `/components` folder
- Routing set up using React Router DOM
- Layout is responsive across mobile and desktop

---

## Week 3 — UI/UX & Component Library

Built a reusable component library and added dark/light mode toggle.

### Component Library — `/components/ui/`

5 reusable UI components built with Bootstrap:

- **Button** — supports variant (primary, secondary, outline), size (sm, md, lg), disabled state
- **Input** — supports label, placeholder, type, value, onChange, and error display
- **Modal** — supports isOpen, onClose, title, and children; closes on Escape key
- **Toast** — notification that appears briefly and auto-dismisses after 3 seconds
- **Loader** — spinner component to show during data fetching

All components are exported from a single `index.js` file for clean imports.

### Dark/Light Mode

- Toggle button in the Navbar switches between dark and light theme
- Choice is saved in `localStorage` so it persists on page refresh

---

## Week 4 — Backend & API Development

Built the full backend using Node.js and Express, connected it to the frontend, and deployed the entire app live.

### Live URLs
- **Frontend (Vercel):** [https://stay-inn-sight-ai-f3ov.vercel.app](https://stay-inn-sight-ai-f3ov.vercel.app)
- **Backend API (Render):** [https://stay-inn-sight-ai.onrender.com](https://stay-inn-sight-ai.onrender.com)

### What was built
- 7 REST API endpoints — get all reviews, get single, add, update, delete, search, filter
- Rule-based sentiment classifier — automatically detects positive, neutral, or negative from review text
- Auto theme detection — food, host, location, cleanliness, value, experience
- Auto management response generation based on sentiment and theme
- Dashboard connected to live API with Add Review form
- Firebase Google Authentication added on Login page

### Run Frontend
```bash
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000)

### Run Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on [http://localhost:5000](http://localhost:5000)

> Both frontend and backend must run simultaneously for full functionality.
