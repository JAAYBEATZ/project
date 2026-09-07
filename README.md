# Trade Core — Web

A trading journal that runs entirely in your browser. No backend, no build tooling
beyond Vite, no native modules — this exists specifically to sidestep the
Expo/Android install issues from the mobile attempt.

Data is stored in **localStorage**, scoped to your browser on this machine.

## Run it

```bash
cd tradecore-web
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## Design

- **Palette**: near-black graphite base (`#0B0D10`) with a warm amber signature
  accent (`#D98E3B`) — green/red are reserved strictly for gains and losses,
  not used decoratively.
- **Type**: Space Grotesk for headers, Inter for UI text, JetBrains Mono for
  every number (prices, P&L, dates) so figures line up like a real ledger.
- **Signature element**: the "ledger rule" — a hairline with an amber tick,
  echoing a candlestick wick, marking each section head.

## Structure

```
src/types/trade.ts       same 10-field schema as the mobile version
src/storage/store.ts     localStorage read/write, stats, streaks, market/weekday breakdowns
src/storage/notesStore.ts notebook entries, stored separately from trades
src/components/
  Sidebar.tsx             nav + Add Trade CTA
  TopBar.tsx              page title, New Trade button, bell, avatar
  StatCard.tsx            figure + period-over-period delta + info tooltip
  WinRateDonut.tsx        win % by trades / by days
  PLCalendar.tsx          color-coded monthly calendar
  PLChart.tsx             Cumulative (area, gradient) / Daily (bar) toggle
  RecentTradesTable.tsx   recent trades / open positions tabs
  DashboardHeader.tsx     date range + account selector
src/pages/
  Dashboard.tsx           full TradeZella-style overview
  CalendarPage.tsx        TradesViz-style calendar: weekly totals, tags, filters, performance panel
  DailyJournal.tsx        trades grouped by day
  TradeLog.tsx            full sortable/filterable trade table
  Reports.tsx             streaks, best/worst trade, by-market and by-weekday breakdowns
  Notebook.tsx            freeform notes, separate from trade-specific journaling
  AddTrade.tsx            full 10-section entry form, including tags
  TradeDetail.tsx         single trade view + delete
src/components/calendar/  CalendarToolbar, CalendarGrid, DayCell, WeekSummary, FilterPopover, TagBadge, PerformancePanel
src/hooks/useCalendarData.ts   pure aggregation logic (day/week rollups), independent of rendering
src/context/ThemeContext.tsx   light/dark toggle, persisted, drives CSS variables in index.css
```

## Theming

Colors live as CSS variables (`--color-amber`, `--color-gain`, etc., stored as RGB triplets) in
`src/index.css`, referenced from `tailwind.config.js` via the `rgb(var(--x) / <alpha-value>)`
pattern — this keeps Tailwind's opacity modifiers (`bg-amber/15`) working while letting the
whole palette swap at runtime via the `.light` class on `<html>`. Toggle is in the top bar.

## Path to a mobile APK

The Android project is already scaffolded in `android/` (via Capacitor) and points at the built
web app. To turn it into an installable APK:

```bash
npm install
npm run build          # rebuilds dist/ from your latest changes
npx cap copy android    # copies the fresh dist/ into the android project
npx cap open android    # opens Android Studio
```

In Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**. It'll compile using the
Android SDK Android Studio manages for you, and give you a `.apk` in
`android/app/build/outputs/apk/debug/`. You'll need Android Studio installed (it bundles the SDK
and Gradle needed to compile — that's the piece that can't run outside a real machine).

Whenever you change the React app, repeat `npm run build && npx cap copy android` before
rebuilding in Android Studio — that's the sync step between the web code and the native shell.

Data currently lives in `localStorage`, which **does** persist inside the Capacitor WebView on
Android, so no storage changes are required for a first working APK.

## Notes

- Screenshots are stored as embedded data URLs directly in localStorage.
  Browsers cap localStorage around 5–10MB, so this works fine for journaling
  but isn't meant for hundreds of large uncompressed screenshots — worth
  moving to IndexedDB or a small backend later if that becomes a bottleneck.
- Because the data model matches the mobile app exactly, trades logged here
  could later be exported/imported into the APK version once that's built.

## Design language (v2 — glassy iOS-native)

Rebuilt around a frosted-glass visual system: `.glass` utility class (backdrop-blur, translucent
surface, soft border/shadow) applied across all cards, large corner radii (`rounded-2xl`/`rounded-3xl`)
for the true iOS rounded-rect feel, ambient blurred gradient blobs behind the content
(`AmbientBackdrop.tsx`) so the glass has something colorful to blur, and Framer Motion spring
micro-interactions (`whileTap` scale on buttons/tabs). A floating glass bottom tab bar
(`MobileTabBar.tsx`) now covers mobile navigation — previously the sidebar was desktop-only and
mobile had no navigation at all.

## What's new in this rebuild

- **Daily Journal is now a real journal** (`journalStore.ts`, rebuilt `DailyJournal.tsx`): mood tag,
  pre-market plan, and post-market review per day, with that day's trades listed alongside — not
  just a flat trade list grouped by date.
- **Playbooks** (`playbooksStore.ts`, `Playbooks.tsx`): reusable strategy rule checklists. Reference
  a playbook's name in a trade's Setup field to see how consistently you follow your own rules.

## Explicitly out of scope for this build

The full "Trade Journal Pro" spec includes broker API sync (Interactive Brokers, Tradovate, etc.),
live AI trade critique, a Postgres/Redis backend, push notifications, auth/subscription tiers, and
prop-firm challenge tracking. None of that is buildable in a client-only, localStorage-backed app —
it all requires real backend infrastructure (a database, hosted API, broker credentials handling,
and an LLM API integration for the AI insights). If you want to pursue those, the next step is
standing up a backend service (Node/NestJS or Django is fine) and having this frontend talk to it
via REST — the data model in `src/types/trade.ts` maps directly to the `Trade` entity described in
that spec, so migration wouldn't require redesigning the schema.
