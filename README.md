# JMC-TEST Professional Portal - Full Stack Build

This folder contains the complete, fully functional source code for the JMC-TEST Professional Portal, now running on a Node.js backend with SQL Database.

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via Sequelize ORM)

## Getting Started

### Prerequisites

- Node.js installed

### Installation

1. **Install Dependencies**
   Navigate to the `backend` folder and install packages:

   ```bash
   cd backend
   npm install
   ```

2. **Start the Backend Server**

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`.

3. **Run the Frontend**
   Open `index.html` in your browser (or use a live server extension).

## Project Structure

- `backend/`: Node.js server and SQLite database models.
- `css/`: Stylesheets.
- `js/`: Frontend logic (dashboard, charts, database client).
- `*.html`: Application pages.

## Logic Flow

1. **Registration**: Users register; data is saved to SQL Database via API.
2. **Login**: Checks credentials via API. Redirects automatically if session is valid.
3. **Student**:
   - Takes tests without leaving the page.
   - Views detailed results with "View Details" button.
4. **Staff**:
   - Creates new tests via API.
   - Manages student users.

## Maintenance

- Data is stored in `backend/jmc_placement_portal.sqlite`.
- To reset, delete this file and restart the server (it will recreate empty tables).

_Project Completed Successfully._
