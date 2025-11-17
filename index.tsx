import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  // If the root element is not found, display a user-friendly error message in the body.
  document.body.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: sans-serif;
      color: #1f2937;
      background-color: #f0f9ff;
      text-align: center;
      padding: 2rem;
      line-height: 1.6;
    ">
      <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">Application Error</h1>
      <p style="font-size: 1.125rem; max-width: 600px; color: #4b5563;">
        We're sorry, but the application failed to start because a critical element on the page is missing.
      </p>
      <p style="font-size: 0.875rem; color: #718096; margin-top: 2rem; border-top: 1px solid #e5e7eb; padding-top: 1rem; max-width: 600px;">
        <strong>Technical Details:</strong> The HTML element with <code>id="root"</code> could not be found.
      </p>
    </div>
  `;
  // Also log the error to the console for developers.
  console.error("Fatal: Could not find root element to mount to. Application cannot start.");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
