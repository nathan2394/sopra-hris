import React, { useEffect, useRef, useState } from "react";
import Modal from "./modal";
import { question } from "../config/icon";
import Button from "./button";
import { baseColor } from "../config/setting";

const AlertPopUp = ({ isOpen, onClose}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const closeModal = () => setModalOpen(false);

    useState(() => {
        setModalOpen(isOpen)
    }, [isOpen])
  
    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="relative bg-white rounded-lg shadow-sm">
                <div className="flex flex-col items-center justify-center p-6">
                    <img className="w-[28%] mx-auto" alt="logo" src={question} />
                    <p className="font-bold text-sm mt-2">Are You Sure?</p>
                    <p className="font-light text-xs mt-2">This Employee will be remove.</p>
                    <div className="flex flex-row w-full mt-4">
                        <Button text="Close" setWidth={'full'} showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={() => closeModal()} />
                        <div className="mx-1" />
                        <Button text="Submit" setWidth={'full'} showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={() => closeModal()} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AlertPopUp;