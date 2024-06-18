import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { initializeFirebaseApp } from "../firebase";
import MainTask from "@/components/MainTask";
import moment from "moment-timezone";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const { db } = initializeFirebaseApp();

    if (db) {
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
          tasksList.sort((a, b) => a.createdAt - b.createdAt);

          setTasks(tasksList);
        },
        (error) => {
          console.error("Error fetching tasks: ", error);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);

  return (
    <div
      className="overflow-scroll pb-14"
      style={{
        height: "calc(100vh - 6rem)",
      }}
    >
      {tasks.map((task) => (
        <MainTask key={task.id} task={task} />
      ))}
    </div>
  );
}
