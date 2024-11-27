const clients = window.clientsData;
const selectClient = document.getElementById("selectClient");
const selectMonth = document.getElementById("selectMonth");
const invoiceForm = document.getElementById("invoiceForm");
const submitButton = document.getElementById("submitButton");
const prestationPrice = document.getElementById("prestation-price");
const totalPrice = document.getElementById("totalPrice");
const sendButton = document.getElementById("send-button");
const invoiceMonth = document.getElementById("facture-month");
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
        document.getElementById("client-recordId").value = selectedClient.recordId;
        document.getElementById("actual-price").value = selectedClient.client_total_payment;
        document.getElementById("client-id").value = selectedClient.client_id;

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
        invoiceMonth.textContent = selectedMonth;
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

      const { clientEmail, userLastName, userFirstName, userEmail, recordId, actuelPrice, clientId } = formValues;
      console.log("FORM VALUES", formValues);

      const newTotalPrice = (parseFloat(actuelPrice) + parseFloat(totalPrice.textContent)).toString();

      const formatedDate = `${invoiceMonth.textContent} ${yearElement.textContent}`;

      const fullNames = `${userFirstName} ${userLastName}`;

      const invoiceDbData = {
        invoiceMonth: invoiceMonth.textContent,
        invoiceYear: yearElement.textContent,
        invoiceIncome: totalPrice.textContent,
        invoiceClient: clientEmail,
        invoiceClientId: clientId,
      };

      const data = {
        pdfInvoice: pdfInvoice,
        clientEmail: clientEmail,
        newTotalPrice: newTotalPrice.toString(),
        recordId: recordId,
        userName: fullNames,
        userEmail: userEmail,
        date: formatedDate,
        invoiceDbData,
      };

      sendButton.classList.add("is-loading");

      fetch("/invoice-send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const base64Data = pdfInvoice.split(",")[1];
            const binaryData = atob(base64Data);
            const arrayBuffer = new Uint8Array(binaryData.length);

            for (let i = 0; i < binaryData.length; i++) {
              arrayBuffer[i] = binaryData.charCodeAt(i);
            }

            const blob = new Blob([arrayBuffer], { type: "application/pdf" });

            const clientName = document.getElementById("client-name").textContent;

            // Créer un lien de téléchargement
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `facture_${clientName}_${formatedDate}_n°${invoiceNumber.textContent}.pdf`;

            // Simuler un clic pour télécharger
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }

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
