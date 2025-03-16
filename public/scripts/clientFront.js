const clientFront = {
  init: () => {
    getAllEditButtons();
    formSubmitDeleteClient();
  },

  getAllEditButtons: () => {
    const spanEditButtons = document.querySelectorAll("span[edit-client-id]");

    spanEditButtons.forEach((span) => {
      span.addEventListener("click", function () {
        const clientId = span.getAttribute("edit-client-id");
        openModal(clientId);
      });
    });
  },

  formSubmitDeleteClient: () => {
    const spanDeleteButton = document.getElementById("span-delete-button-client");
    const deleteClientForm = document.getElementById("form-delete-client");
    spanDeleteButton.addEventListener("click", function () {
      deleteClientForm.submit();
    });
  },
};

const { getAllEditButtons, formSubmitDeleteClient } = clientFront;

document.addEventListener("DOMContentLoaded", clientFront.init());
