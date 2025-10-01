# Real-time Chat Application

A real-time chat application built with NestJS, React, Socket.io, Prisma ORM, and MongoDB Atlas. The backend is deployed with PM2 in cluster mode for high availability and scalability.

## Features

- Real-time messaging with Socket.io
- User authentication and management
- MongoDB Atlas integration with Prisma ORM
- PM2 cluster mode for backend scalability
- Docker containerization
- Modern React frontend with responsive design
- Cross-instance real-time functionality

## Project Structure

```
chat-app/
├── backend/
│   ├── Dockerfile
│   ├── ecosystem.config.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── chat/
│   │   │   ├── chat.gateway.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── chat.module.ts
│   │   │   └── dto/
│   │   │       └── create-message.dto.ts
│   │   ├── prisma.service.ts
│   │   └── message.module.ts
│   └── .env
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── index.css
│       └── App.js
└── docker-compose.yml
```

## Prerequisites

- Docker and Docker Compose
- MongoDB Atlas account
- Node.js 18+ (for local development)

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Atlas Connection String
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/chat_app?retryWrites=true&w=majority"

# Backend Configuration
PORT=3000
NODE_ENV=production

# Frontend Configuration
REACT_APP_BACKEND_URL=http://localhost:3000
```

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update the `DATABASE_URL` in your `.env` file

### 3. Running with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Local Development

#### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run start:dev

# Start with PM2 cluster mode
pm2 start ecosystem.config.js --env development
```

#### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## PM2 Cluster Mode

The backend is configured to run in PM2 cluster mode with the following features:

- **Cluster Mode**: Uses all available CPU cores
- **Auto-restart**: Automatically restarts failed instances
- **Memory Management**: Restarts when memory usage exceeds 1GB
- **Logging**: Centralized logging with rotation
- **Health Monitoring**: Built-in health checks

### PM2 Commands

```bash
# Start the application
pm2 start ecosystem.config.js

# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart all processes
pm2 restart all

# Stop all processes
pm2 stop all

# Delete all processes
pm2 delete all
```

## API Endpoints

The application uses WebSocket connections for real-time communication:

### Socket Events

#### Client to Server

- `join` - Join the chat with username
- `message` - Send a new message
- `getMessages` - Retrieve message history
- `getUsers` - Get list of online users

#### Server to Client

- `message` - New message received
- `messages` - Message history
- `users` - List of online users
- `userJoined` - User joined notification
- `error` - Error messages

## Docker Configuration

### Backend Dockerfile

- Uses Node.js 18 Alpine
- Installs PM2 globally
- Runs in cluster mode for scalability
- Includes Prisma client generation

### Frontend Dockerfile

- Multi-stage build with Node.js and Nginx
- Serves static files with Nginx
- Proxies Socket.io connections to backend
- Optimized for production

## Scaling and Production

### Horizontal Scaling

The application is designed to scale horizontally:

1. **Backend**: PM2 cluster mode uses all CPU cores
2. **Database**: MongoDB Atlas handles database scaling
3. **Load Balancing**: Can be deployed behind a load balancer
4. **Container Orchestration**: Docker Compose can be replaced with Kubernetes

### Production Considerations

1. **Environment Variables**: Use secure environment variable management
2. **SSL/TLS**: Configure HTTPS for production
3. **Monitoring**: Implement application monitoring
4. **Logging**: Set up centralized logging
5. **Backup**: Configure database backups

## Troubleshooting

### Common Issues

1. **Database Connection**: Verify MongoDB Atlas connection string
2. **CORS Issues**: Check CORS configuration in backend
3. **Socket Connection**: Ensure WebSocket connections are not blocked
4. **PM2 Issues**: Check PM2 logs for errors

### Debug Commands

```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Check PM2 status
docker exec chat-app-backend pm2 status

# Check PM2 logs
docker exec chat-app-backend pm2 logs

# Restart specific service
docker-compose restart backend
```

## License

This project is licensed under the MIT License.

