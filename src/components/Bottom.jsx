import { Plus } from "lucide-react";
import React, { useState } from "react";
import { AddTaskModal } from "./modals/AddTaskModal";

export const Bottom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="h-20 fixed w-full bottom-0 -mb-[1px] flex items-end">
        <div className="h-10 bg-zinc-700 bottom-0 w-full flex justify-center">
          <button
            className="p-2 bg-blue-600 rounded-full absolute bottom-5 active:bg-blue-800"
            onClick={openModal}
          >
            <Plus className="h-10 w-10" />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <AddTaskModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </>
  );
};
