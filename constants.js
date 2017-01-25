const req = {
  CheckComplianceOfSalesOrderWithAddressValidation: {
    Request: {
      Security: {
        PartnerKey: '',
        Password: '',
        Username: '',
      }
      AddressOption: {
        RejectIfAddessSuggested: false,
        IgnoreStreetLevelErrors: true,
      },
      IncludeSalesTaxRates: false,
      PersistOption: null,
      CommitOption: 'AllShipments',
      SalesOrder: {
        BillTo: {
          City: '',
          Company: '',
          Country: 'US',
          DateOfBirth: '' //Unix Timestamp,
          Email: '',
          FirstName: '',
          LastName: '',
          Phone: '',
          State: '',
          Street1: '',
          Street2: '',
          Zip1: '',
        },
        CustomerKey: '',
        FulfillmentType: '', //club or daily
        OrderType: 'Internet',
        Payments: {
          Amount: '',
          SubType: '', //AmericanExpress, DinersClub, DiscoveryCard, JCB, MasterCard, Other, and VISA
          Type: '', //Check, CreditCard, GiftCard, GiftCertificate, Invoice, MoneyOrder, Other, StoreAccount, and TravelersCheck
        },
        PurchaseDate: '', //Unix time stamp
        SalesOrderKey: '',
        Shipments: {
          Shipment: {
            LicenseRelationship: 'SupplierToConsumer',
            ShipDate: '', //Unix Timestamp
            ShipmentKey: '',
            ShippingService: '', //need to get shipping service codes
            ShipTo: {
              City: '',
              FirstName: '',
              LastName: '',
              Phone: '',
              State: '',
              Street1: '',
              Street2: '',
              Zip1: '',
            }
          }
        }
      }
    }
  }
}

const states = ['AK', 'CA', 'CO', 'DC', 'FL', 'HI', 'IA', 'ID', 'IN', 'KS', 'LA', 'MA', 'MD', 'ME', 'MN', 'MO', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'OR', 'SC', 'TN', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
