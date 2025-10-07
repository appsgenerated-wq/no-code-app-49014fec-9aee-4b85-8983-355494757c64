# Mice's Cheese Pantry

Welcome to Mice's Cheese Pantry, a complete web application built with React and Manifest. This app allows mice to discover, catalog, and review their favorite cheeses.

## Features

- **Mouse Authentication**: Mice can sign up and log in to their own secure pantry.
- **Cheese Cataloging**: Add new cheeses with details like name, origin, description, and a photo.
- **Rich Properties**: Use specific 'aroma' and 'texture' properties to classify cheeses.
- **Image Uploads**: A drag-and-drop interface for uploading cheese photos, powered by Manifest's file storage.
- **Ownership & Permissions**: Mice can only edit or delete cheeses they've discovered, thanks to Manifest's powerful policy engine.
- **Admin Panel**: A complete admin dashboard is available at `/admin` for managing all mice, cheeses, and reviews.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    The application connects to a Manifest backend deployed on Vercel. The backend URL is pre-configured.
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Navigate to `http://localhost:5173` in your browser.

### Demo Credentials

- **Email**: `forager@demo.com`
- **Password**: `password`

### Admin Access

- **URL**: [YOUR_BACKEND_URL]/admin
- **Email**: `admin@manifest.build`
- **Password**: `admin`
