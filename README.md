# 🚀 Apex Booking - Smart Service Booking Platform

<div align="center">

A modern, full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) service booking and management platform with role-based authentication, real-time booking management, and a stunning cyberpunk-inspired UI.

[![Live Frontend](https://img.shields.io/badge/🌐_Live-Frontend-00D9FF?style=for-the-badge)](https://itsolera-task-2-frontend.vercel.app)
[![Live Backend](https://img.shields.io/badge/⚡_Live-Backend_API-8B5CF6?style=for-the-badge)](https://itsolera-task-2.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/LeGeND212L/ITSOLERA_Task_2)

</div>

---

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Provider, Customer)
- Password visibility toggle with eye icons
- Password strength indicator on registration
- Secure password hashing with bcryptjs

### 👥 User Roles

| Role         | Capabilities                                                           |
| ------------ | ---------------------------------------------------------------------- |
| **Customer** | Browse services, book appointments, manage bookings, view history      |
| **Provider** | Create & manage services, handle booking requests, dashboard analytics |
| **Admin**    | User management, provider approval, platform oversight, full access    |

### 🛠️ Service Management

- Dynamic service categories with icons
- Advanced search with real-time filtering
- Grid and List view options
- Service details with provider information
- Category-based browsing

### 📅 Booking System

- Seamless booking workflow
- Status tracking (Pending, Confirmed, Completed, Cancelled)
- Booking history for all users
- Provider booking management

### 🎨 Modern UI/UX

- **Cyberpunk-inspired dark theme** with neon accents
- Fully responsive design (Mobile, Tablet, Desktop)
- Smooth animations and transitions
- Glass-morphism effects
- Custom scrollbars
- Active route highlighting in navigation
- Scroll-to-top on page navigation

---

## 🛠️ Tech Stack

### Frontend

| Technology                                                                                                       | Purpose             |
| ---------------------------------------------------------------------------------------------------------------- | ------------------- |
| ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)                     | UI Framework        |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)                           | Build Tool          |
| ![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white)                | State Management    |
| ![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?style=flat&logo=reactrouter&logoColor=white) | Client-side Routing |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)    | Styling             |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)                        | HTTP Client         |

### Backend

| Technology                                                                                            | Purpose             |
| ----------------------------------------------------------------------------------------------------- | ------------------- |
| ![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=flat&logo=nodedotjs&logoColor=white) | Runtime Environment |
| ![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)    | Web Framework       |
| ![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat&logo=mongodb&logoColor=white) | Database            |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)         | Authentication      |

### Deployment

| Platform                                                                                                    | Service                    |
| ----------------------------------------------------------------------------------------------------------- | -------------------------- |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)                | Frontend & Backend Hosting |
| ![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat&logo=mongodb&logoColor=white) | Cloud Database             |

---

## 📁 Project Structure

```
ITSOLERA_Task_2/
├── 📂 backend/
│   ├── 📂 config/
│   │   └── db.js              # MongoDB connection with caching
│   ├── 📂 controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── serviceController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── 📂 middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── errorHandler.js
│   ├── 📂 models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   └── Booking.js
│   ├── 📂 routes/
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js              # Express app entry
│   ├── vercel.json            # Vercel configuration
│   └── package.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 assets/         # Images & static files
│   │   ├── 📂 components/
│   │   │   ├── 📂 common/     # Loader, ScrollToTop
│   │   │   └── 📂 layout/     # Navbar, Footer
│   │   ├── 📂 pages/
│   │   │   ├── 📂 auth/       # Login, Register
│   │   │   ├── 📂 admin/      # Admin Dashboard
│   │   │   ├── 📂 provider/   # Provider Dashboard
│   │   │   ├── 📂 customer/   # Customer Dashboard
│   │   │   └── 📂 services/   # Services, ServiceDetails
│   │   ├── 📂 redux/
│   │   │   ├── store.js
│   │   │   └── 📂 slices/     # Auth, Services, Bookings
│   │   ├── 📂 services/       # API service files
│   │   ├── App.jsx
│   │   ├── index.css          # Tailwind & custom styles
│   │   └── main.jsx
│   ├── build.mjs              # Custom Vite build script
│   ├── vercel.json
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (free tier available)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/LeGeND212L/ITSOLERA_Task_2.git
   cd ITSOLERA_Task_2
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**

   Create `.env` file in `backend/` directory:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

4. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure Frontend Environment** _(Optional for local development)_

   Create `.env` file in `frontend/` directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running Locally

1. **Start Backend**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** _(in a new terminal)_

   ```bash
   cd frontend
   npm run dev
   ```

3. Open **http://localhost:5173** in your browser

---

## 🌐 Deployment on Vercel

### Backend Deployment

1. Import repository on [Vercel](https://vercel.com)
2. Set **Root Directory** to `backend`
3. Add environment variables:

   | Variable       | Value                                |
   | -------------- | ------------------------------------ |
   | `MONGODB_URI`  | Your MongoDB Atlas connection string |
   | `JWT_SECRET`   | Your secure JWT secret               |
   | `JWT_EXPIRE`   | `30d`                                |
   | `NODE_ENV`     | `production`                         |
   | `FRONTEND_URL` | Your frontend Vercel URL             |

4. Deploy

### Frontend Deployment

1. Create new project on Vercel
2. Set **Root Directory** to `frontend`
3. Configure build settings:

   | Setting              | Value            |
   | -------------------- | ---------------- |
   | **Build Command**    | `node build.mjs` |
   | **Output Directory** | `dist`           |
   | **Install Command**  | `npm install`    |

4. Add environment variable:

   | Variable       | Value                                 |
   | -------------- | ------------------------------------- |
   | `VITE_API_URL` | `https://your-backend.vercel.app/api` |

5. Deploy

### ⚠️ Important: MongoDB Atlas Configuration

For Vercel deployment, you **must** allow all IPs in MongoDB Atlas:

1. Go to **MongoDB Atlas** → **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Confirm and wait for changes to propagate

---

## 👤 Demo Credentials

| Role      | Email                | Password    |
| --------- | -------------------- | ----------- |
| **Admin** | `Admin123@gmail.com` | `Admin123@` |

> 💡 **Tip:** Register as a new customer or provider to test the full workflow!

---

## 🔒 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login`    | User login        |
| `GET`  | `/api/auth/me`       | Get current user  |
| `PUT`  | `/api/auth/profile`  | Update profile    |

### Services

| Method   | Endpoint                   | Description                 |
| -------- | -------------------------- | --------------------------- |
| `GET`    | `/api/services`            | Get all services            |
| `GET`    | `/api/services/:id`        | Get service by ID           |
| `POST`   | `/api/services`            | Create service _(Provider)_ |
| `PUT`    | `/api/services/:id`        | Update service              |
| `DELETE` | `/api/services/:id`        | Delete service              |
| `GET`    | `/api/services/categories` | Get all categories          |

### Bookings

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| `GET`  | `/api/bookings`            | Get user bookings     |
| `POST` | `/api/bookings`            | Create booking        |
| `PUT`  | `/api/bookings/:id/status` | Update booking status |

### Admin

| Method | Endpoint                           | Description             |
| ------ | ---------------------------------- | ----------------------- |
| `GET`  | `/api/admin/users`                 | Get all users           |
| `GET`  | `/api/admin/providers`             | Get pending providers   |
| `PUT`  | `/api/admin/providers/:id/approve` | Approve provider        |
| `GET`  | `/api/admin/stats`                 | Get platform statistics |

---

## 📸 Application Screenshots

### 🏠 Home Page

- Hero section with animated gradient text
- Popular service categories
- Latest services showcase
- Platform statistics

### 🔍 Services Page

- Real-time search functionality
- Category filtering sidebar
- Grid/List view toggle
- Service cards with hover effects

### 🔐 Authentication

- Modern login/register forms
- Password visibility toggle (👁️)
- Password strength indicator
- Provider role pre-selection

### 📊 Dashboards

- **Customer:** View and manage bookings
- **Provider:** Service management & booking requests
- **Admin:** Full platform control & analytics

---

## 🧪 Key Functionalities

- ✅ User Registration with Role Selection
- ✅ Secure Login with JWT
- ✅ Password Visibility Toggle
- ✅ Password Strength Validation
- ✅ Service CRUD Operations
- ✅ Real-time Search & Filtering
- ✅ Booking Management
- ✅ Role-based Dashboards
- ✅ Admin Provider Approval
- ✅ Responsive Design
- ✅ Scroll to Top on Navigation
- ✅ Active Route Highlighting

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

---

## 📄 License

This project is created as part of **ITSOLERA Internship - Task 2**.

---

## 👨‍💻 Author

<div align="center">

**LeGeND212L**

[![GitHub](https://img.shields.io/badge/GitHub-LeGeND212L-181717?style=for-the-badge&logo=github)](https://github.com/LeGeND212L)

---

### ⭐ Star this repository if you found it helpful!

<br>

Made with ❤️ using the **MERN Stack**

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

</div>
