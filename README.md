# Parental Legacy & Life Factors Calculator

A React app that takes a Date of Birth and generates a deterministic
"Mother vs Father" breakdown across 7 life factors, visualized with charts.

## Tech stack
- React 18 (functional components + hooks), Vite
- Recharts for data visualization
- Plain CSS (custom design system, no framework)
- localStorage for save/history (no backend required)

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## How the calculation works

The brief gives two constraints that don't sit on the same numeric scale:

1. Each factor has its own fixed `[min, max]` range for its **Total**
   (Mother + Father), e.g. Genetic Inheritance is 9.333-10.777.
2. The **grand total** (sum of all Mother values + sum of all Father values)
   must equal exactly 100.

If you add up the seven ranges directly, they land around 47-54, not 100.
So this implementation treats each factor's range as a **relative weight**:

1. For a given DOB, pick a value inside each factor's own range,
   deterministically derived from the date (same DOB always gives the same result).
2. Rescale all seven factor totals proportionally so they sum to exactly 100.
3. Split each factor's total between Mother and Father based on the
   day-of-month rule:
   - **Odd day** -> Mother's share is higher (54-66%, varies per factor)
   - **Even day** -> Father's share is higher
4. Mother Total + Father Total = 100 always holds, and Mother + Father = Total
   holds for every individual factor.

All logic lives in `src/utils/calculator.js`, fully commented.

> This is a deterministic, seeded calculation for demo purposes, not a
> genetic or scientific claim. It's a consistent way to turn a date into a
> structured chart.

## Features implemented
- [x] Date picker with validation (no future dates, valid date required)
- [x] Auto-calculation on date selection
- [x] Mother / Father / Total per factor, in a table
- [x] Mother Total, Father Total, Grand Total (= 100)
- [x] Dominant parent banner
- [x] Bar chart (per-factor comparison) + donut chart (overall split)
- [x] Responsive layout (mobile breakpoint included)
- [x] Bonus: CSV export
- [x] Bonus: PDF export (print-to-PDF, scoped with `@media print`)
- [x] Bonus: Dark/Light mode toggle
- [x] Bonus: Save results to localStorage + history list

## Project structure

```
src/
  utils/
    calculator.js       # core calculation engine (documented above)
    exporters.js         # CSV/PDF export + localStorage helpers
  components/
    DOBForm.jsx           # date input + validation
    TotalsSummary.jsx      # Mother/Father/Grand total cards + banner
    FactorTable.jsx        # per-factor rows + lineage bar
    LegacyCharts.jsx       # Recharts bar + pie charts
    SavedHistory.jsx       # localStorage history list
  App.jsx / App.css        # layout, state, design system
```

## Deployment
This is a static Vite app, deploy the `dist/` folder to Vercel, Netlify, or
GitHub Pages. See the step-by-step guide the app was delivered with for
exact commands.
