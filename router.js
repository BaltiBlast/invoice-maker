const express = require("express");
const router = express.Router();

// CONTROLLERS
// -- auth
const authControllers = require("./controllers/auth/authControllers");
const { getSignin, postSignin, getDisconnect } = authControllers;

// -- user
const userControllers = require("./controllers/user/userControllers");
const { getUser, postUser } = userControllers;

// -- invoices
const invoiceControllers = require("./controllers/invoices/invoiceControllers");
const { getInvoice, postInvoice } = invoiceControllers;

// -- contacts
const contactsController = require("./controllers/contacts/contactsController");
const { getContacts, postContacts } = contactsController;

// -- general
const generalControllers = require("./controllers/general/generalControllers");
const { get404 } = generalControllers;

// AUTH ROUTES
router.get("/signin", getSignin);
router.post("/signin", postSignin);
router.get("/disconnect", getDisconnect);

// USER ROUTES
router.get("/user", getUser);
router.post("/user-update", postUser);

// INVOICES ROUTES
router.get("/invoice", getInvoice);
router.post("/invoice", postInvoice);

// CONTACTS ROUTES
router.get("/contacts", getContacts);
router.post("/contacts", postContacts);

// 404
router.use(get404);

module.exports = router;
