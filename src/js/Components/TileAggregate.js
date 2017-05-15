import React from 'react'
import ApiWrapper from '../Containers/ApiWrapper'

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
  return (
    <div className='tile-aggregate'>
      <h3>{titles.title}</h3>
      <p>{titles.totalCarts}</p>
      <p>{titles.totalRevenue}</p>
    </div>

  )
}


export default ApiWrapper(TileAggregate)
