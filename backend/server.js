// FILE: backend/server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
try {
  if (!process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY.includes('...')) {
    console.warn('⚠️ FIREBASE_PRIVATE_KEY is missing or contains placeholders. Firebase features will be disabled.');
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
}

// Import Routes
// const memberRoutes = require('./routes/members');
// app.use('/api/members', memberRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AXIOM RC Backend running on port ${PORT}`);
});
