import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import moment from "moment-timezone";

export const AddTaskModal = ({ isOpen, closeModal }) => {
  const [taskTitle, setTaskTitle] = useState("");

  const createTask = async () => {
    if (taskTitle.trim() === "") {
      alert("O título da tarefa não pode estar vazio");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        status: "undone",
        subtasks: [],
        createdAt: moment.tz("America/Sao_Paulo").format(),
      });
      setTaskTitle(""); // Limpar o campo de entrada após adicionar a tarefa
      closeModal(); // Fechar o modal após adicionar a tarefa
    } catch (e) {
      console.error("Erro ao adicionar tarefa: ", e);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="absolute z-10 h-screen w-screen bg-black opacity-50 top-0 flex justify-center"
        onClick={closeModal}
      />
      <div className="bg-zinc-900 flex justify-center items-center absolute top-32 rounded flex-col gap-5 py-5 z-20 w-4/5">
        <div className="bg-blue-600 w-full absolute top-0 text-center rounded-t py-2">
          <h1>Adicionar nova Tarefa</h1>
        </div>
        <input
          className="appearance-none bg-transparent w-4/5 text-zinc-100 py-1 px-2 leading-tight focus:outline-none text-2xl border-b-2 border-blue-500 mt-16"
          type="text"
          placeholder="Tarefa"
          aria-label="Tarefa"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button
          className="px-5 py-2 bg-blue-600 rounded active:bg-blue-800"
          onClick={createTask}
        >
          <h2 className="font-medium">Adicionar</h2>
        </button>
      </div>
    </div>
  );
};
