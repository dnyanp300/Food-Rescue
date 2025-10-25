# Food Rescue Platform - Frontend

A beautiful and modern React-based web application for connecting food donors with NGOs to reduce food waste.

## Features

- 🍽️ **Food Donation**: Restaurants and individuals can easily donate surplus food
- 🤝 **NGO Integration**: NGOs can discover and claim available food donations
- 📊 **Admin Dashboard**: Analytics and user management
- 🔐 **Secure Authentication**: Email/password and Google Sign-In
- 🎨 **Beautiful UI**: Animated backgrounds, glassmorphism effects, and smooth transitions
- 📱 **Responsive Design**: Works seamlessly on all devices

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Google Sign-In Setup

To enable Google Sign-In functionality:

1. **Quick Setup** (5 minutes): See [QUICK_START.md](./QUICK_START.md)
2. **Detailed Guide**: See [GOOGLE_SIGNIN_SETUP.md](./GOOGLE_SIGNIN_SETUP.md)

### Quick Steps

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project and enable Google Authentication
3. Add your Firebase config to `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # ... etc
   ```
4. Restart the dev server

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Firebase** - Google authentication
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Shadcn UI** - UI components
- **Axios/Fetch** - API calls

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── ui/           # UI components (buttons, cards, etc.)
│   ├── Layout.jsx    # Main layout with navigation
│   └── ...
├── context/          # React context (Auth, etc.)
├── pages/            # Page components
│   ├── Dashboard/    # User dashboards
│   ├── Login.jsx     # Login page
│   └── Register.jsx  # Registration page
├── services/         # API services
├── hooks/            # Custom React hooks
├── firebase.js       # Firebase configuration
└── index.css         # Global styles
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Documentation

- [QUICK_START.md](./QUICK_START.md) - Quick setup guide for Google Sign-In
- [GOOGLE_SIGNIN_SETUP.md](./GOOGLE_SIGNIN_SETUP.md) - Detailed Google Sign-In setup
- [API Documentation](./docs/api.md) - Backend API documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
