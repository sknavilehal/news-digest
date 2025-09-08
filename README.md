# News Digest - Microservices Monorepo

A modern news aggregator built with microservices architecture, featuring a Vue.js frontend and Go backend services.

## 🏗️ Architecture

This is a monorepo containing multiple microservices:

```
news-digest/
├── frontend/                 # Vue.js 3 + TypeScript frontend
├── services/
│   ├── auth-service/        # Authentication & user management
│   ├── news-service/        # News aggregation & API
│   ├── notification-service/ # Push notifications & alerts
│   └── gateway/             # API Gateway & load balancer
├── shared/
│   ├── types/               # Shared TypeScript types
│   ├── proto/               # Protocol buffer definitions
│   └── configs/             # Shared configuration files
├── infrastructure/
│   ├── docker/              # Docker configurations
│   ├── kubernetes/          # K8s manifests
│   └── terraform/           # Infrastructure as code
└── scripts/                 # Build & deployment scripts
```

## 🚀 Services Overview

### Frontend Service
- **Technology**: Vue.js 3, TypeScript, Vite
- **Port**: 3000
- **Description**: User interface for news consumption and management

### Auth Service
- **Technology**: Go, JWT, PostgreSQL
- **Port**: 8001
- **Description**: User authentication, registration, and session management

### News Service
- **Technology**: Go, PostgreSQL, Redis
- **Port**: 8002
- **Description**: News aggregation, categorization, and API endpoints

### Notification Service
- **Technology**: Go, WebSockets, Redis
- **Port**: 8003
- **Description**: Real-time notifications and push alerts

### API Gateway
- **Technology**: Go, Nginx
- **Port**: 8000
- **Description**: Request routing, load balancing, and API composition

## 🚀 Features

- **Personalized News Feed**: Customize categories and get relevant articles
- **Authentication System**: JWT-based authentication with session management
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Category Management**: Select from 8 news categories
- **Real-time Updates**: WebSocket notifications and live updates
- **Modern UI**: Clean, card-based layout with smooth animations
- **TypeScript Support**: Full type safety throughout the application
- **Microservices Architecture**: Scalable, maintainable service-oriented design

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: Pure CSS with CSS Custom Properties

### Backend
- **Language**: Go 1.21+
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Authentication**: JWT tokens
- **API Documentation**: Swagger/OpenAPI
- **Message Queue**: Redis Pub/Sub

## 📁 Project Structure

```
src/
├── assets/
│   └── styles/
│       └── main.css           # Global styles and utilities
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue      # Header with navigation and auth
│   │   └── AppFooter.vue      # Footer component
│   └── news/
│       ├── NewsCard.vue       # Individual news article card
│       └── NewsGrid.vue       # Grid layout for news articles
├── services/
│   └── api.ts                 # API service layer with axios
├── stores/
│   ├── auth.ts               # Authentication store (Pinia)
│   └── news.ts               # News data store (Pinia)
├── types/
│   └── index.ts              # TypeScript type definitions
├── views/
│   ├── Home.vue              # Main news feed page
│   ├── Settings.vue          # User preferences and categories
│   └── About.vue             # About page with app information
├── router/
│   └── index.ts              # Vue Router configuration
├── App.vue                   # Root component
└── main.ts                   # Application entry point
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd news-digest
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Build for production**
```bash
npm run build
# or
yarn build
```

5. **Preview production build**
```bash
npm run preview
# or
yarn preview
```

## 🎮 Usage

### Getting Started
1. Open the application in your browser (typically `http://localhost:3000`)
2. Browse trending news without signing in
3. Click "Sign In" to access personalized features
4. Use any username/password combination (mock authentication)
5. Go to Settings to customize your news categories
6. Enjoy your personalized news feed!

### Mock Authentication
- Username: Any string (e.g., "johndoe")
- Password: Any string (e.g., "password123")
- Default categories: Technology, Sports, Politics

### Navigation
- **Home**: Main news feed (personalized if signed in)
- **Settings**: Manage categories and account preferences (requires sign-in)
- **About**: Information about the application

## 🔌 API Documentation

The application is prepared for backend integration with the following API endpoints:

### Authentication Endpoints

#### POST `/api/auth/login`
**Purpose**: Authenticate user and return JWT token

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "selectedCategories": ["Technology", "Sports"]
    },
    "token": "jwt-token-here"
  }
}
```

#### POST `/api/auth/logout`
**Purpose**: Invalidate user session

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": null
}
```

#### POST `/api/auth/register`
**Purpose**: Create new user account

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "username": "newuser",
      "email": "new@example.com",
      "selectedCategories": []
    },
    "token": "jwt-token-here"
  }
}
```

### News Endpoints

#### GET `/api/news`
**Purpose**: Fetch paginated news articles

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Articles per page (default: 6)
- `categories` (string[]): Filter by categories (optional)

**Example**: `/api/news?page=1&limit=6&categories=Technology,Sports`

**Response**:
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "Breaking News Title",
        "summary": "Brief description of the article...",
        "category": "Technology",
        "sourceUrl": "https://example.com/article",
        "date": "2024-01-15T10:30:00Z",
        "imageUrl": "https://example.com/image.jpg"
      }
    ],
    "totalPages": 10
  }
}
```

#### GET `/api/news/{id}`
**Purpose**: Fetch specific news article by ID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Article Title",
    "summary": "Article summary...",
    "category": "Technology",
    "sourceUrl": "https://example.com/article",
    "date": "2024-01-15T10:30:00Z",
    "imageUrl": "https://example.com/image.jpg"
  }
}
```

#### GET `/api/news/categories`
**Purpose**: Get list of available news categories

**Response**:
```json
{
  "success": true,
  "data": [
    "Technology",
    "Sports", 
    "Politics",
    "Business",
    "Entertainment",
    "Health",
    "Science",
    "World"
  ]
}
```

### User Management Endpoints

#### PUT `/api/user/profile`
**Purpose**: Update user profile information

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "username": "string",
  "email": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "updatedname",
    "email": "updated@example.com",
    "selectedCategories": ["Technology", "Sports"]
  }
}
```

#### PUT `/api/user/categories`
**Purpose**: Update user's selected news categories

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "categories": ["Technology", "Sports", "Business"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "selectedCategories": ["Technology", "Sports", "Business"]
  }
}
```

### Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `500`: Internal Server Error

### Authentication Flow

1. User submits login credentials
2. Backend validates and returns JWT token
3. Frontend stores token and user data
4. Token included in `Authorization` header for protected routes
5. Token validated on each request
6. Token cleared on logout

### Data Models

#### User
```typescript
interface User {
  id: number
  username: string
  email: string
  selectedCategories: string[]
}
```

#### NewsArticle
```typescript
interface NewsArticle {
  id: number
  title: string
  summary: string
  category: string
  sourceUrl: string
  date: string
  imageUrl?: string
}
```

#### ApiResponse
```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
```

## 🎨 Customization

### Styling
- Edit `src/assets/styles/main.css` for global styles
- CSS custom properties in `:root` for easy theming
- Component-specific styles in `<style scoped>` blocks

### Adding News Sources
- Modify mock data in `src/stores/news.ts`
- Implement real API calls in `src/services/api.ts`
- Update type definitions in `src/types/index.ts`

### Categories
- Edit `NEWS_CATEGORIES` in `src/types/index.ts`
- Update category icons in components as needed

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Issues & Support

- Report bugs via GitHub Issues
- Feature requests welcome
- Check existing issues before creating new ones

## 🔮 Future Enhancements

- Real-time notifications
- Bookmark/favorite articles
- Dark mode theme
- PWA support
- Social sharing integration
- Advanced search functionality
- Reading time estimates
- Offline reading support

---

Built with ❤️ using Vue.js and TypeScript
