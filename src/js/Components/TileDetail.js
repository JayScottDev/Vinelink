import React from 'react'

const TileDetail = (props) => {
  const compliant = {
    title: 'Compliant Zip',
    colTwo: 'compliant zip checks',
    colThree: 'Total Revenue',
  }

  const nonCompliant = {
    title: 'Denided carts & projected revenue',
    colTwo: 'non-compliant zip checks',
    colThree: 'Total dollar value',
  }

  const titles = props.success ? compliant : nonCompliant
  const rows = props.data && props.data.map((row, i) => {
    console.log('row', row);
    return (
      <tr>
        <td>{row.location_state}</td>
        <td>{row.compliant_count || row.noncompliant_count}</td>
        <td>${row.compliant_cart_total || row.noncompliant_cart_total}</td>
      </tr>
    )
  })
  console.log('DETAIL PROPS', rows);
  return (
    <div className='tile-aggregate'>
      <h3>{titles.title}</h3>
      <table>
        <thead>
          <tr>
            <th>state</th>
            <th>{titles.colTwo}</th>
            <th>{titles.colThree}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      <p>{titles.totalCarts}</p>
      <p>{titles.totalRevenue}</p>
    </div>

  )
}


export default TileDetail
