# 🚀 MiniLink

A LinkedIn-style social community platform that allows users to register, log in, create and manage posts, update their profile, and interact with a public feed. Built with the MERN stack.

---

## 🛠️ Tech Stack

### 🖥️ Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM
* Lucide Icons

### 🌐 Backend

* Node.js
* Express.js
* MongoDB with Mongoose
* JWT (Authentication)
* BcryptJS (Password Hashing)
* Multer (Image Uploads)
* Cloudinary (Image Hosting)
* dotenv (Environment Variables)
* express-validator (Form Validation)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Yaswanth0525/MiniLink.git
cd MiniLink
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

* Create a `.env` file inside `/backend` with the following keys:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

* Run the backend:

```bash
npm run dev
```

> The server will run at `http://localhost:5000`

---

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

* The frontend uses a proxy to `localhost:5000` for API requests (already set in `package.json`).

* Run the frontend:

```bash
npm start
```

> The app will run at `http://localhost:3000`

---

## 👤 User Roles & Features

### 🔐 Authentication

* User can **register** with name, email, password, and profile image.
* User can **log in** and get a JWT token.

### 📝 Posts

* Authenticated users can:

  * Create new posts
  * Edit or delete **only their own posts**
  * View all public posts

> Once a user registers and logs in, they can create new posts, update their own posts, and make changes to their profile. They can also view all public posts made by other users; however, they can only edit or delete the posts that they have created.

### 👤 Profile Management

* Users can:

  * View their profile
  * Edit their profile information and profile image

---

## 👨‍💻 Demo User (Optional)

If you've seeded demo data or want to share a test account:

```bash
Email: demo@minilink.com
Password: demopassword123
```

> Replace with your actual seeded/demo user credentials if available.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.
