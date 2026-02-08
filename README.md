# JMC-TEST Professional Portal - Final Build

This folder contains the complete, fully functional source code for the JMC-TEST Professional Portal.

## Project Structure

### Core Pages

- **index.html**: Professional Landing Page with 3D effects.
- **login.html**: Unified Login Page (Student & Staff tabs) with crash-proof authentication.
- **register.html**: Registration Page (Student & Staff) with validation.
- **student-dashboard.html**: Complete Student Dashboard (SPA) with:
  - Test Availability
  - Internal Test Interface (Smooth Scrolling)
  - Analytics (Score Tracking, Pass/Fail Charts)
  - Detailed Result Views (Correct/Wrong Answers)
- **staff-dashboard.html**: Staff Dashboard for creating tests and managing students.

### Assets & Logic

- **css/**: Contains all professional styling (Glassmorphism, Dark Mode).
- **js/**:
  - `db.js`: Professional Data Access Layer (prevents crashes).
  - `dashboard.js`: Unified logic for Student Dashboard & Test Taking.
  - `staff-dashboard.js`: Logic for Staff operations.

## How to Run

1. Open this folder in VS Code or any editor.
2. Use a local server (e.g., Live Server or `http-server`).
   - Run: `npx http-server`
3. Open `http://127.0.0.1:8080` in your browser.

## Logic Flow

1. **Registration**: Users register; data is saved via `db.js`.
2. **Login**: Checks credentials using `db.authenticate()`. Redirects automatically if already logged in.
3. **Student**:
   - Takes tests without leaving the page.
   - Views detailed results with "View Details" button.
4. **Staff**:
   - Creates new tests.
   - Manages student users.

## Maintenance

- Data is stored in the browser's `LocalStorage`.
- To wipe everything and start fresh, you can manually clear your browser's LocalStorage.

_Project Completed Successfully._
