import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

let firebaseApp: admin.app.App;

export const initFirebase = (): admin.app.App => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';
    const resolvedPath = path.resolve(serviceAccountPath);

    if (fs.existsSync(resolvedPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID || 'mahaas-development',
      });
      console.log('🔥 Firebase Admin SDK initialized successfully');
    } else {
      console.warn(`⚠️ Service account file not found at: ${resolvedPath}. Falling back to default credentials.`);
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'mahaas-development',
      });
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    if (!admin.apps.length) {
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'mahaas-development',
      });
    }
  }

  return firebaseApp;
};

export const getAuth = () => {
  if (!admin.apps.length) initFirebase();
  return admin.auth();
};
