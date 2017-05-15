import React from 'react'

const TileAggregate = (props) => {
  const compliant = {
    title: 'Successful carts & revenue',
    totalCarts: 'Total compliant carts',
    totalRevenue: 'Total Revenue',
  }

  const nonCompliant = {
    title: 'Denided carts & projected revenue',
    totalCarts: 'Total non-compliant carts',
    totalRevenue: 'Total potential revenue',
  }

  const titles = props.success ? compliant : nonCompliant

  console.log('data', props.data);
  const { compliant_count, compliant_cart_total, noncompliant_count, noncompliant_cart_total } = props.data
  return (
    <div className='tile-aggregate'>
    {props.success &&
      <div className='tile-aggregate__content'>
        <h3>{titles.title}</h3>
        <p>{titles.totalCarts}: {compliant_count}</p>
        <p>{titles.totalRevenue}: ${compliant_cart_total}</p>
      </div>
    }
    {!props.success &&
      <div className='tile-aggregate__content'>
        <h3>{titles.title}</h3>
        <p>{titles.totalCarts}: {noncompliant_count}</p>
        <p>{titles.totalRevenue}: ${noncompliant_cart_total}</p>
      </div>
    }
    </div>
  )
}


export default TileAggregate
