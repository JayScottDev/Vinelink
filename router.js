'use strict';

const Router = require('koa-router');
const controllers = require('./controllers');
const path = require('path');

const router = new Router();

// OAUTH

router.get('/app/install', controllers.auth.install);
router.get('/app/auth', controllers.auth.auth);

// PAGES
router.get('/app/login', controllers.pages.login);
router.get('/app/signup', controllers.pages.signup);
router.get('/app', controllers.pages.main);
// LOGIN AND Signup

router.post('/app/login', controllers.auth.login);
router.post('/app/signup', controllers.auth.signup);

//ADD SHIP COMPLIANT CREDENTIALS

// router.get('/test/shop', controllers.shop.test);

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
router.get('/compliance/tasks/sync', controllers.compliance.syncAllCompliances);
router.put('/compliance', controllers.compliance.updateShopCompliance);

// ORDERS

router.get('/orders/list', controllers.order.listOrders);
router.post('/orders/create', controllers.order.createOrder); // Shopify Webhook endpoint
router.post('/orders/cancel', controllers.order.cancelOrder); // Shopify Webhook endpoint
router.get('/orders/sync', controllers.order.syncOrders); // Cron task

// INVENTORY

router.get('/compliance/inventory', controllers.pages.inventory);
router.get('/compliance/products', controllers.pages.products);

/*SEND ORDER TO SHIP COMPLIANT -
  We're using a webhook here, so when a customer completes a checkout, we'll send that to ship compliant
*/

// router.post('/compliancy-connector/checkouts', controllers.order.sendToSC);

module.exports = router;
