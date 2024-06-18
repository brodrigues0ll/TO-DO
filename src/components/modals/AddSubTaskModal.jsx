import React, { useState } from "react";
import {
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";

const AddSubTaskModal = ({ isModalOpen, closeModal, maintaskId }) => {
  const [taskTitle, setTaskTitle] = useState("");

  const createSubTask = async () => {
    if (taskTitle.trim() === "") {
      alert("O título da subtarefa não pode estar vazio");
      return;
    }

    try {
      // Adicionar a subtarefa à coleção de subtarefas no Firestore
      const subTaskData = {
        id: uuidv4(),
        title: taskTitle,
        status: "undone",
        createdAt: moment.tz("America/Sao_Paulo").format(),
      };

      // Adicionar a subtarefa à coleção de subtarefas no Firestore
      const subTaskRef = await addDoc(
        collection(db, `tasks/${maintaskId}/subtasks`),
        subTaskData
      );

      // Atualizar o array 'subtasks' na tarefa principal
      const mainTaskRef = doc(db, "tasks", maintaskId);
      await updateDoc(mainTaskRef, {
        subtasks: arrayUnion(subTaskData),
      });

      setTaskTitle(""); // Limpar o campo de entrada após adicionar a subtarefa
      closeModal(); // Fechar o modal após adicionar a subtarefa
    } catch (error) {
      console.error("Erro ao adicionar subtarefa: ", error);
    }
  };

  return (
    <div className={`${isModalOpen ? "block" : "hidden"}`}>
      <div className="flex justify-center items-center">
        <div
          className="absolute z-10 h-screen w-screen bg-black opacity-50 top-0 flex justify-center"
          onClick={closeModal}
        />
        <div className="bg-zinc-900 flex justify-center items-center absolute top-32 rounded flex-col gap-5 py-5 z-20 w-4/5">
          <div className="bg-blue-600 w-full absolute top-0 text-center rounded-t py-2">
            <h1>Adicionar Subtarefa</h1>
          </div>
          <input
            className="appearance-none bg-transparent w-4/5 text-zinc-100 py-1 px-2 leading-tight focus:outline-none text-2xl border-b-2 border-blue-500 mt-16"
            type="text"
            placeholder="Subtarefa"
            aria-label="Subtarefa"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <button
            className="px-5 py-2 bg-blue-600 rounded active:bg-blue-800"
            onClick={createSubTask}
          >
            <h2 className="font-medium">Adicionar</h2>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubTaskModal;
