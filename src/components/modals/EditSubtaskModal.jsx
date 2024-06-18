import React, { useState } from "react";

export const EditSubtaskModal = ({
  isModalOpen,
  closeModal,
  subTask,
  updateSubtaskTitle,
}) => {
  const [taskTitle, setTaskTitle] = useState(subTask.title);

  const handleSave = () => {
    updateSubtaskTitle(taskTitle);
    closeModal();
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
            <h1>Editar Subtarefa</h1>
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
            onClick={handleSave}
          >
            <h2 className="font-medium">Salvar</h2>
          </button>
        </div>
      </div>
    </div>
  );
};
