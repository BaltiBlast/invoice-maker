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
const clientsController = require("./controllers/clients/clientsController");
const { getClients, postClients } = clientsController;

// -- general
const generalControllers = require("./controllers/general/generalControllers");
const { get404 } = generalControllers;

// -- services
const servicesControllers = require("./controllers/services/servicesControllers");
const { getServices } = servicesControllers;

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
router.get("/clients", getClients);
router.post("/clients", postClients);

// CONTACTS ROUTES
router.get("/services", getServices);
// router.post("/contacts", postContacts);

// 404
router.use(get404);

module.exports = router;
