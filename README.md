# Tribe Green Catalogue and Enquiry System

A catalogue and enquiry system for a corporate gifting brand. The website and Android app share one backend, and every enquiry reaches one admin page.

## Links

| Item | Link |
|---|---|
| Live website | https://tribe-green-npq6.onrender.com |
| Admin page | https://tribe-green-npq6.onrender.com/admin |
| Admin login | Shared in the submission message, not in this public repo |
| Android APK | https://drive.google.com/file/d/1MHf75MCNiAiC66Qijw0GjqDnO9PqcNg_/view?usp=sharing |
| App screen recording | https://drive.google.com/file/d/1-UBhwibOjoUZln64YNOer1yREra7imZz/view?usp=sharing |

## How to run it

You need Node 20 or newer and MongoDB (local or Atlas).

**1. Backend**

```
cd server
npm install
cp .env.example .env     # then fill in your values
npm run seed             # adds the sample products
npm run dev              # runs on http://localhost:5000
```

**2. Website**

```
cd web
npm install
npm run dev              # runs on http://localhost:5173
```

**3. Mobile app**

```
cd mobile
npm install
npx expo start --android
```

To use a local backend from the Android emulator, create `mobile/.env` with `EXPO_PUBLIC_API_URL=http://10.0.2.2:5000`.

**Build the APK:** set the live URL in `mobile/src/config.js`, then run these in the `mobile` folder:

```
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

The APK is saved in `android/app/build/outputs/apk/release`. On Windows, this needs long paths turned on and CMake 4.1.2 from the Android SDK Manager, set as `cmake.dir` in `android/local.properties`.

**Deploy:** Render reads `render.yaml`. Add `MONGODB_URI`, `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the Render dashboard, then run `npm run seed` once with `MONGODB_URI` pointing at Atlas.

## Stack and why

| Part | Choice | Why |
|---|---|---|
| Backend | Node, Express | JavaScript across the whole project |
| Database | MongoDB, Mongoose | Products and enquiries fit simple documents, and all validation sits in the schema |
| Website and admin | React, Vite, Tailwind CSS | Fast to build, and responsive layouts are simple |
| Mobile app | React Native, Expo | Reuses React knowledge, and builds an Android APK from JavaScript |
| Hosting | Render, MongoDB Atlas | Free, and one service runs both the API and the website |

**Share images:** link previews do not run JavaScript, so a plain React site shows the same preview for every page. Express adds the right title, description and image to `index.html` before sending it. See `server/meta.js`.

## Extras built

Product search on the website and in the app.

## What I would improve with more time

- Add login rate limiting and hashed passwords for admin
- Add search, filters and pagination to the admin page
- Send an email alert to the sales team for each new enquiry
- Share the constants between the server, website and app instead of keeping three copies
- Add automated tests
- Use real product photos

## Anything incomplete

- Product images are simple illustrations, not photos
- No WhatsApp number is set, so the button opens WhatsApp with the message ready and the user picks the contact. Add a number in `web/src/constants.js` to open a direct chat
- "My enquiries" is saved on the phone, so it does not show status changes made in admin

## Hours spent

About 15 hours
