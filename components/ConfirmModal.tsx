import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-red-900">{title}</h3>
          <button 
            onClick={onCancel}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600">{message}</p>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 shadow-md"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;