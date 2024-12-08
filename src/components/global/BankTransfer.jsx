// src/components/global/BankTransferModal.js
import React from "react";
import { FaMoneyBill } from "react-icons/fa"; // For the bank transfer icon

const BankTransferModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center mb-4">
          <FaMoneyBill className="text-blue-500 text-xl md:text-2xl mr-2 md:mr-3" />
          <h2 className="text-xl md:text-2xl font-bold">
            Bank Transfer Option is Live!
          </h2>
        </div>
        <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6">
          Please follow these steps to receive your 6ense tokens (60S):
        </p>
        <ol className="list-decimal list-inside mb-4 md:mb-6 space-y-1 md:space-y-2 text-gray-700 text-sm md:text-base">
          <li>
            Choose your total amount and send the money to the following bank
            account:
            <ul className="list-disc list-inside pl-4 mt-1 md:mt-2">
              <li>
                <strong>Name:</strong> Plantogroup Srl
              </li>
              <li>
                <strong>IBAN:</strong> IT15C0623074370000040647795
              </li>
              <li>
                <strong>SWIFT:</strong> CRPPIT2P185
              </li>
              <li>
                <strong>Bank Name:</strong> Credit Agricole
              </li>
            </ul>
          </li>
          <li>
            In the reason for the bank transfer, write your wallet address and
            specify if ERC20 or BEP20. For example:
            <ul className="list-disc list-inside pl-4 mt-1 md:mt-2">
              <li>
                <strong>ERC20:</strong>{" "}
                0x06fe8f07513f7a0c3a3d4a948bee12263c3197af
              </li>
            </ul>
          </li>
          <li>
            Send the proof of payment to{" "}
            <a
              href="mailto:plantogroup@gmail.com"
              className="text-blue-500 underline"
            >
              plantogroup@gmail.com
            </a>
            .
          </li>
          <li>
            Once verified, we will send the tokens to the address provided in
            the reason for the bank transfer.
          </li>
        </ol>
        <div className="mt-4 md:mt-6 flex justify-center">
          <button
            className="bg-blue-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold hover:bg-blue-600 transition duration-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankTransferModal;
