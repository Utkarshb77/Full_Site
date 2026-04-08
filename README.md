# 🏨 StayNest

A full-stack accommodation rental platform built with Node.js, Express, and MongoDB. StayNest allows users to list, browse, and review properties with an intuitive interface and robust authentication system.

![Node.js](https://img.shields.io/badge/Node.js-24.12.0-green)
![Express](https://img.shields.io/badge/Express-5.2.1-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/License-ISC-yellow)

## ✨ Features

### 🏠 Property Listings
- **Browse Properties**: Explore a wide range of accommodation listings
- **Detailed Views**: View comprehensive property information including images, descriptions, pricing, and location
- **Smart Search**: Search for destinations with an intuitive search bar
- **Tax Toggle**: View prices with or without taxes included

### 👤 User Management
- **User Authentication**: Secure signup and login using Passport.js with local strategy
- **Session Management**: Persistent user sessions with Express Session
- **Authorization**: Role-based access control for property management
- **Flash Messages**: Real-time feedback for user actions

### 📝 Property Management
- **Create Listings**: Add new properties with images, descriptions, and pricing
- **Edit Listings**: Update your property information anytime
- **Delete Listings**: Remove listings you no longer want to offer
- **Image Upload**: Cloudinary integration for seamless image storage and delivery

### ⭐ Reviews System
- **Write Reviews**: Share your experiences with properties
- **Rating System**: Rate properties to help other users
- **Review Management**: Edit or delete your own reviews
- **Cascading Deletes**: Automatically remove reviews when a listing is deleted

## 🛠️ Tech Stack

### Backend
- **Node.js** (24.12.0) - Runtime environment
- **Express.js** (5.2.1) - Web application framework
- **MongoDB** with **Mongoose** (9.1.2) - Database and ODM
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **Connect Flash** - Flash messaging

### Frontend
- **EJS** - Templating engine
- **EJS Mate** - Layout support for EJS
- **Bootstrap** - CSS framework
- **Font Awesome** - Icon library

### Cloud Services
- **Cloudinary** - Image storage and CDN
- **MongoDB Atlas** - Cloud database hosting

### Additional Tools
- **Multer** - File upload handling
- **Joi** - Schema validation
- **Method Override** - HTTP verb support
- **dotenv** - Environment variable management

## 📦 Installation

### Prerequisites
- Node.js (v24.12.0 or higher)
- MongoDB (local installation or Atlas account)
- Cloudinary account (for image uploads)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Utkarshb77/StayNest
   cd staynest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   MONGODB_URI=mongodb://localhost:27017/projectdb
   SESSION_SECRET=your_session_secret
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   node app.js
   ```

6. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:7700
   ```

## 🚀 Usage

### For Users
1. **Sign Up**: Create an account to start listing properties or writing reviews
2. **Browse Listings**: Explore available properties on the homepage
3. **Search**: Use the search bar to find specific destinations
4. **View Details**: Click on any listing to see full details and reviews
5. **Add Reviews**: Share your experience after staying at a property

### For Property Owners
1. **Login**: Sign in to your account
2. **Add New Place**: Click the "Add New Place" button in the navbar
3. **Fill Details**: Provide property information, upload images, and set pricing
4. **Manage**: Edit or delete your listings from the property detail page

## 📂 Project Structure

```
StayNest/
├── controllers/        # Route controllers (MVC pattern)
│   ├── listing.js
│   ├── reviews.js
│   └── user.js
├── models/            # Database models
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/            # Express routes
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/             # EJS templates
│   ├── includes/      # Navbar, footer, flash
│   ├── layouts/       # Boilerplate layout
│   ├── listings/      # Listing views
│   └── users/         # User views
├── public/            # Static files (CSS, JS, images)
├── utils/             # Utility functions
│   ├── MyErrors.js
│   └── wrapAsync.js
├── middleware.js      # Custom middleware
├── schema.js          # Joi validation schemas
├── cloudConfig.js     # Cloudinary configuration
├── app.js             # Main application file
└── package.json       # Dependencies and scripts
```

## 🔒 Security Features

- **Password Hashing**: Secure password storage using passport-local-mongoose
- **Session Security**: HTTP-only cookies to prevent XSS attacks
- **Input Validation**: Joi schema validation for all user inputs
- **Authentication Middleware**: Protected routes for authorized users only
- **Authorization Checks**: Users can only modify their own listings and reviews

## 🎨 UI Features

- **Responsive Design**: Mobile-friendly interface using Bootstrap
- **Sticky Navbar**: Easy navigation with StayNest branding
- **Search Functionality**: Quick destination search
- **Tax Toggle**: Switch between pre-tax and post-tax pricing
- **Flash Messages**: User-friendly notifications for actions
- **Card Layout**: Clean grid display for property listings

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Utkarsh**

## 🙏 Acknowledgments

- Express.js community for excellent documentation
- Bootstrap for the responsive framework
- Cloudinary for image hosting services
- MongoDB for the robust database solution

## 📧 Contact

For any inquiries or issues, please open an issue on GitHub.

---

Made with ❤️ by Utkarsh
>>>>>>> 0e26d64
