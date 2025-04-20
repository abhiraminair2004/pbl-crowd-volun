
# VeridaX Backend

This is the backend server for the VeridaX volunteering and crowdfunding platform.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   
   If you haven't already cloned the main repository:
   ```
   git clone <repository-url>
   cd veridax/src/server
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file and update it with your values:
   ```
   cp .env.example .env
   ```
   
   Edit the `.env` file to include:
   - Your MongoDB connection string
   - JWT secret for authentication
   - CORS origin URL (your frontend URL)
   - Email configuration (if using password reset functionality)

4. **Setting up MongoDB**

   **Option 1: MongoDB Atlas (Recommended for production)**
   
   a. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   b. Create a new cluster
   c. In the Security tab, create a database user with read/write privileges
   d. In the Network Access tab, add your IP address
   e. In the Clusters tab, click "Connect" and select "Connect your application"
   f. Copy the connection string and add it to your `.env` file
   
   **Option 2: Local MongoDB (Development)**
   
   a. [Install MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)
   b. Start the MongoDB service
   c. Use `mongodb://localhost:27017/veridax` as your connection string

5. **Start the server**
   
   For development:
   ```
   npm run dev
   ```
   
   For production:
   ```
   npm start
   ```

The server will start on the port specified in your `.env` file (default: 5000).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Volunteers

- `POST /api/volunteer/register` - Register as a volunteer
- `GET /api/volunteers` - Get all volunteers

### Donations

- `POST /api/crowdfunding/donate` - Make a donation
- `GET /api/donations` - Get all donations
- `GET /api/donations/campaign/:id` - Get donations for a specific campaign

## Development

### Directory Structure

- `server.js` - Main entry point
- `models/` - Database models
- `routes/` - API route definitions
- `controllers/` - Business logic for routes
- `middleware/` - Custom middleware functions
- `utils/` - Utility functions

## Deployment

For production deployment, consider:

1. Using a process manager like PM2
2. Setting up NGINX as a reverse proxy
3. Enabling SSL for secure connections
4. Implementing rate limiting for API endpoints

## Documentation

For more detailed API documentation, see the [API Documentation](API_DOCS.md) file.
