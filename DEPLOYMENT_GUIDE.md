# 🚀 Final Deployment Steps for Xtreme Tattoo Studio

To make your website work in production (Vercel), you must connect it to a database and image storage.

## 1. MongoDB Setup (Data Storage)
1.  **Signup:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  **Create Cluster:** Choose "Deploy a cloud database" -> "M0 (Free)".
3.  **Database User:** Create a user with a username and password (write these down!).
4.  **Network Access:** Go to "Network Access" -> "Add IP Address" -> Click "Allow Access from Anywhere".
5.  **Get Connection String:** Go to "Database" -> "Connect" -> "Drivers".
6.  **Copy String:** It looks like `mongodb+srv://<username>:<password>@cluster...`.
7.  **Paste in `.env.local`:** Replace `<password>` with your actual password.

## 2. Cloudinary Setup (Image Storage)
1.  **Signup:** Go to [Cloudinary](https://cloudinary.com/signup) and create a free account.
2.  **Dashboard:** Go to your Cloudinary Dashboard.
3.  **Copy Keys:** Copy your **Cloud Name**, **API Key**, and **API Secret**.
4.  **Paste in `.env.local`**.

## 3. Vercel Configuration
1.  Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Go to **Settings** -> **Environment Variables**.
3.  Add the 4 keys from your `.env.local` there.

---

## ✅ Need Help?
Once you have pasted the values into [**.env.local**](file:///y:/muku/.env.local), just say **"Check my keys"** and I will verify if the connection works!
