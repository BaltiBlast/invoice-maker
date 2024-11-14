const genericMethods = {
  formatAdress: (adress, city, zipCode) => {
    const formattedAddress = `${adress}, ${city} - ${zipCode}`;
    return formattedAddress;
  },

  allMonths: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
};

module.exports = genericMethods;
