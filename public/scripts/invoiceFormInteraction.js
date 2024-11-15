const clients = window.clientsData;
const selectClient = document.getElementById("selectClient");
const selectMonth = document.getElementById("selectMonth");
const invoiceForm = document.getElementById("invoiceForm");
const submitButton = document.getElementById("submitButton");
const prestationPrice = document.getElementById("prestation-price");
const totalPrice = document.getElementById("totalPrice");
const sendButton = document.getElementById("send-button");
const dateElement = document.getElementById("facture-month");
const yearElement = document.getElementById("facture-year");
const invoiceToSend = document.getElementById("invoiceToSend");
const invoiceNumber = document.getElementById("invoice-number");
const inputInvoiceNumber = document.getElementById("inputInvoiceNumber");

const invoiceFormInteraction = {
  init: () => {
    setPrice();
    setClientData();
    setInvoiceDate();
    setInvoiceNumber();
    isClientSelected();
    isMonthSelected();
    isInvoiceNumberEmpty();
    showInvoicePreview();
    closeModal();
  },

  setClientData: () => {
    selectClient.addEventListener("change", function (element) {
      const selectedClient = clients.find((client) => client.client_email == element.target.value);
      if (selectedClient) {
        document.getElementById("client-name").textContent = selectedClient.client_name;
        document.getElementById("client-adress").textContent = selectedClient.client_adress;
        document.getElementById("client-email").textContent = selectedClient.client_email;

        const formatedAdress = `${selectedClient.client_city_name} - ${selectedClient.client_zip_code}`;
        document.getElementById("client-city").textContent = formatedAdress;
      } else {
        document.getElementById("client-name").textContent = "";
        document.getElementById("client-adress").textContent = "";
        document.getElementById("client-city").textContent = "";
        document.getElementById("client-email").textContent = "";
      }
    });
  },

  setInvoiceDate: () => {
    selectMonth.addEventListener("change", function (element) {
      const selectedMonth = element.target.value;
      if (selectedMonth) {
        yearElement.textContent = new Date().getFullYear();
        dateElement.textContent = selectedMonth;
      } else {
        document.getElementById("facture-month").textContent = "Mois";
        document.getElementById("facture-year").textContent = "Année";
      }
    });
  },

  setInvoiceNumber: () => {
    inputInvoiceNumber.addEventListener("change", function (element) {
      const invoiceNumberValue = element.target.value;
      if (invoiceNumberValue) {
        invoiceNumber.textContent = invoiceNumberValue;
      } else {
        invoiceNumber.textContent = "Numéro de facture";
      }
    });
  },

  setPrice: () => {
    submitButton.addEventListener("click", function () {
      prestationPrice.innerHTML = "";
      const servicesData = [];

      const rows = document.querySelectorAll("table tbody tr");

      rows.forEach((row) => {
        const serviceId = row.getAttribute("data-service-id");

        if (serviceId) {
          const quantityInput = row.querySelector('input[name="services[' + serviceId + '][quantity]"]');
          const nameInput = row.querySelector('input[name="services[' + serviceId + '][name]"]');
          const priceInput = row.querySelector('input[name="services[' + serviceId + '][price]"]');

          if (quantityInput.value > 0) {
            const serviceData = {
              serviceId: serviceId,
              name: nameInput ? nameInput.value : "",
              price: priceInput ? priceInput.value : "",
              quantity: quantityInput ? quantityInput.value : 0,
            };
            servicesData.push(serviceData);
          }
        }
      });

      servicesData.forEach((element) => {
        const tr = document.createElement("tr");

        const serviceName = document.createElement("td");
        serviceName.textContent = element.name;
        tr.appendChild(serviceName);

        const servicePrice = document.createElement("td");
        servicePrice.textContent = element.price;
        tr.appendChild(servicePrice);

        const serviceQuantity = document.createElement("td");
        serviceQuantity.textContent = element.quantity;
        tr.appendChild(serviceQuantity);

        const serviceTotal = document.createElement("td");
        serviceTotal.textContent = element.price * element.quantity;
        tr.appendChild(serviceTotal);

        prestationPrice.appendChild(tr);
      });

      const totalPriceServices = servicesData.reduce((sum, element) => {
        return sum + parseFloat(element.price) * parseInt(element.quantity);
      }, 0);

      totalPrice.textContent = totalPriceServices;
    });
  },

  checkFormValidity: () => {
    const isClientSelected = selectClient.value !== "";
    const isMonthSelected = selectMonth.value !== "";
    const isInvoiceNumberEmpty = inputInvoiceNumber.value !== "";
    submitButton.disabled = !(isClientSelected && isMonthSelected && isInvoiceNumberEmpty);
  },

  isInvoiceNumberEmpty: () => {
    inputInvoiceNumber.addEventListener("input", checkFormValidity);
  },

  isClientSelected: () => {
    selectClient.addEventListener("change", checkFormValidity);
  },

  isMonthSelected: () => {
    selectMonth.addEventListener("change", checkFormValidity);
  },

  generatePDF: async () => {
    const invoiceToSend = document.getElementById("invoiceToSend");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    return new Promise((resolve) => {
      doc.html(invoiceToSend, {
        callback: function (doc) {
          const pdfBase64 = doc.output("datauristring");
          resolve(pdfBase64);
        },
        x: 10,
        y: 10,
        width: 180,
        windowWidth: 800,
      });
    });
  },

  sendEmail: () => {
    invoiceForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const pdfInvoice = await generatePDF();

      const formData = new FormData(invoiceForm);
      const formValues = Object.fromEntries(formData.entries());

      const { clientEmail, userLastName, userFirstName, userEmail } = formValues;
      const formatedDate = `${dateElement.textContent} ${yearElement.textContent}`;

      const fullNames = `${userFirstName} ${userLastName}`;

      const dataToSend = {
        pdfInvoice: pdfInvoice,
        clientEmail: clientEmail,
        userName: fullNames,
        userEmail: userEmail,
        date: formatedDate,
      };

      sendButton.classList.add("is-loading");

      fetch("/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.reload) {
            sendButton.classList.remove("is-loading");
            location.reload();
          }
        });
    });
  },

  showInvoicePreview: () => {
    document.getElementById("invoiceModal").classList.add("is-active");
  },

  closeModal: () => {
    document.getElementById("invoiceModal").classList.remove("is-active");
  },
};

const {
  setPrice,
  setClientData,
  setInvoiceDate,
  setInvoiceNumber,
  checkFormValidity,
  showInvoicePreview,
  closeModal,
  isMonthSelected,
  isClientSelected,
  isInvoiceNumberEmpty,
  generatePDF,
} = invoiceFormInteraction;

document.addEventListener("DOMContentLoaded", invoiceFormInteraction.init());
