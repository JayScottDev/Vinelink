import React, { Component } from 'react';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchShopInfo } from '../actions/';
import Nav from '../site/Nav';
import Dashboard from './Dashboard';
import Install from './Install';
import Settings from './Settings';
import Export from './Export';
import Profile from './Profile';

class Main extends Component {
  componentDidMount () {
    this.props.fetchShopInfo('/shop/shopinfo');
  }
  render () {
    const { data } = this.props.shop;
    return (
      <div>
        <h1>
          {data && data.name}&apos;s Link
        </h1>
        <Nav />
        <Switch>
          <Route path="/settings" component={Settings} />
          <Route path="/export" component={Export} />
          <Route path="/install" component={Install} />
          <Route component={Dashboard} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    shop: state.shop
  };
};

const mapDispatchToProps = dispatch => {
  return { fetchShopInfo: bindActionCreators(fetchShopInfo, dispatch) };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
