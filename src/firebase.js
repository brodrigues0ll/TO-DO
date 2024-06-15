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
  if (typeof window === "undefined") {
    return false; // Retorna false se não estiver no navegador
  }
  return localStorage.getItem("firebaseConfig") !== null;
};

// Função para inicializar o Firebase com a configuração armazenada ou fornecida
const initializeFirebaseApp = () => {
  let firebaseConfig = getFirebaseConfigFromLocalStorage();

  // Se não houver configuração no localStorage, pedir ao usuário para inserir manualmente
  if (!firebaseConfig) {
    if (typeof window !== "undefined") {
      firebaseConfig = prompt(
        "Insira a configuração do Firebase (JSON format)"
      );
      if (firebaseConfig) {
        setFirebaseConfigToLocalStorage(firebaseConfig);
        firebaseConfig = JSON.parse(firebaseConfig);
      } else {
        throw new Error("Configuração do Firebase não fornecida.");
      }
    } else {
      throw new Error("Configuração do Firebase não fornecida.");
    }
  }

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
