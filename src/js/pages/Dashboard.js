import React from 'react'
import Totals from '../Containers/Totals'
import States from '../Containers/States'
import Graph from '../Containers/Graph'
import Logs from '../Containers/Logs'

const Home = (props) => {
  return (
    <div className='dashboard'>
      <h2>Dashboard</h2>
        <Totals />
        <States />
        <Graph />
        <Logs />
      </div>
  )
}

export default Home
