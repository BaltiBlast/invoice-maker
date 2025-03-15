const genericMethods = {
  initGenericMethods: () => {},

  openModal: (recordId) => {
    const modal = document.getElementById(recordId);
    modal.showModal();
  },

  closeModal: (recordId) => {
    const modal = document.getElementById(recordId);
    modal.close();
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
