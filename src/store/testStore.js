import { create } from 'zustand';

/**
 * Darajani aniqlash testi bosqichlari orasida holatni saqlaydi:
 * savollar -> javoblar -> natija -> ariza formasi.
 * Sahifa yangilanganda (masalan tasodifiy refresh) yo'qolishi mumkin —
 * bu qasddan, chunki test qayta boshlanishi kerak.
 */
export const useTestStore = create((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: {}, // { questionId: 'a'|'b'|'c'|'d' }
  result: null, // { attemptId, score, maxScore, percentage, determinedLevel, levelBreakdown }

  setQuestions: (questions) => set({ questions, currentQuestionIndex: 0, answers: {}, result: null }),

  answerQuestion: (questionId, selectedOption) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: selectedOption },
    }));
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  goToQuestion: (index) => set({ currentQuestionIndex: index }),

  getAnswersArray: () => {
    const { answers } = get();
    return Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId: Number(questionId),
      selectedOption,
    }));
  },

  setResult: (result) => set({ result }),

  resetTest: () => set({ questions: [], currentQuestionIndex: 0, answers: {}, result: null }),
}));
