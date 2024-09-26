import React from "react";
import Image from "next/image";
import { XCircle } from "lucide-react"; // Icon for close

const Modal = ({ onClose, missingSelection }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal background */}
      <div className="fixed inset-0 bg-black bg-opacity-30"></div>

      {/* Modal content */}
      <div className="relative bg-white w-80 p-6 rounded-lg shadow-lg border border-yellow-400">
        <div className="flex justify-end">
          {/* Close button with lion-themed color */}
          <button
            onClick={onClose}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Lion icon on top (you can replace this with an actual lion image if desired) */}
        <div className="flex justify-center mb-4">
          <Image src="/images/lion.png" alt="Lion" width={64} height={64} />
        </div>

        {/* Modal Title */}
        <h2 className="text-2xl font-semibold text-yellow-700 mb-4 text-center">
          Oh no!
        </h2>

        {/* Modal Message */}
        <p className="text-gray-800 mb-4 text-center">
          You have only selected the <strong>{missingSelection}</strong>. Please
          select the
          <strong>
            {missingSelection === "mode" ? "algorithm" : "mode"}
          </strong>{" "}
          to proceed!
        </p>

        {/* Close button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600"
          >
            Okay, I'll pick!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
