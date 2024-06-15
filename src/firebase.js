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

  if (!firebaseConfig) {
    // Configuração não encontrada no localStorage, solicita ao usuário
    let configInput = prompt("Insira a configuração do Firebase (JSON format)");
    if (configInput) {
      try {
        firebaseConfig = JSON.parse(configInput);
        setFirebaseConfigToLocalStorage(firebaseConfig);
      } catch (error) {
        console.error("Erro ao analisar configuração do Firebase: ", error);
        firebaseConfig = null;
      }
    } else {
      console.error("Configuração do Firebase não fornecida!");
      return null;
    }
  }

  // Inicializa o Firebase se a configuração estiver disponível
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);

  return { app, db, firebaseConfig };
};

export {
  initializeFirebaseApp,
  isFirebaseConfigInLocalStorage,
  setFirebaseConfigToLocalStorage,
};
