import React from 'react';
import fetch from 'isomorphic-fetch';

const Status = props => {
  function getInventory () {
    fetch('/compliance/inventory', {
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }

  function getProducts () {
    fetch('/compliance/products', {
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(data => console.log(data.data));
  }

  function syncCompliance () {
    fetch('/compliance/sync', {
      method: 'POST',
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }
  return (
    <div className="status">
      <h1>Status</h1>
      <button onClick={getInventory}>
        CHECK INVENTORY
      </button>

      <button onClick={getProducts}>
        GET PRODUCTS
      </button>

      <button onClick={syncCompliance}>
        SYNC COMPLIANCE
      </button>
    </div>
  );
};

export default Status;
