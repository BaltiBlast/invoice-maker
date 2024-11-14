const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("./utils/middleware");

// CONTROLLERS
// -- auth
const authControllers = require("./controllers/auth/authControllers");
const { getSignin, postSignin, getDisconnect } = authControllers;

// -- user
const userControllers = require("./controllers/user/profileControllers");
const { getProfile, postProfile } = userControllers;

// -- invoices
const invoiceControllers = require("./controllers/invoices/invoiceControllers");
const { getInvoice, postInvoice } = invoiceControllers;

// -- contacts
const clientsController = require("./controllers/clients/clientsController");
const { getClients, postClients, postClientsDelete } = clientsController;

// -- general
const generalControllers = require("./controllers/general/generalControllers");
const { get404, postSendEmail } = generalControllers;

// -- services
const servicesControllers = require("./controllers/services/servicesControllers");
const { getServices, postServices, postDeleteServices } = servicesControllers;

// AUTH ROUTES
router.get("/signin", getSignin);
router.post("/signin", postSignin);
router.get("/signout", ensureAuthenticated, getDisconnect);

// PROFILE ROUTES
router.get("/profile", ensureAuthenticated, getProfile);
router.post("/profile-update", ensureAuthenticated, postProfile);

// INVOICES ROUTES
router.get("/invoice", ensureAuthenticated, getInvoice);
router.post("/invoice", ensureAuthenticated, postInvoice);

// CONTACTS ROUTES
router.get("/clients", ensureAuthenticated, getClients);
router.post("/clients", ensureAuthenticated, postClients);
router.post("/client-delete", ensureAuthenticated, postClientsDelete);

// SERVICES ROUTES
router.get("/services", ensureAuthenticated, getServices);
router.post("/services", ensureAuthenticated, postServices);
router.post("/service-delete", ensureAuthenticated, postDeleteServices);

// GENERAL ROUTES
router.post("/send-email", ensureAuthenticated, postSendEmail);
router.use(get404);

module.exports = router;
