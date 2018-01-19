import React from 'react'

const TileDetail = (props) => {
  const compliant = {
    title: 'Compliant Zip Checks',
    colTwo: 'compliant zip checks',
    colThree: 'Total Revenue',
  }

  const nonCompliant = {
    title: 'Non-Compliant Zip Checks',
    colTwo: 'non-compliant zip checks',
    colThree: 'Total dollar value',
  }

  const titles = props.success ? compliant : nonCompliant
  const rows = props.data && props.data.map((row, i) => {
    return (
      <tr>
        <td>{row.location_state}</td>
        <td>{parseInt(row.compliant_count) || parseInt(row.noncompliant_count)}</td>
        <td>${row.compliant_cart_total || row.noncompliant_cart_total}</td>
      </tr>
    )
  })
  return (
    <article className='tile-aggregate'>
      <div className='card'>
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
    </article>

  )
}


export default TileDetail
