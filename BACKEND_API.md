# Backend API Documentation

This document outlines all the required backend APIs for the News Digest application.

## Base URL
```
Production: https://api.newsdigest.com
Development: http://localhost:8080/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### 1. User Registration

**Endpoint:** `POST /auth/register`  
**Purpose:** Register a new user account  
**Access:** Public

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Validation Rules:**
- `username`: 3-20 characters, alphanumeric only, unique
- `email`: Valid email format, unique
- `password`: Minimum 6 characters

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "selectedCategories": ["Technology"],
      "createdAt": "2023-09-08T10:30:00Z"
    },
    "token": "jwt_token_string"
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
```json
// 400 Bad Request - Validation Error
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email already exists"],
    "username": ["Username already taken"],
    "password": ["Password must be at least 6 characters"]
  }
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Internal server error"
}
```

### 2. User Login

**Endpoint:** `POST /auth/login`  
**Purpose:** Authenticate user and return JWT token  
**Access:** Public

**Request Body:**
```json
{
  "email": "string",     // Can be email or username
  "password": "string"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "selectedCategories": ["Technology", "Sports"],
      "createdAt": "2023-09-08T10:30:00Z"
    },
    "token": "jwt_token_string"
  },
  "message": "Login successful"
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "success": false,
  "message": "Invalid email/username or password"
}

// 400 Bad Request
{
  "success": false,
  "message": "Email and password are required"
}
```

### 3. User Logout

**Endpoint:** `POST /auth/logout`  
**Purpose:** Invalidate JWT token (add to blacklist)  
**Access:** Protected

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (204 No Content):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. Get Current User

**Endpoint:** `GET /auth/me`  
**Purpose:** Get current authenticated user profile  
**Access:** Protected

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "selectedCategories": ["Technology", "Sports"],
      "createdAt": "2023-09-08T10:30:00Z"
    }
  }
}
```

## User Management

### 5. Update User Categories

**Endpoint:** `PUT /users/categories`  
**Purpose:** Update user's selected news categories  
**Access:** Protected

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "categories": ["Technology", "Sports", "Politics", "Business"]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "selectedCategories": ["Technology", "Sports", "Politics", "Business"],
      "createdAt": "2023-09-08T10:30:00Z"
    }
  },
  "message": "Categories updated successfully"
}
```

### 6. Update User Profile

**Endpoint:** `PUT /users/profile`  
**Purpose:** Update user profile information  
**Access:** Protected

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "selectedCategories": ["Technology", "Sports"],
      "createdAt": "2023-09-08T10:30:00Z"
    }
  },
  "message": "Profile updated successfully"
}
```

## News Management

### 7. Get News Articles

**Endpoint:** `GET /news`  
**Purpose:** Fetch news articles with pagination and filtering  
**Access:** Public (but personalized if authenticated)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `categories` (optional): Comma-separated category list
- `search` (optional): Search term for title/summary

**Headers (optional for personalization):**
```
Authorization: Bearer <jwt_token>
```

**Example Requests:**
```
GET /news?page=1&limit=10
GET /news?page=2&limit=6&categories=Technology,Sports
GET /news?search=AI&categories=Technology
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "string",
        "title": "Breaking Tech News: AI Revolution",
        "summary": "Brief description of the article content...",
        "category": "Technology",
        "sourceUrl": "https://example.com/article",
        "imageUrl": "https://example.com/image.jpg",
        "publishedAt": "2023-09-08T10:30:00Z",
        "createdAt": "2023-09-08T10:35:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 8. Get News Article by ID

**Endpoint:** `GET /news/{id}`  
**Purpose:** Fetch specific news article details  
**Access:** Public

**Path Parameters:**
- `id`: Article ID (string)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "string",
      "title": "Breaking Tech News: AI Revolution",
      "summary": "Brief description of the article content...",
      "content": "Full article content here...",
      "category": "Technology",
      "sourceUrl": "https://example.com/article",
      "imageUrl": "https://example.com/image.jpg",
      "author": "John Doe",
      "publishedAt": "2023-09-08T10:30:00Z",
      "createdAt": "2023-09-08T10:35:00Z"
    }
  }
}
```

### 9. Get Available Categories

**Endpoint:** `GET /news/categories`  
**Purpose:** Get list of all available news categories  
**Access:** Public

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "Technology",
        "slug": "technology",
        "description": "Tech news and innovations",
        "articleCount": 145
      },
      {
        "name": "Sports",
        "slug": "sports", 
        "description": "Sports news and updates",
        "articleCount": 89
      },
      {
        "name": "Politics",
        "slug": "politics",
        "description": "Political news and analysis", 
        "articleCount": 203
      }
    ]
  }
}
```

## Error Handling

All endpoints return standardized error responses:

### HTTP Status Codes
- `200` - Success
- `201` - Created (registration, etc.)
- `204` - No Content (logout, delete)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email/username)
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Specific field error"]
  },
  "code": "ERROR_CODE"
}
```

## Rate Limiting

- Authentication endpoints: 5 requests per minute per IP
- News endpoints: 100 requests per minute per IP
- User endpoints: 60 requests per minute per user

## Data Models

### User Model
```go
type User struct {
    ID                string    `json:"id" db:"id"`
    Username          string    `json:"username" db:"username"`
    Email             string    `json:"email" db:"email"`
    PasswordHash      string    `json:"-" db:"password_hash"`
    SelectedCategories []string  `json:"selectedCategories" db:"selected_categories"`
    CreatedAt         time.Time `json:"createdAt" db:"created_at"`
    UpdatedAt         time.Time `json:"updatedAt" db:"updated_at"`
}
```

### NewsArticle Model
```go
type NewsArticle struct {
    ID          string    `json:"id" db:"id"`
    Title       string    `json:"title" db:"title"`
    Summary     string    `json:"summary" db:"summary"`
    Content     string    `json:"content,omitempty" db:"content"`
    Category    string    `json:"category" db:"category"`
    SourceURL   string    `json:"sourceUrl" db:"source_url"`
    ImageURL    *string   `json:"imageUrl,omitempty" db:"image_url"`
    Author      *string   `json:"author,omitempty" db:"author"`
    PublishedAt time.Time `json:"publishedAt" db:"published_at"`
    CreatedAt   time.Time `json:"createdAt" db:"created_at"`
}
```

### Category Model
```go
type Category struct {
    ID           string `json:"id" db:"id"`
    Name         string `json:"name" db:"name"`
    Slug         string `json:"slug" db:"slug"`
    Description  string `json:"description" db:"description"`
    ArticleCount int    `json:"articleCount" db:"article_count"`
}
```

## Environment Variables

### Required
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/newsdigest
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=24h

# Server
PORT=8080
ENVIRONMENT=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://newsdigest.com
```

### Optional
```bash
# Rate limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=100

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# News aggregation
NEWS_API_KEY=your-news-api-key
NEWS_FETCH_INTERVAL=15m
```

## Security Considerations

1. **JWT Tokens**: Use strong secret, implement token blacklisting
2. **Password Hashing**: Use bcrypt with cost factor 12+
3. **Rate Limiting**: Implement per-IP and per-user limits
4. **Input Validation**: Sanitize all inputs, use parameterized queries
5. **CORS**: Configure appropriate origins
6. **HTTPS**: Enforce HTTPS in production
7. **Headers**: Set security headers (HSTS, CSP, etc.)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    selected_categories TEXT[] DEFAULT ARRAY['Technology'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### News Articles Table
```sql
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT,
    category VARCHAR(50) NOT NULL,
    source_url VARCHAR(1000) NOT NULL,
    image_url VARCHAR(1000),
    author VARCHAR(255),
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_category (category),
    INDEX idx_published_at (published_at),
    INDEX idx_created_at (created_at)
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

This comprehensive API documentation provides everything needed to implement the backend for the News Digest application.
