# BookShop Frontend - React Application

A comprehensive React bookshop application built with Vite, featuring authentication, shopping cart, admin panel, and bill generation.

## Features

### Customer Features
- **Authentication**: Login/Register with role selection (Customer/Staff)
- **Browse Books**: View all books with search, filter, and sort functionality
- **Book Details**: Detailed view of individual books with pricing and stock info
- **Shopping Cart**: Add/remove items, adjust quantities, view totals
- **Checkout**: Complete order process with billing information
- **Bill Generation**: Download invoice after purchase
- **Responsive Design**: Mobile-friendly interface

### Staff Features
- **Admin Dashboard**: Overview of books, customers, and low stock items
- **Book Management**: Full CRUD operations for book inventory
- **Customer Management**: View and manage customer information
- **Role-based Access**: Protected admin routes for staff only

### Pages Included
- **Home**: Hero section with featured books and company stats
- **About Us**: Company story, mission, vision, and team
- **Contact**: Contact form and business information
- **Books**: Complete book catalog with filtering
- **Cart**: Shopping cart management
- **Checkout**: Order completion process
- **Admin Panel**: Staff management interface

## Tech Stack

- **Frontend**: React 19, Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Styling**: Tailwind CSS (utility classes)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Backend Integration

The application is configured to work with your Spring Boot backend at `http://localhost:8080`. Ensure your backend server is running before using the frontend.

### API Endpoints Used
- `POST /auth/signin` - User login
- `POST /auth/signup` - Customer registration
- `POST /auth/staff_signup` - Staff registration
- `GET /item` - Get all books
- `GET /item/{id}` - Get book by ID
- `POST /item` - Create new book (Staff only)
- `PUT /item/{id}` - Update book (Staff only)
- `DELETE /item/{id}` - Delete book (Staff only)
- `GET /customer` - Get all customers (Staff only)

## User Roles

### Customer
- Browse and purchase books
- Manage shopping cart
- Complete checkout process
- Generate bills/invoices

### Staff
- All customer features
- Access to admin dashboard
- Manage book inventory (CRUD)
- View customer information
- Monitor stock levels

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Books.jsx
│   ├── BookDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── OrderConfirmation.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Admin.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

1. Make sure your Spring Boot backend is running on port 8080
2. Install frontend dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:5173 in your browser
5. Register as either a Customer or Staff member
6. Explore the bookshop features!

## Notes

- The application uses localStorage for cart persistence
- JWT tokens are stored in localStorage for authentication
- All forms include proper validation and error handling
- The admin panel is only accessible to users with STAFF role
- Bill generation creates downloadable text invoices

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
