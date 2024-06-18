import { Circle, CircleCheckBig } from "lucide-react";
import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useState, useEffect } from "react";

const Subtask = ({ subtask, maintaskId }) => {
  const [status, setStatus] = useState(subtask.status);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setStatus(subtask.status); // Atualiza o estado inicial com o status da subtarefa
  }, [subtask.status]);

  const toggleStatus = async () => {
    try {
      setIsUpdating(true); // Define que a atualização está em progresso

      const subtasksRef = collection(db, `tasks/${maintaskId}/subtasks`);
      const q = query(subtasksRef, where("title", "==", subtask.title));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        const currentStatus = doc.data().status;
        const newStatus = currentStatus === "done" ? "undone" : "done";

        setStatus(newStatus); // Atualiza o estado local imediatamente

        await updateDoc(doc.ref, { status: newStatus });
      });

      setIsUpdating(false); // Define que a atualização foi concluída
    } catch (error) {
      setIsUpdating(false); // Define que a atualização foi concluída mesmo em caso de erro
      console.error("Erro ao atualizar status da subtarefa: ", error);
    }
  };

  return (
    <>
      <div className="pb-3 ml-8 flex items-center">
        {status === "done" ? (
          <CircleCheckBig
            className={`h-5 w-5 mr-2 text-blue-500 cursor-pointer ${
              isUpdating ? "opacity-50" : ""
            }`}
            onClick={toggleStatus}
          />
        ) : (
          <Circle
            className={`h-5 w-5 mr-2 cursor-pointer ${
              isUpdating ? "opacity-50" : ""
            }`}
            onClick={toggleStatus}
          />
        )}

        <h3
          className={`text-lg ${
            subtask.status === "done" ? "line-through" : ""
          }`}
        >
          {subtask.title}
        </h3>
      </div>
    </>
  );
};

export default Subtask;
