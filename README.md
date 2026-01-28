# Smart Service Booking & Management System (SSBMS)

A full-stack MERN application for managing service bookings with role-based access control.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure MongoDB

**Option A: Fix MongoDB Atlas Connection (Recommended)**

The `ECONNREFUSED` error means MongoDB Atlas is blocking your connection. Fix it:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your project and cluster
3. Click **"Network Access"** in the left sidebar
4. Click **"Add IP Address"**
5. Choose **"Allow Access from Anywhere"** (0.0.0.0/0) for development
6. Click **"Confirm"**
7. Wait 2-3 minutes for changes to propagate

**Option B: Use Local MongoDB**

If you have MongoDB installed locally:

```env
# In backend/.env, replace the MONGODB_URI with:
MONGODB_URI=mongodb://localhost:27017/ssbms
```

### 3. Start the Application

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm start

# Terminal 2 - Frontend (port 5173)
cd frontend
npm start
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 👥 User Roles

### Admin

- Dashboard with system statistics
- Approve/reject service providers
- Manage all users, services, and bookings

### Provider

- Create and manage services
- View and manage bookings
- Update service details

### Customer

- Browse and search services
- Book services
- View booking history

## 📁 Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── redux/       # State management
    │   ├── services/    # API handlers
    │   └── App.jsx      # Main app component
    └── package.json
```

## 🔑 Environment Variables

Create `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🛠️ Technologies Used

### Backend

- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator

### Frontend

- React 18
- Redux Toolkit
- React Router v6
- Tailwind CSS
- Axios
- React Hot Toast
- React Icons

## 📝 API Endpoints

### Auth Routes (`/api/auth`)

- POST `/register` - Register new user
- POST `/login` - Login user
- GET `/me` - Get current user
- PUT `/update-profile` - Update profile
- PUT `/change-password` - Change password

### Service Routes (`/api/services`)

- GET `/` - Get all services
- GET `/:id` - Get service by ID
- POST `/` - Create service (Provider)
- PUT `/:id` - Update service (Provider)
- DELETE `/:id` - Delete service (Provider)

### Booking Routes (`/api/bookings`)

- GET `/` - Get all bookings
- GET `/:id` - Get booking by ID
- POST `/` - Create booking (Customer)
- PUT `/:id/cancel` - Cancel booking

### Admin Routes (`/api/admin`)

- GET `/dashboard` - Dashboard statistics
- GET `/users` - Get all users
- GET `/providers` - Get pending providers
- PUT `/providers/:id/approve` - Approve provider

## 🎨 Features

- ✅ Role-based authentication (Admin, Provider, Customer)
- ✅ Service CRUD operations
- ✅ Booking management system
- ✅ Provider approval workflow
- ✅ Responsive dark-themed UI
- ✅ Real-time notifications
- ✅ Search and filter functionality
- ✅ Dashboard analytics

## 🐛 Troubleshooting

### MongoDB Connection Error

If you see `ECONNREFUSED _mongodb._tcp.cluster0...`:

1. Add your IP to MongoDB Atlas Network Access (see step 2 above)
2. Check if username/password are correct
3. Ensure no firewall is blocking port 27017

### Frontend Build Errors

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Backend Module Errors

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is created for educational purposes.
