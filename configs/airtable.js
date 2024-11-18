// ===== IMPORTS ===== //
const Airtable = require("airtable");
require("dotenv").config();

// ===== ENVIRONMENT VARIABLES ===== //
const { AIRTABLE_BASE_ID, AIRTABLE_API_KEY } = process.env;

const apiKey = AIRTABLE_API_KEY;
const baseId = AIRTABLE_BASE_ID;

const base = new Airtable({ apiKey }).base(baseId);
const db = base;

module.exports = db;
