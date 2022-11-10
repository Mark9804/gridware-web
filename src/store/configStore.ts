import { defineStore } from 'pinia';

export const useConfigStore = defineStore({
  id: 'config',
  state: () => {
    return {
      language: 'en',
      theme: 'light',
    };
  },
  // persist: true,
  getters: {
    getLanguage: state => state.language,
    getTheme: state => state.theme,
  },
  actions: {
    setLanguage(language: string) {
      this.language = language;
    },
    setTheme(theme: string) {
      this.theme = theme;
    },
  },
});
