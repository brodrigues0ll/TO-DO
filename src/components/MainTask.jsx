import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  CircleCheckBig,
  CornerDownRight,
  Trash2,
} from "lucide-react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Subtask from "./SubTask";
import AddSubTaskModal from "./modals/AddSubTaskModal";

const MainTask = ({ task }) => {
  const taskKey = useMemo(() => `task-${task.id}-collapsed`, [task.id]);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const collapsedState = localStorage.getItem(taskKey);
    return collapsedState !== null ? JSON.parse(collapsedState) : true;
  });
  const [mainTaskStatus, setMainTaskStatus] = useState(task.status);
  const [isOpenSubtaskModal, setIsOpenSubtaskModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    localStorage.setItem(taskKey, JSON.stringify(isCollapsed));
  }, [isCollapsed, taskKey]);

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const deleteTask = async () => {
    if (!db) {
      console.error("Firestore instance is not initialized.");
      return;
    }

    try {
      await deleteDoc(doc(db, "tasks", task.id));
      console.log("Tarefa excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir tarefa: ", error);
    }
  };

  const openModal = () => {
    setIsOpenSubtaskModal(true);
  };

  const closeModal = () => {
    setIsOpenSubtaskModal(false);
  };

  const toggleStatus = async () => {
    if (!db) {
      console.error("Firestore instance is not initialized.");
      return;
    }

    try {
      setIsUpdating(true); // Indica que a atualização está em progresso

      // Determina o novo status invertendo o atual
      const newStatus = mainTaskStatus === "done" ? "undone" : "done";

      // Atualiza o status no Firestore
      await updateDoc(doc(db, "tasks", task.id), { status: newStatus });

      // Atualiza o estado local para refletir a mudança
      setMainTaskStatus(newStatus);

      setIsUpdating(false); // Indica que a atualização foi concluída
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa: ", error);
      setIsUpdating(false); // Garante que isUpdating seja false em caso de erro
    }
  };

  return (
    <>
      <div key={task.id} className="px-5 py-2 mt-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {mainTaskStatus === "done" ? (
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
            <h2
              className={`text-xl font-medium ${
                mainTaskStatus === "done" ? "line-through" : ""
              }`}
            >
              {task.title}
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <button onClick={deleteTask}>
              <Trash2 className="active:text-blue-500 h-7 w-7" />
            </button>
            <button onClick={toggleCollapse}>
              {isCollapsed ? (
                <ChevronRight className="h-8 w-16" />
              ) : (
                <ChevronDown className="h-8 w-16" />
              )}
            </button>
          </div>
        </div>
        {!isCollapsed && (
          <div className="px-2 py-2">
            <CornerDownRight className="-mb-6" />
            {task.subtasks.map((subtask) => (
              <Subtask
                key={subtask.id}
                subtask={subtask}
                maintaskId={task.id}
              />
            ))}
            <div className="w-full flex justify-center">
              <button
                className="px-4 py-2 mt-5 bg-blue-600 text-white rounded active:bg-blue-800"
                onClick={openModal}
              >
                Subtarefa
              </button>
            </div>
          </div>
        )}
      </div>
      <AddSubTaskModal
        isModalOpen={isOpenSubtaskModal}
        closeModal={closeModal}
        maintaskId={task.id}
      />
    </>
  );
};

export default MainTask;
