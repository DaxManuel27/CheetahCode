# CheetahCode - Typing Speed Test

A modern typing speed test application built with React and Vercel serverless functions.

## Features

- Real-time typing speed measurement (WPM)
- Accuracy tracking
- Multiple programming languages support
- Syntax highlighting
- User authentication with Supabase
- Guest mode for quick testing

## Deployment

This project is configured for immediate deployment on Vercel.

### Quick Deploy

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Follow the prompts** - Vercel will automatically detect the configuration and deploy your application.

### Manual Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect the configuration and deploy

## Environment Variables (Optional)

For production, you should set these environment variables in your Vercel dashboard:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Project Structure

```
├── frontend/          # React application
├── api/              # Vercel serverless functions
├── backend/          # Original Express backend (not used in Vercel deployment)
└── vercel.json       # Vercel configuration
```

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Start development server**:
   ```bash
   cd frontend && npm run dev
   ```

3. **Start backend** (for local development):
   ```bash
   cd backend && npm start
   ```

## Technologies Used

- **Frontend**: React, Vite, CSS
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## License

MIT 