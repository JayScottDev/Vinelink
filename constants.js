const req = {
  Request: {
    Security: {
      PartnerKey: partnerKey,
      Password: password,
      Username: username,
    },
    AddressOption: {
      RejectIfAddessSuggested: false,
      IgnoreStreetLevelErrors: true,
    },
    PersistOption: null,
    CommitOption: 'AllShipments',
    SalesOrder: {
      BillTo: {
        City: result.billing_address.city,
        Company: result.billing_address.company,
        Country: result.billing_address.country_code,
        DateOfBirth: '', //Unix Timestamp,
        Email: '',
        FirstName: result.billing_address.first_name,
        LastName: result.billing_address.last_name,
        Phone: result.billing_address.phone,
        State: result.billing_address.province_code,
        Street1: result.billing_address.address1,
        Street2: result.billing_address.address2,
        Zip1: result.billing_address.zip,
      },
      CustomerKey: result.customer.id,
      FulfillmentType: '', //club or daily
      OrderType: 'Internet',
      PurchaseDate: result.created_at, //Unix time stamp
      SalesOrderKey: result.order_number,
      Shipments: {
        Shipment: {
          LicenseRelationship: 'SupplierToConsumer',
          ShipDate: '', //Unix Timestamp, this field is required, but unknown
          shipmentItems: items,
          ShipmentKey: result.shipping_lines.id,
          ShipmentStatus: 'PaymentAccepted',
          ShippingService: result.shipping_lines.title, //need to get shipping service codes
          ShipTo: {
            City: result.billing_address.city,
            FirstName: result.billing_address.first_name,
            LastName: result.billing_address.last_name,
            Phone: result.billing_address.phone,
            State: result.billing_address.province_code,
            Street1: result.billing_address.address1,
            Street2: result.billing_address.address2,
            Zip1: result.billing_address.zip,
          }
        }
      }
    }
  }
}

const items = {
  ShipmentItem: {
    ProductKey: result.line_items.sku,
    ProductQuantity: result.line_items.quantity,
  },
}

module.exports = {
  states: ['AK', 'CA', 'CO', 'DC', 'FL', 'HI', 'IA', 'ID', 'IN', 'KS', 'LA', 'MA', 'MD', 'ME', 'MN', 'MO', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'OR', 'PA', 'SC', 'TN', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
}
