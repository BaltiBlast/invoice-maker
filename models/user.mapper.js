const CoreMapper = require("./core.mapper");

class UserMapper extends CoreMapper {
  tableName = "user";

  async getUser() {
    const records = await this.db(this.tableName).select().all();

    const { id: recordId, fields: user } = records[0];
    return { ...user, recordId };
  }

  async updateUser(user) {
    const { lastName, firstName, email, adress, city, zipCode, legalForm, siret, recordId } = user;

    await this.db(this.tableName).update(recordId, {
      user_first_name: firstName,
      user_last_name: lastName,
      legal_form: legalForm,
      user_adress: adress,
      user_city_name: city,
      user_zip_code: zipCode,
      user_siret: siret,
      user_email: email,
    });
  }
}

module.exports = UserMapper;
