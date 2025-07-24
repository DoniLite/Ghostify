# Ghostify <img src="./static/ghostify.svg" alt="Project icon" style="width: 30px; height: 30px; position: relative; top: 8px;" />

A modern real-time collaborative web application built with Bun, Hono, and React.

## 🚀 Features

- **Real-time Collaboration** - Collaborative document editing via WebSockets
- **Resume creation** - Create attractive resume with a friendly interface
- **Secure Authentication** - Session system with key rotation
- **File Streaming** - Secure file download and streaming
- **Modern React Interface** - Client-side application with React Router
- **Multilingual Support** - English, French, and Spanish support
- **Smart Caching** - Optimized caching for better performance

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Ultra-fast JavaScript runtime
- **Web Framework**: [Hono](https://hono.dev/) - Lightweight and fast web framework
- **Frontend**: React with React Router for client-side routing
- **WebSockets**: Real-time collaboration with Bun's native pub/sub
- **Sessions**: `hono-sessions` with cookie storage
- **Security**: JWT for resource authentication

## 📋 Prerequisites

- [Bun](https://bun.sh/) v1.0+
- Node.js 18+ (for type compatibility)

## ⚡ Quick Start

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd ghostify
```

2. **Install dependencies**

```bash
bun install
```

3. **Environment setup**

```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:

```env
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-jwt-secret-key
```

4. **Start the application**

```bash
bun run dev:server
```

The application will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
ghostify/
├── src/
│   ├── components/     # React components
│   ├── routes/         # Application routes
│   ├── api/           # API routes
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utilities and helpers
│   └── App.tsx        # Root component
├── static/            # Static files
├── server.tsx         # Main server
└── README.md
```

## 🔧 Available Scripts

- `bun run dev:server` - Start development server
- `bun run build` - Build for production
- `bun run start:server` - Start production server
- `bun test` - Run tests

## 🌐 API Reference

### WebSocket

- `GET /ws/document/:docId` - WebSocket connection for real-time collaboration

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Files

- `GET /download/:file` - Secure file download
- `GET /stream/:file` - File streaming
- `GET /download/:file/cloud` - Cloud download (coming soon)
- `GET /stream/:file/cloud` - Cloud streaming (coming soon)

### Other

- `GET /terms` - Terms of service page
- `GET /*` - React application routes (SPA)

## 🔒 Security

The project implements several security measures:

- **Encrypted sessions** with automatic key rotation
- **JWT tokens** for resource authentication
- **Secure headers** (commented but available)
- **HttpOnly cookies** to prevent XSS attacks
- **SameSite** for basic CSRF protection

## 🌍 Internationalization

The application supports multiple languages:

- English (default)
- French
- Spanish

Language detection is based on:

1. Query parameter (`?lang=fr`)
2. URL path
3. Cookie
4. HTTP Accept-Language headers

## 🤝 Real-time Collaboration

Ghostify uses Bun's WebSockets with native pub/sub system to enable:

- **Collaborative editing** on shared documents
- **Real-time synchronization** of changes
- **Room management** by document (isolation by `docId`)

## 📝 Development

### Adding new API routes

```typescript
// In src/api/index.ts
app.get('/new-route', (c) => {
  return c.json({ message: 'New route' });
});
```

### Session management

```typescript
// Access session in a handler
app.get('/protected', (c) => {
  const session = c.get('session');
  const userId = session.get('userId');
  // ...
});
```

## 🚀 Deployment

1. **Production build**

```bash
bun run build
```

2. **Environment variables**
Ensure all environment variables are configured in production.

3. **Start the server**

```bash
bun run start
```

## 🐛 Troubleshooting

### Port already in use error

```bash
# Find process using port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>
```

### WebSocket issues

Make sure your proxy/load balancer supports WebSockets and `Upgrade` headers.

## 📄 License

[Add your license here]

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Ghostify** - Real-time collaboration made simple and fast.
