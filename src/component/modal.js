import React, { useEffect, useRef, useState } from "react";

const Modal = ({ isOpen, onClose, setWidth = '400px', children, position = 'center' }) => {
    if (!isOpen) return null;
  
    return (
      <div className={`modal-overlay flex ${position === 'right' ? 'justify-end' : position === 'left' ? 'justify-start' : 'justify-center'} items-start`}>
        <div className={`modal-content mx-4`} style={{width: setWidth}}>
          {children}
        </div>
      </div>
    );
  };

export default Modal;