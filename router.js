'use strict';

const Router = require('koa-router');
const controllers = require('./controllers');

const router = new Router();

// OAUTH

router.get('/compliancy-connector/install', controllers.auth.install);

router.get('/compliancy-connector/auth', controllers.auth.auth);


// PAGES

router.get('/compliancy-connector', controllers.pages.main);

router.get('/compliancy-connector/reports', controllers.pages.reports);

router.get('/compliancy-connector/install-instructions', controllers.pages.instructions);

router.get('/compliancy-connector/settings', controllers.pages.settings);


//ADD SHIP COMPLIANT CREDENTIALS

router.post('/add-credentials', controllers.shop.addSCCredentials);

/*SEND ORDER TO SHIP COMPLIANT -
  We're using a webhook here, so when a customer completes a checkout, we'll send that to ship compliant
*/

router.post('/compliancy-connector/checkouts', controllers.order.sendToSC);

// UWA ZIP CHECK

// app.get('/compliancy-connector/zip-check', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public/zipcheck.html'))
// })
//
// router.post('/compliancy-connector/zip-check', function (req, res) {
//   const zip = req.body.zip
//   rp({
//     url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${config.GM_API_KEY}`,
//     method: 'GET',
//     json: true
//   })
//   .then(function(response) {
//     const state = response.results[0]["address_components"][3]["short_name"]
//     console.log(state);
//     constants.states.indexOf(state) !== -1 ? res.render('zipcheck', { layout: false, data:{state: state, success:true}}) : res.render('zipcheck', { layout: false, data:{state: state, failure:true}})
//   })
// })

//APP ZIP CHECK

router.post('/compliancy-connector/zip-chcek', function (req, res) {
  const total = parseInt(req.body.total);
  //Request bodies for the two api calls
  const supplierReq = {
    Request: {
      Security: auth,
      Address: {
        Zip1: req.body.zip,
      },
      SaleType: 'Offsite'
    }
  };

  const taxReq = {
    Request: {
      Security: auth,
      Address: {
        Zip1: req.body.zip,
      },
      TaxSaleType: 'Offsite'
    }
  };

  res.set({
    'Access-Control-Allow-Origin': '*'
  });

  //check if shipping is available
  shipcompliant.isShippingAvailable(supplierReq)
  .then(function (result) {
    if (!result.IsShippingAvailableResult.IsShippingAvailable) {
      //record failed attempt with time stamp, cart total, and state
      res.json({
        success: false,
        message: 'shipping unavailable to this address'
      });
    }
  });
      //if shipping is available get tax rate based on zip - moving this to its own function and promisifying it. Also need to record successful compliance check with tax rate. Commented out code above for the uwa zip check has api call to google built to convert zip to state.

      //given we are writting to a database and trying to handle an api call here, theres probably a point were the database writes will need to get handled by a queue.
  soap.createClient(constants.urls.taxService, function (err, client) {
    client
         .TaxService
         .TaxServiceSoap12
         .GetSalesTaxRatesByAddress(taxReq, function (err, result) {
           if (err) {
             throw err;
           }
           var tax = result.GetSalesTaxRatesByAddressResult.TaxRates.WineSalesTaxPercent;
           //convert to dollar amount
           var afterTax = (tax * 0.01) * (total * .01);
           const access = app.get('access_token');

           //create product in shopify store
           rp({
             method: 'POST',
             url: 'https://ship-compliant-dev.myshopify.com/admin/products.json',
             headers: {
               'X-Shopify-Access-Token': access,
             },
             json: true,
             body: {
               product: {
                 title: 'Compliancy Fee',
                 body_html: '<strong>Compliancy Fee<\/strong>',
                 vendor: 'NA',
                 product_type: 'FEE',
                 variants: [
                  {
                    option1: 'State Name',
                    price: afterTax,
                    sku: '123'
                  }
                 ]
               }
             }
           }).then(function (result) {
            //send the product id to the front end to add to cart
             console.log(result.product.variants[0].id);
             const variantID = result.product.variants[0].id;
             res.json({
               id: variantID
             });
           });
         });
  });

});

module.exports = router;
