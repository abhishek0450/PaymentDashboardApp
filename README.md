//genrate a readme file for the project
# Payment Dashboard App

A mobile-first full-stack app for managing and visualizing payments. Built with React Native and NestJS.

---

## 🌟 Features

- User login with JWT authentication
- Dashboard showing:
  - Total payments today/this week
  - Revenue and failed transactions
  - Revenue chart (last 7 days)
- Filterable and paginated transactions list
- Add new payment simulation
- Admin/user role support

---

## 🧰 Tech Stack

| Layer      | Technology            |
|------------|------------------------|
| Frontend   | React Native (Expo)    |
| Backend    | NestJS                 |
| Database   | MongoDB                |
| Auth       | JWT                    |
| Charts     | react-native-chart-kit |

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Expo CLI (`npm install -g @expo/cli`)

### Backend

```bash
cd server
npm install

# Create .env file with the following variables:
# MONGODB_URI=mongodb://localhost:27017/payment-dashboard

npm run start:dev
```

### Frontend

```bash
cd client
npm install
npx expo start
```

### Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb://localhost:27017/payment-dashboard
```

---

## 📁 Project Structure

```
payment-dashboard/
├── server/                 # NestJS backend
│   ├── src/
│   │   ├── admin/         # Admin management
│   │   ├── auth/          # Authentication module
│   │   ├── payments/      # Payment management
│   │   └── users/         # User management
│   ├── .env
│   └── package.json
├── client/                # React Native frontend
│   ├── components/        # Reusable components
│   ├── screens/           # App screens
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── App.js
│   └── package.json
└── README.md
```

---


## 🚀 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token

### Admin (Admin Only)
- `GET /admin/stats` - Get global statistics
- `GET /admin/users` - Get all users
- `GET /admin/stats/chart` - Get transaction status chart data

### Payments
- `GET /payments` - Get paginated payments list with filters (status, method, startDate, endDate, page, limit)
- `POST /payments` - Create new payment
- `GET /payments/:id` - Get payment details
- `GET /payments/stats` - Get payment statistics for current user
- `GET /payments/stats/chart` - Get chart data for current user

### Users
- `POST /users` - Create new user
- `GET /users/profile` - Get user profile
- `DELETE /users/:id` - Delete user (Admin only)



---

## 📱 Screenshots

| Login Screen | Dashboard | Transactions |
|--------------|-----------|--------------|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) | ![Transactions](screenshots/transactions.png) |

---

## 🎯 Work in Progress

- **Backend**: Implement Redis caching for frequent queries

