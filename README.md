# Meal Prep Planner

A mobile-first meal planning app for tracking calories and macros across the week.

## Features

- **Dashboard:** daily and weekly macro progress bars against your targets, plus a weekly chart
- **Meals library:** add, edit and delete meals with calories, protein, carbs, fat, ingredients and method, grouped by category
- **Weekly planner:** a card for each day with per-meal macro bars, tap to swap a meal, and auto-fill for the week
- **Week rollover:** the week rolls over automatically and past weeks are kept in a history you can view and edit
- **Settings:** set your own calorie and macro targets
- **Saved locally:** meals, plans and history are kept in a Pinia store and persisted to localStorage

## Tech stack

Vue 3 (Composition API), TypeScript, Ionic, Capacitor, Pinia, Vue Router, Tailwind CSS, Vite, Vitest, Cypress

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run test:unit` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run end-to-end tests (Cypress) |
| `npm run lint` | Lint the project |

## Project structure

```
src/
├── data/meals.ts        # Seed meals
├── stores/useMealStore.ts
├── views/
│   ├── DashboardView.vue
│   ├── MealsView.vue
│   ├── PlannerView.vue
│   └── SettingsView.vue
└── router/index.ts
```
