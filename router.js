'use strict';

const Router = require('koa-router');
const controllers = require('./controllers');
const path = require('path');

const router = new Router();

// OAUTH

router.get('/compliancy-connector/install', controllers.auth.install);
router.get('/compliancy-connector/auth', controllers.auth.auth);

// PAGES
router.get('/compliancy-connector/login', controllers.pages.login);
router.get('/compliancy-connector/signup', controllers.pages.signup);
router.get('/compliancy-connector', controllers.pages.main);
// LOGIN AND Signup

router.post('/compliancy-connector/login', controllers.auth.login);
router.post('/compliancy-connector/signup', controllers.auth.signup);

//ADD SHIP COMPLIANT CREDENTIALS

router.get('/test/shop', controllers.shop.test);

// ORDER COMPLIANCE AND LOGS

router.post('/compliance/check', controllers.comp_logs.checkOrderCompliance);
router.get('/compliance/logs', controllers.comp_logs.getComplianceLogs);
router.get(
  '/compliance/logs/report/state',
  controllers.comp_logs.logsReportByState
);
router.get(
  '/compliance/logs/report/date',
  controllers.comp_logs.logsReportByDate
);
router.get(
  '/compliance/logs/report/total',
  controllers.comp_logs.logsAggregateTotal
);
router.post('/compliance/logs/export', controllers.comp_logs.generateLogExport);

// SHOP-STATE COMPLIANCE

router.get('/compliance/list', controllers.compliance.listShopCompliance);
router.post('/compliance/sync', controllers.compliance.syncShopCompliance);
router.put('/compliance', controllers.compliance.updateShopCompliance);


// ORDERS

router.get('/orders/list', controllers.order.listOrders);
router.post('/orders/create', controllers.order.createOrder); // Shopify Webhook endpoint
router.get('/orders/sync', controllers.order.syncOrders); // Cron task

// INVENTORY

router.get('/compliance/inventory', controllers.pages.inventory);
router.get('/compliance/products', controllers.pages.products);


/*SEND ORDER TO SHIP COMPLIANT -
  We're using a webhook here, so when a customer completes a checkout, we'll send that to ship compliant
*/

// router.post('/compliancy-connector/checkouts', controllers.order.sendToSC);

//APP ZIP CHECK
const constants = require('./constants');

module.exports = router;
