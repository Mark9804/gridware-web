import { defineStore } from "pinia";

export const useConfigStore = defineStore({
  id: "config",
  state: () => {
    return {
      language: "en",
      theme: "light",
    };
  },
  // persist: true,
  getters: {
    getLanguage: (state) => state.language,
    getTheme: (state) => state.theme,
  },
  actions: {
    setLanguage(language) {
      this.language = language;
    },
    setTheme(theme) {
      this.theme = theme;
    },
  },
});
