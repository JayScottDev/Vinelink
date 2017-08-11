import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { fetchLogsLog } from '../actions/';
import { Layout, Card, Badge, Pagination } from '@shopify/polaris';

import logs from '../../data/logs';

class Logs extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentPage: 0,
      pages: 0,
      rows: []
    };

    this.formatDate = this.formatDate.bind(this);
    this.formatCurrancy = this.formatCurrancy.bind(this);
    this.setPages = this.setPages.bind(this);
    this.getPrevious = this.getPrevious.bind(this);
    this.getNext = this.getNext.bind(this);
    this.getIndices = this.getIndices.bind(this);
    this.getRows = this.getRows.bind(this);
  }

  componentDidMount () {
    this.setPages();
    this.getRows();
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      this.state.pages !== prevState.pages ||
      this.state.currentPage !== prevState.currentPage
    ) {
      this.getRows();
    }
  }

  setPages () {
    const { data } = logs;
    const pages = Math.ceil(data.length / this.props.rowsPerPage);
    this.setState({ pages });
  }

  getPrevious () {
    const { currentPage, pages } = this.state;
    if (currentPage > 0) {
      this.setState({
        currentPage: currentPage - 1
      });
    }
  }

  getNext () {
    const { currentPage, pages } = this.state;
    if (currentPage - 1 < pages) {
      this.setState({
        currentPage: this.state.currentPage + 1
      });
    }
  }

  getIndices () {
    const { currentPage } = this.state;
    const { rowsPerPage } = this.props;
    const firstIndex = currentPage * rowsPerPage;
    const secondIndex = firstIndex + rowsPerPage;
    return [firstIndex, secondIndex];
  }

  getRows () {
    const indecies = this.getIndices();
    const start = indecies[0];
    const end = indecies[1];
    const { data } = logs;
    let page = this.state.pages > 1 ? data.slice(start, end) : data;
    const rows = page.map((row, i) => {
      const status = row.compliant ? 'compliant' : 'denied';
      return (
        <tr key={i}>
          <td>
            <Badge status={status === 'compliant' ? 'success' : 'warning'}>
              {status}
            </Badge>
          </td>
          <td>
            {row.location_state}
          </td>
          <td>
            ${this.formatCurrancy(row.cart_total)}
          </td>
          <td>
            ${isNaN(row.tax_value) ? 'n/a' : row.tax_value.toFixed(2)}
          </td>
          <td>
            {this.formatDate(row.checked_at)}
          </td>
        </tr>
      );
    });

    this.setState({ rows });
  }

  formatDate (date) {
    return moment(date).format('MMM DD [@] h:mm a');
  }

  formatCurrancy (amount) {
    return amount / 100;
  }

  render () {
    const { rows } = this.state;
    return (
      <Layout.Section>
        <Card sectioned title="Zip check line items">
          {rows &&
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>State</th>
                  <th>Total Cart Value</th>
                  <th>Tax Addition</th>
                  <th>Date & Time Stamp</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>}

          <Pagination
            hasPrevious
            onPrevious={this.getPrevious}
            hasNext
            onNext={this.getNext}
            plain={false}
          />
        </Card>
      </Layout.Section>
    );
  }
}

function mapStateToProps (state) {
  return { logs: state.log };
}

function mapDispatchToProps (dispatch) {
  return { fetchLogsLog: bindActionCreators(fetchLogsLog, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Logs);
