import { defineStore } from "pinia";

const modalState = defineStore("modalState", {
  state() {
    return {
      modalActive: false,
    };
  },
  actions: {
    openModal(): void {
      this.modalActive = true;
    },
    closeModal(): void {
      this.modalActive = false;
    },
  },
});

export default modalState;
