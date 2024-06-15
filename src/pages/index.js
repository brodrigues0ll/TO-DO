import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {
  db,
  isFirebaseConfigInLocalStorage,
  setFirebaseConfigToLocalStorage,
} from "../firebase";
import MainTask from "@/components/MainTask";
import moment from "moment-timezone";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [firebaseConfigSet, setFirebaseConfigSet] = useState(
    isFirebaseConfigInLocalStorage()
  );

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(db, "tasks");

      const unsubscribe = onSnapshot(
        tasksCollection,
        (snapshot) => {
          const tasksList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: moment
              .tz(doc.data().createdAt, "America/Sao_Paulo")
              .toDate(),
          }));

          // Ordenar as tarefas por createdAt
          tasksList.sort((b, a) => b.createdAt - a.createdAt);

          setTasks(tasksList);
        },
        (error) => {
          console.error("Error fetching tasks: ", error);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    };

    if (!firebaseConfigSet || firebaseConfigSet === null) {
      const userConfig = prompt("Digite a configuração do Firebase (JSON)");
      try {
        const configObject = JSON.parse(userConfig);
        setFirebaseConfigToLocalStorage(configObject);
        setFirebaseConfigSet(true);
      } catch (error) {
        console.error("Configuração inválida do Firebase:", error);
      }
    }

    fetchTasks();
  }, [firebaseConfigSet]);

  return (
    <div>
      {tasks.map((task) => (
        <MainTask key={task.id} task={task} />
      ))}
    </div>
  );
}
