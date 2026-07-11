import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProgressStore = create(
  persist(
    (set) => ({
      completedTopics: {},
      markCompleted: (language, topic) =>
        set((state) => ({
          completedTopics: {
            ...state.completedTopics,
            [`${language}/${topic}`]: true
          }
        })),
      resetProgress: () => set({ completedTopics: {} })
    }),
    {
      name: 'arclearn-progress'
    }
  )
);

export { useProgressStore };
