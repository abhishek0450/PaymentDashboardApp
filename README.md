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

![Screenshot_2025_07_18_13_30_18_88_f73b71075b1de7323614b647fe3942](https://github.com/user-attachments/assets/e01a3f2f-34b9-4af0-a519-b857cb3c1de7)
![Screenshot_2025_07_18_13_30_22_57_f73b71075b1de7323614b647fe3942](https://github.com/user-attachments/assets/372ed8ee-3d22-48cb-9409-7adc26af6c2e)
![Screenshot_2025_07_18_13_29_23_27_f73b71075b1de7323614b647fe3942](https://github.com/user-attachments/assets/f0827189-a550-4abb-b5e4-a52039a7784a)
![Screenshot_2025_07_18_13_29_46_14_f73b71075b1de7323614b647fe3942](https://github.com/user-attachments/assets/3b72df34-2fe2-4224-8dfc-1d84ca0a5881)
![Screenshot_2025_07_18_13_29_37_47_f73b71075b1de7323614b647fe3942](https://github.com/user-attachments/assets/d50fc703-37ab-4c4e-bcde-54054b3f7972)
![Screenshot_2025_07_18_13_29_27_27_f73b71075b1de7323614b647fe3942](https://github.com/user-attachments/assets/1846b101-0d77-45a5-8886-c1210011f0fb)
![Screenshot_2025-07-18-13-29-58-37](https://github.com/user-attachments/assets/153587b7-bacb-46a3-aa8a-9b218baa6044)
![Screenshot_2025-07-18-13-28-52-64](https://github.com/user-attachments/assets/4c8facae-9b7f-4221-8b92-941e0534d2b3)

## 🎯 Work in Progress

- **Backend**: Implement Redis caching for frequent queries

