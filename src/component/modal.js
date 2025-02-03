import React, { useEffect, useRef, useState } from "react";

const Modal = ({ isOpen, onClose, children, position = 'center' }) => {
    if (!isOpen) return null;
  
    return (
      <div className={`modal-overlay flex ${position === 'right' ? 'justify-end' : position === 'left' ? 'justify-start' : 'justify-center'} items-start`}>
        <div className="modal-content w-[400px] mx-4">
          {children}
        </div>
      </div>
    );
  };

export default Modal;