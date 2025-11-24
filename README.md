🚀 User Authentication System
(Express + MongoDB Atlas + JWT + bcrypt + Email Verification + Password Reset)

A fully-featured User Authentication Backend built using Node.js, Express.js, MongoDB Atlas, JWT, bcrypt, and Nodemailer.
This backend supports secure user registration, login, email verification, password reset, and protected routes.

📌 Features
🔐 User Registration

New users can register using name, email, and password

Passwords are hashed using bcrypt

🔑 User Login

Login using email & password

JWT issued on successful login

📧 Email Verification

User receives a verification email after registration

Account remains inactive until the email is verified

Contains verification token & expiry time

🔄 Forgot Password / Reset Password

User receives a password reset link or OTP in email

User can set a new password using the token

Token has an expiry time

🛡️ JWT Authentication

Protects routes using middleware

Validates user token before giving access

🌐 MongoDB Atlas Database

Fully cloud-managed NoSQL database

Mongoose used for schema & validation

🛠️ Tech Stack
Technology	Usage
Node.js	Backend runtime
Express.js	API framework
MongoDB Atlas	Cloud database
Mongoose	MongoDB ORM
bcrypt	Hashing passwords
jsonwebtoken	Creating JWT tokens
Nodemailer	Sending emails (verification & reset)
📁 Project Structure
├── controllers
│   └── authController.js
├── middleware
│   └── authMiddleware.js
├── models
│   └── User.js
├── routes
│   └── authRoutes.js
├── utils
│   └── sendEmail.js
├── .env
├── server.js
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-repo-link.git
cd your-project-folder
