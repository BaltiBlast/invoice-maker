const serviceFront = {
  init: () => {
    getServiceEditButtons();
    formSubmitDeleteService();
  },

  getServiceEditButtons: () => {
    const spanEditButtons = document.querySelectorAll("span[edit-service-id]");
    spanEditButtons.forEach((span) => {
      span.addEventListener("click", () => {
        const serviceId = span.getAttribute("edit-service-id");
        openModal(serviceId);
      });
    });
  },

  formSubmitDeleteService: () => {
    const spanDeleteButtons = document.querySelectorAll("[delete-service-id]");

    spanDeleteButtons.forEach((span) => {
      span.addEventListener("click", () => {
        const form = this.closest("form");
        form.submit();
      });
    });
  },
};

const { getServiceEditButtons, formSubmitDeleteService } = serviceFront;

document.addEventListener("DOMContentLoaded", serviceFront.init());
