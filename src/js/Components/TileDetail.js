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

  const titles = props.success ? compliant : nonComplian
  const rows = props.data && props.data.map((row, i) => {
    <tr>
      <td>{row.state}</td>
    </tr>
  })

  console.log('data', props.data);
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
          {}
        </tbody>
      </table>
      <p>{titles.totalCarts}</p>
      <p>{titles.totalRevenue}</p>
    </div>

  )
}


export default TileDetial
