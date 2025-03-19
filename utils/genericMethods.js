const genericMethods = {
  formatAdress: (adress, city, zipCode) => {
    const formattedAddress = `${adress}, ${city} - ${zipCode}`;
    return formattedAddress;
  },

  months: [
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

  // ------------------------------------------------------------------------------------ //
  // Return a string with the user full name
  userFullName: (userData) => {
    const { user_first_name, user_last_name } = userData;
    return `${user_first_name} ${user_last_name}`;
  },
};

module.exports = genericMethods;
