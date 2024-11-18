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

  toggleDetails: (id) => {
    const detailsRow = document.getElementById(id);
    if (detailsRow) {
      detailsRow.classList.toggle("is-hidden");
    }
  },
};

const { initGenericMethods, closeModal, openModal, toggleDetails } = genericMethods;

document.addEventListener("DOMContentLoaded", initGenericMethods());
