
import React, { useState, useEffect } from 'react';
import { GOAL_RANKS } from '../constants';
import { RankOption, Habit } from '../types';
import { X, CheckCircle, ChevronRight, ArrowLeft, Activity } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onConfirm: (habitId: string, rank: RankOption) => void;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, habits, onConfirm }) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Select Habit, 2: Select Rank
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [selectedRank, setSelectedRank] = useState<RankOption | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedHabitId(null);
      setSelectedRank(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedRank && selectedHabitId) {
      onConfirm(selectedHabitId, selectedRank);
    }
  };

  const handleNextStep = () => {
    if (selectedHabitId) setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedRank(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {step === 2 && (
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex-1 text-center">
            {step === 1 ? "1. Elige un Hábito para desafiar" : "2. Elige la intensidad de tu meta"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* STEP 1: SELECT HABIT */}
        {step === 1 && (
          <div className="animate-[slideUp_0.3s_ease-out]">
            {habits.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No tienes hábitos creados para asignarles una meta.</p>
                <button onClick={onClose} className="text-blue-600 font-semibold hover:underline">
                  Ir a crear un hábito primero
                </button>
              </div>
            ) : (
              <div className="grid gap-3 max-h-[60vh] overflow-y-auto p-2">
                {habits.map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => setSelectedHabitId(habit.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                      selectedHabitId === habit.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${selectedHabitId === habit.id ? 'bg-blue-200' : 'bg-gray-100'}`}>
                        <Activity className={`h-6 w-6 ${selectedHabitId === habit.id ? 'text-blue-700' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{habit.name}</h3>
                        <p className="text-sm text-gray-500">{habit.frequency}</p>
                      </div>
                    </div>
                    {selectedHabitId === habit.id && <CheckCircle className="h-6 w-6 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                disabled={!selectedHabitId}
                onClick={handleNextStep}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT RANK */}
        {step === 2 && (
          <div className="animate-[slideUp_0.3s_ease-out]">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 mb-6">
              {GOAL_RANKS.map((rank) => (
                <div
                  key={rank.id}
                  onClick={() => setSelectedRank(rank)}
                  className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    selectedRank?.id === rank.id
                      ? 'border-blue-500 bg-blue-50 shadow-md transform -translate-y-1'
                      : 'border-transparent bg-gray-50 hover:border-blue-200'
                  }`}
                >
                  <div className="mb-3 text-5xl">{rank.imageEmoji}</div>
                  <h3 className="text-lg font-bold text-gray-800">{rank.name}</h3>
                  <p className="text-sm text-gray-500">{rank.days} días</p>
                </div>
              ))}
            </div>

            {/* Confirmation Area */}
            {selectedRank && (
              <div className="rounded-lg bg-blue-50 p-4 text-center border border-blue-100">
                <p className="mb-4 text-lg text-blue-900">
                  Asignar desafío <strong>{selectedRank.name}</strong> ({selectedRank.days} días) al hábito <strong>{habits.find(h => h.id === selectedHabitId)?.name}</strong>?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleConfirm}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Confirmar Meta
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default GoalModal;
