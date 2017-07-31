import React, { Component } from 'react';
import { Card, Pagination } from '@shopify/polaris';

class TileDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      pages: 0,
      currentPage: 0,
      rowsPerPage: 5,
      rows: []
    };

    this.setPages = this.setPages.bind(this);
    this.getNext = this.getNext.bind(this);
    this.getPrevious = this.getPrevious.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.getRows = this.getRows.bind(this);
  }

  componentDidMount () {
    this.setPages();
    this.getRows();
  }

  setPages () {
    const pages = Math.ceil(this.props.data.length / this.state.rowsPerPage);
    this.setState({ pages });
  }

  getNext () {
    const { currentPage, pages } = this.state;
    if (currentPage - 1 < pages) {
      this.setState({
        currentPage: this.state.currentPage + 1
      });
    }
  }

  getPrevious () {
    const { currentPage, pages } = this.state;
    if (currentPage > 0) {
      this.setState({
        currentPage: currentPage - 1
      });
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      this.state.pages !== prevState.pages ||
      this.state.currentPage !== prevState.currentPage
    ) {
      this.getRows();
    }
  }

  getIndex () {
    const { currentPage, rowsPerPage } = this.state;
    console.log('CURRENT PAGE', currentPage);
    const firstIndex = currentPage * rowsPerPage;
    const secondIndex = firstIndex + rowsPerPage;
    return [firstIndex, secondIndex];
  }

  getRows () {
    const indecies = this.getIndex();
    const start = indecies[0];
    const end = indecies[1];
    console.log('DATA', this.props.data);
    let page =
      this.state.pages > 1
        ? this.props.data.slice(start, end)
        : this.props.data;
    console.log('PAGE', page);
    const rows = page.map((row, i) => {
      return (
        <tr>
          <td>
            {row.location_state}
          </td>
          <td className="align-right">
            {parseInt(row.compliant_count) || parseInt(row.noncompliant_count)}
          </td>
          <td className="align-right">
            ${row.compliant_cart_total || row.noncompliant_cart_total}
          </td>
        </tr>
      );
    });

    this.setState({
      rows
    });
  }

  render () {
    const compliant = {
      title: 'Compliant Zip Checks',
      colTwo: 'Zip checks',
      colThree: 'Total revenue'
    };

    const nonCompliant = {
      title: 'Non-Compliant Zip Checks',
      colTwo: 'Zip checks',
      colThree: 'Total dollar value'
    };

    const titles = this.props.success ? compliant : nonCompliant;
    return (
      <Card
        sectioned
        title={this.props.success ? compliant.title : nonCompliant.title}
      >
        <table>
          <thead>
            <tr>
              <th>state</th>
              <th>
                {titles.colTwo}
              </th>
              <th>
                {titles.colThree}
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.rows}
          </tbody>
        </table>

        <Pagination
          hasPrevious={this.state.currentPage > 0}
          onPrevious={this.getPrevious}
          hasNext={this.state.pages > this.state.currentPage}
          onNext={this.getNext}
          plain={false}
        />
      </Card>
    );
  }
}

export default TileDetail;
