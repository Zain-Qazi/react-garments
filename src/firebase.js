import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// App Check (reCAPTCHA Enterprise / Fraud Defense): Firestore ko sirf aap ki asli website se requests milengi.
// Ye getFirestore() se PEHLE initialize hona chahiye.
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

if (siteKey) {
  // Sirf local development mein debug token (production build mein nahi chalta)
  if (import.meta.env.DEV) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
} else {
  console.warn("VITE_RECAPTCHA_SITE_KEY set nahi hai: App Check disabled.");
}

export const db = getFirestore(app);