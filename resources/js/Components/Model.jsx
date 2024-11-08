// resources/js/Components/Modal.js

import React from 'react';

const Modal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h3 className="font-semibold">{message}</h3>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
