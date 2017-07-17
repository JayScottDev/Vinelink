import React from 'react';
import { Card } from '@shopify/polaris';

const TileAggregate = props => {
  const compliant = {
    title: 'Successful carts & revenue',
    totalCarts: 'Total compliant carts',
    totalRevenue: 'Total Revenue'
  };

  const nonCompliant = {
    title: 'Denided carts & projected revenue',
    totalCarts: 'Total non-compliant carts',
    totalRevenue: 'Total potential revenue'
  };

  const titles = props.success ? compliant : nonCompliant;

  const {
    compliant_count,
    compliant_cart_total,
    noncompliant_count,
    noncompliant_cart_total
  } = props.data ? props.data : {};
  return (
    <Card
      sectioned
      title={props.success ? compliant.title : nonCompliant.title}
    >
      {props.success &&
        <div className="card tile-aggregate__compliant">
          <div className="tile-aggregate__row">
            <p>
              {titles.totalCarts}:
            </p>
            <p className="tile-aggregate__digits">
              {compliant_count}
            </p>
          </div>
          <div className="tile-aggregate__row">
            <p>
              {titles.totalRevenue}:
            </p>
            <p className="tile-aggregate__digits">
              ${compliant_cart_total}
            </p>
          </div>
        </div>}
      {!props.success &&
        <div className="card tile-aggregate__noncompliant">
          <div className="tile-aggregate__row">
            <p>
              {titles.totalCarts}:
            </p>
            <p className="tile-aggregate__digits">
              {noncompliant_count}
            </p>
          </div>
          <div className="tile-aggregate__row">
            <p>
              {titles.totalRevenue}:
            </p>
            <p className="tile-aggregate__digits">
              ${noncompliant_cart_total}
            </p>
          </div>
        </div>}
    </Card>
  );
};

export default TileAggregate;
