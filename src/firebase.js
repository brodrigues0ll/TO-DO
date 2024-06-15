import { useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Função para obter a configuração do Firebase do localStorage
const getFirebaseConfigFromLocalStorage = () => {
  if (typeof window === "undefined") {
    return null; // Retorna null se não estiver no navegador
  }
  const storedConfig = localStorage.getItem("firebaseConfig");
  return storedConfig ? JSON.parse(storedConfig) : null;
};

// Função para definir a configuração do Firebase no localStorage
const setFirebaseConfigToLocalStorage = (config) => {
  if (typeof window === "undefined") {
    return; // Retorna se não estiver no navegador
  }
  localStorage.setItem("firebaseConfig", JSON.stringify(config));
};

// Função para verificar se a configuração do Firebase está no localStorage
const isFirebaseConfigInLocalStorage = () => {
  return localStorage.getItem("firebaseConfig") !== null;
};

// Função para inicializar o Firebase com a configuração armazenada ou fornecida
const initializeFirebaseApp = () => {
  const storedConfig = getFirebaseConfigFromLocalStorage();
  const firebaseConfig = storedConfig || {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  return { app, firebaseConfig };
};

// Inicializa o Firebase e exporta a instância do Firestore
let db;
if (typeof window !== "undefined") {
  const { app } = initializeFirebaseApp();
  db = getFirestore(app);
}

// Exporta a instância do Firebase e o Firestore
export {
  db,
  initializeFirebaseApp,
  isFirebaseConfigInLocalStorage,
  setFirebaseConfigToLocalStorage,
};
