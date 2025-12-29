MERN-stack-based Library Management System (LMS) designed to enhance user experience with seamless book browsing, requesting, and monitoring features. It incorporates AI-driven functionalities, semantic search, and personalized recommendations to improve book discovery and user engagement.

Features
Admin Features
Book Management: Add, update, and remove books.
User Management: View user details, track borrowed books, and manage transactions.
Book Requests: Approve or reject book requests, update book status, and handle lost book reports.
Fine & Payment System: Automatic fine calculation for overdue books and lost books, with eSewa integration for online payments.
Notifications: Send alerts for book availability, due dates, fines, and request status.
Client Features
Book Search & Discovery: AI-powered semantic search and content-based recommendation system.
Book Borrowing: Request books and track borrowed items.
Profile Management: Update personal information and view book history.
Notifications: Receive updates on due dates, fines, and book availability.
Payments: Pay fines through eSewa.
Version Specifications
NodeJS : v18.16.0
Express : v4.18.2
ReactJS : v18.2.0
MongoDB: v6.0.6
Mongosh: v2.0.2
Installation Guide
How to run the project locally
Clone the Repository:

git clone https://github.com/Pravakar-RijaI/Pustak-Prabandha.git
Navigate to Both 'Frontend' and 'Backend' Folders:

cd frontend  
cd backend
Install Dependencies:

npm install
Start the Frontend and Backend:

npm run dev
Database Setup (MongoDB):

Ensure MongoDB is running.
Open MongoDB Compass (if not installed, download it).
Import JSON files from the mongoDatabase folder into respective collections.
Import respective .JSON file into database Collection
Login Credentials
Starter Login Credentials (Ensure database collections are imported):

Admin User (user_type = "admin_user"):

Email : admin@gmail.com  
Password : admin
Normal User (user_type = "normal_user"):

Can be created through the Sign-Up page.
Lessons Learned
Code comments are love letters you leave behind for your future self.
If you can't solve it now, document it for your future self – they might have the answer!
Tech Stack
Frontend: React, Bootstrap

Backend: Node, Express, MongoDB
