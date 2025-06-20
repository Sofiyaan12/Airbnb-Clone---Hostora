# 🏡 Hostora - Airbnb Clone

A full-stack Airbnb-style rental listing application where users can:
- Create, view, edit, and delete property listings
- Upload images and locations using Mapbox & Cloudinary
- Leave reviews and ratings
- Sign up, log in, and maintain session-based authentication

Live Demo: https://hostora.onrender.com

---

## 🚀 Features

- 🗺️ Interactive maps with **Mapbox GL JS**
- ☁️ Image uploads via **Cloudinary**
- 🧭 Geocoding locations using **Mapbox SDK**
- ✍️ Ratings and reviews with **Starability CSS**
- 🔐 Authentication with **Passport.js**
- 🛡️ Custom error handling and session flash messages
- 📦 Organized MVC folder structure

---

## 🛠️ Tech Stack

| Layer        | Tech Used                      |
|--------------|--------------------------------|
| Frontend     | EJS, Bootstrap, Starability    |
| Backend      | Node.js, Express.js            |
| Database     | MongoDB (via Mongoose)         |
| Geolocation  | Mapbox SDK & Mapbox GL JS      |
| Image Upload | Cloudinary + Multer            |
| Auth         | Passport.js (Local Strategy)   |
| Deployment   | Render.com                     |

---

## 📁 Project Structure

```bash
.
├── app.js                   # Express server
├── cloudConfig.js          # Cloudinary config
├── middleware.js           # Auth & validation middlewares
├── schema.js               # Joi validation schemas
├── .gitignore
├── package.json
├── package-lock.json

├── controllers/
│   ├── listing.js
│   ├── review.js
│   └── users.js

├── init/
│   ├── data.js
│   └── index.js

├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js

├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── rating.css
│   └── javascript/
│       ├── map.js
│       └── script.js

├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js

├── utils/
│   ├── expressError.js
│   └── wrapAsync.js

├── views/
│   ├── includes/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   ├── users/
│   │   ├── login.ejs
│   │   ├── signup.ejs
│   └── error.ejs

🧪 Environment Setup
Create a .env file in the root of your project and add:
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_access_token
ATLASDB_URL=your_mongo_atlas_connection_string
SECRET=your_session_secret

💾 Installation & Running Locally
# 1. Clone the repository
git clone https://github.com/your-username/hostora.git
cd hostora

# 2. Install dependencies
npm install

# 3. Seed data (optional)
node init/index.js

# 4. Start the app
node app.js

# App runs at:
http://localhost:8080/listings

📸 Screenshots
soon;

👨‍💻 Author
Mohammed Sofiyaan

📄 License
This project is licensed under the MIT License.




