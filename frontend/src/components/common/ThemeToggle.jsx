import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-panel transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      <span className="text-lg">{isDarkMode ? "☀" : "☾"}</span>
      <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
