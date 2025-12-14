import { createRoot } from "react-dom/client";
import { App } from "./App";
import './index.css';

const initializeTheme = () => {
  const htmlElement = document.documentElement;
  const body = document.body;
  const root = document.getElementById('root');
  
  htmlElement.classList.remove('dark');
  htmlElement.style.colorScheme = 'light';
  body.style.backgroundColor = '#FCFCF7';
  body.style.color = '#263238';
  if (root) {
    root.style.backgroundColor = '#FCFCF7';
    root.style.color = '#263238';
  }
  
  const stored = localStorage.getItem('ui-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const darkMode = parsed?.state?.darkMode ?? false;
      if (darkMode) {
        htmlElement.classList.add('dark');
        htmlElement.style.colorScheme = 'dark';
        body.style.backgroundColor = '#0F0F0F';
        body.style.color = '#FFFFFF';
        if (root) {
          root.style.backgroundColor = '#0F0F0F';
          root.style.color = '#FFFFFF';
        }
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.style.colorScheme = 'light';
        body.style.backgroundColor = '#FCFCF7';
        body.style.color = '#263238';
        if (root) {
          root.style.backgroundColor = '#FCFCF7';
          root.style.color = '#263238';
        }
      }
    } catch (e) {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
      body.style.backgroundColor = '#FCFCF7';
      body.style.color = '#263238';
      if (root) {
        root.style.backgroundColor = '#FCFCF7';
        root.style.color = '#263238';
      }
    }
  } else {
    htmlElement.classList.remove('dark');
    htmlElement.style.colorScheme = 'light';
    body.style.backgroundColor = '#FCFCF7';
    body.style.color = '#263238';
    if (root) {
      root.style.backgroundColor = '#FCFCF7';
      root.style.color = '#263238';
    }
  }
};

initializeTheme();

function start() {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
