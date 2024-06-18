import { Circle, CircleCheckBig } from "lucide-react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useState, useEffect } from "react";

const Subtask = ({ subtask, maintaskId }) => {
  const [status, setStatus] = useState(subtask.status);

  useEffect(() => {
    setStatus(subtask.status);
  }, [subtask.status]);

  const toggleStatus = async () => {
    try {
      // Determina o novo status invertendo o atual
      const newStatus = status === "done" ? "undone" : "done";

      // Atualiza o estado local para refletir a mudança imediatamente
      setStatus(newStatus);

      // Referência ao documento da main task
      const mainTaskDocRef = doc(db, "tasks", maintaskId);
      const mainTaskDoc = await getDoc(mainTaskDocRef);

      if (mainTaskDoc.exists()) {
        const mainTaskData = mainTaskDoc.data();
        const updatedSubtasks = mainTaskData.subtasks.map((st) =>
          st.id === subtask.id ? { ...st, status: newStatus } : st
        );

        // Atualiza o documento da main task com o array de subtasks modificado
        await updateDoc(mainTaskDocRef, { subtasks: updatedSubtasks });
      } else {
        console.error("Main task não encontrada.");
      }
    } catch (error) {
      console.error("Erro ao atualizar status da subtarefa: ", error);
    }
  };

  return (
    <div className="pb-3 ml-8 flex items-center">
      {status === "done" ? (
        <CircleCheckBig
          className="h-5 w-5 mr-2 text-blue-500 cursor-pointer"
          onClick={toggleStatus}
        />
      ) : (
        <Circle
          className="h-5 w-5 mr-2 cursor-pointer"
          onClick={toggleStatus}
        />
      )}

      <h3 className={`text-lg ${status === "done" ? "line-through" : ""}`}>
        {subtask.title}
      </h3>
    </div>
  );
};

export default Subtask;
