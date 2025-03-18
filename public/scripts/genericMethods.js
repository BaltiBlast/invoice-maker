const genericMethods = {
  initGenericMethods: () => {},

  openModal: (id) => {
    const modal = document.getElementById(id);
    modal.showModal();
  },

  closeModal: (id) => {
    const modal = document.getElementById(id);
    modal.close();
  },

  showInvoicePreview: (id) => {
    const detailsRow = document.getElementById(id);
    if (detailsRow) {
      detailsRow.classList.toggle("is-hidden");
    }
  },
};

const { initGenericMethods, closeModal, openModal, toggleDetails } = genericMethods;

document.addEventListener("DOMContentLoaded", initGenericMethods());
