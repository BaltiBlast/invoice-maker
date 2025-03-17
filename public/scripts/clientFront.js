const clientFront = {
  init: () => {
    getClientEditButtons();
    formSubmitDeleteClient();
  },

  getClientEditButtons: () => {
    const spanEditButtons = document.querySelectorAll("span[edit-client-id]");
    spanEditButtons.forEach((span) => {
      span.addEventListener("click", () => {
        const clientId = span.getAttribute("edit-client-id");
        openModal(clientId);
      });
    });
  },

  formSubmitDeleteClient: () => {
    const spanDeleteButtons = document.querySelectorAll("[delete-client-id]");
    spanDeleteButtons.forEach((span) => {
      span.addEventListener("click", () => {
        const form = this.closest("form");
        form.submit();
      });
    });
  },
};

const { getClientEditButtons, formSubmitDeleteClient } = clientFront;

document.addEventListener("DOMContentLoaded", clientFront.init());
