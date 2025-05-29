# 🍽️ Palate - AI-Powered Recipe Generator

A full-stack AI-powered recipe generator that creates personalized recipes from text descriptions or food images using OpenAI's GPT technology.

## ✨ Features

- **AI Recipe Generation**: Generate custom recipes from text descriptions or food images
- **User Authentication**: Google OAuth integration with NextAuth.js
- **Personal Dashboard**: Track cooking statistics and recipe history
- **Recipe Management**: Save, organize, and discover recipes
- **Modern UI**: Dark theme with orange accents, fully responsive design
- **Smart Filtering**: Filter recipes by cuisine, difficulty, dietary restrictions

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v3 with custom dark theme
- **Authentication**: NextAuth.js with Google OAuth
- **State Management**: React hooks and local state
- **API**: RESTful API routes for frontend-backend communication

### Backend (Express.js)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT tokens and Google OAuth
- **AI Integration**: OpenAI GPT for recipe generation
- **Image Processing**: Multer for file uploads
- **External APIs**: Unsplash for recipe images

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable React components
│   ├── lib/              # Utility libraries
│   ├── models/           # Database models
│   └── types/            # TypeScript type definitions
├── backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic services
│   │   └── types/        # TypeScript types
└── package.json          # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- OpenAI API key
- Google Cloud Console project (for OAuth)

### Environment Variables

#### Frontend (.env.local)
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-access-key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Backend (backend/.env)
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=30d
OPENAI_API_KEY=your-openai-api-key
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
FRONTEND_URL=http://localhost:3000
```

### Installation & Development

1. **Install frontend dependencies**
   ```bash
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Start backend server**
   ```bash
   cd backend
   npm run dev
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## 📦 Deployment

### Frontend (Vercel)
The frontend is configured for automatic deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
Deploy the backend separately:

1. Deploy the `backend/` folder to Railway or Heroku
2. Set environment variables in hosting platform
3. Update `NEXT_PUBLIC_API_URL` in frontend to point to deployed backend

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Recipes
- `POST /api/recipes/generate` - Generate recipe with AI
- `GET /api/recipes/user` - Get user's recipes
- `POST /api/recipes/save` - Save generated recipe

### User
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/history` - Get recipe history

## 🎨 UI Components

### Custom Components
- **RecipeGenerator**: Main recipe generation interface
- **RecipeCard**: Recipe display component
- **AllergenSelector**: Dietary restrictions selector
- **SpiceLevel**: Spice preference selector
- **Dashboard**: User statistics and analytics

### Design System
- **Colors**: Dark theme with orange (#f97316) accent
- **Typography**: Poppins font family
- **Components**: Custom Tailwind CSS classes for buttons and cards

## 🔐 Security Features

- **Authentication**: Secure Google OAuth flow
- **API Protection**: JWT-based API authentication
- **Data Validation**: Input validation and sanitization
- **Environment Variables**: Secure configuration management
- **CORS**: Proper cross-origin resource sharing setup

## 📊 Technologies Used

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- NextAuth.js
- Lucide React Icons
- Chart.js & Recharts

### Backend
- Express.js
- TypeScript
- MongoDB & Mongoose
- OpenAI API
- JWT
- Multer
- bcryptjs

### DevOps
- Vercel (Frontend)
- Railway/Heroku (Backend)
- MongoDB Atlas
- GitHub Actions (CI/CD)

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
