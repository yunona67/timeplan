@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

html,
body,
#root {
  min-height: 100%;
  height: 100%;
  margin: 0;
}

body {
  @apply bg-slate-100 text-slate-900 antialiased;
}

.dark body {
  @apply bg-slate-950 text-slate-100;
}

button,
input,
select,
textarea {
  font: inherit;
}

* {
  box-sizing: border-box;
}

.card {
  @apply rounded-2xl border border-slate-200 bg-white/90 shadow-soft dark:border-slate-800 dark:bg-slate-900/90;
}

chip {
  @apply inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200;
}

button {
  @apply transition-all duration-200;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  @apply rounded-full bg-slate-300 dark:bg-slate-600;
}
