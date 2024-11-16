const genericMethods = {
  initGenericMethods: () => {},

  openModal: (recordId) => {
    const modal = document.getElementById(recordId);
    modal.classList.add("is-active");
  },

  closeModal: (recordId) => {
    const modal = document.getElementById(recordId);
    modal.classList.remove("is-active");
  },
};

const { initGenericMethods, closeModal, openModal } = genericMethods;

document.addEventListener("DOMContentLoaded", initGenericMethods());
