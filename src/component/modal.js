import React, { useEffect, useRef, useState } from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content w-[400px]">
          {children}
        </div>
      </div>
    );
  };

export default Modal;