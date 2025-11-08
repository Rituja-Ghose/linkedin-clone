LinkedIn Clone

A full-stack LinkedIn-like social media application built with React, Node.js, Express, MongoDB, and Cloudinary for image uploads. Users can create accounts, login, post text/images, like/unlike posts, and comment on posts.

Tech Stack

1. Frontend: React (Vite), Axios, React Router, Tailwind CSS (optional if used)
2. Backend: Node.js, Express.js
3. Database: MongoDB (Mongoose ORM)
4. Authentication: JWT, bcryptjs
5. Image Storage: Cloudinary
6. Deployment: Vercel (frontend), Render (backend)
7. Environment Variables: .env for sensitive info like JWT_SECRET, MongoDB URI, Cloudinary keys, Frontend URL

Features

1. User signup and login with JWT authentication
2. Profile picture upload (Cloudinary integration)
3. Create posts with text and image
4. Like/Unlike posts
5. Comment on posts
6. Edit and delete posts (only by post owner)
7. Fetch and display all posts
8. Fully responsive frontend with React
9. Secure API endpoints with JWT authentication
10. CORS configured for frontend-backend communication