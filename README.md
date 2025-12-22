# BookShare Project

A book sharing platform built with React, Vite, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Environment Variables

Create `.env` file in the `server` folder:

```bash
cp server/.env.example server/.env
```

Fill in your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# Open server/schema.sql and execute it in Supabase
```

### 4. Start Development Environment

**Option 1: Using npm script (Recommended)**
```bash
npm run dev
```

**Option 2: Using batch file (Windows)**
```bash
.\start-dev.bat
```

This will start:
- 🎨 Frontend (Vite): http://localhost:5173
- ⚙️ Backend (Express): http://localhost:3000

**Press Ctrl+C to stop all processes**

### 5. Individual Commands

If you need to run services separately:

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
# or
cd server && .\start.bat
```

## 📁 Project Structure

```
BookShareProject/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── examples/          # Example implementations
│   └── assets/            # Static assets
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   ├── index.js          # Server entry point
│   ├── schema.sql        # Database schema
│   ├── start.bat         # Windows server startup
│   └── stop.bat          # Windows server stop
├── start-dev.bat         # Start both frontend & backend (Windows)
└── package.json          # Project dependencies
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:client` | Start frontend only (Vite) |
| `npm run dev:server` | Start backend only (Express) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 📚 API Documentation

See [API_GUIDE.md](API_GUIDE.md) for complete API documentation.

### Key Endpoints:
- `POST /api/upload-images` - Upload images to external hosting
- `POST /api/books` - Create new book listing
- `GET /api/books/search` - Search books
- `GET /api/categories` - Get all categories
- `POST /api/login` - User authentication
- `POST /api/register` - User registration

## 🖼️ Image Upload

This project uses external image hosting (cfig.ibytecdn.org) for book images:

1. User selects images (max 5)
2. Frontend uploads to `/api/upload-images`
3. Backend forwards to external hosting
4. Returns image URLs
5. URLs saved with book listing

## 🛠️ Troubleshooting

### Port Already in Use

If you see "Port 3000 already in use":

```bash
# Windows
.\server\stop.bat

# Or manually
taskkill /F /IM node.exe
```

### Server Exits Immediately

Use the provided scripts which handle cleanup:
- `start-dev.bat` - Kills old processes before starting
- `server/start.bat` - Backend only with cleanup

### Database Connection Issues

1. Verify Supabase credentials in `server/.env`
2. Check if schema.sql has been executed
3. Ensure tables exist in Supabase dashboard

## 📖 Development Guide

### Adding New Features

1. **Backend API**: Add controller + service in `server/`
2. **Frontend Hook**: Create custom hook in `src/hooks/`
3. **Component**: Build UI in `src/components/`
4. **Example**: Add usage example in `src/examples/`

### Database Changes

1. Update `server/schema.sql`
2. Run SQL in Supabase SQL Editor
3. Update controllers/services to use new schema

## 🔐 Security Notes

- Never commit `.env` files
- Use `SUPABASE_SERVICE_ROLE_KEY` only in backend
- Implement JWT authentication (currently in TODO)
- Validate all user inputs

## 📝 TODO

See [TODO.md](TODO.md) for the complete task list.

## Migrate from MySQL to Supabase

This project has been updated to use Supabase as the database backend. Follow the steps below to set up your environment:

### 1. Environment Variables

Copy the `.env.example` file to `.env` and fill in the required values:

```bash
cp server/.env.example server/.env
```

- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key.
- (Optional) `MYSQL_*`: Only needed for running the migration script.

### 2. Install Dependencies

Navigate to the `server` folder and install the required packages:

```bash
cd server
npm install
```

### 3. Run Migration Script

To migrate data from MySQL to Supabase, run the following command:

```bash
node migrate.js
```

### 4. Start the Server

Once the migration is complete, start the server:

```bash
node index.js
```

Your server will now use Supabase for all database operations.

---

## Notes

- Ensure your Supabase database schema matches the structure of your MySQL database.
- Test all endpoints thoroughly after migration to ensure data integrity.
