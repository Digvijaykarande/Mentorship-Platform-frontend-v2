import { THEME_STORAGE_KEY } from "./themeConstants";

/**
 * Runs in <head> before the first paint so the saved theme is applied without a flash.
 * Falls back to the OS preference when nothing has been saved yet.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(_){}})();`;
