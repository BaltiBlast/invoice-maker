const genericMethods = {
  formatAdress: (adress, city, zipCode) => {
    const formattedAddress = `${adress}, ${city} - ${zipCode}`;
    return formattedAddress;
  },
};

module.exports = genericMethods;
