import { connect } from 'react-redux';
import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import * as actions from '../actions';

const getCurrentHash = () => window.location.hash.slice(2);

class Header extends React.Component {
  constructor () {
    super();
    this.state = { currentHash: getCurrentHash() };
  }

  componentDidMount () {
    window.addEventListener('hashchange', this.handleHashChange);
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  handleLogin = () => {
    this.props.login();
  }

  handleLogout = () => {
    this.props.logout();
  }

  checkIfActiveRouteIs = maybeActiveRoute => this.state.currentHash === maybeActiveRoute

  handleHashChange = () => {
    this.setState({ currentHash: getCurrentHash() });
  }

  renderMainNavItems () {
    if (!this.props.isAuthenticated) {
      return null;
    }

    return (
      <Nav key='mainNav'>
        <NavItem eventKey='home' href='#home' active={ this.checkIfActiveRouteIs('home') }>Home</NavItem>
        <NavItem eventKey='own-caches' href='#own-caches' active={ this.checkIfActiveRouteIs('own-caches') }>Own Caches</NavItem>
        <NavItem eventKey='public-caches' href='#public-caches' active={ this.checkIfActiveRouteIs('public-caches') }>Public Caches</NavItem>
      </Nav>
    );
  }

  renderAuthNavItems () {
    return (
      <Nav key='userNav' pullRight={ true }>
        {
          this.props.isAuthenticated ?
            <NavItem eventKey='logout' onClick={ this.handleLogout }>Logout</NavItem> :
            <NavItem eventKey='login' onClick={ this.handleLogin }>Login</NavItem>
        }
      </Nav>
    );
  }

  render () {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='/'>Hide & Find</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          { this.renderMainNavItems() }
          { this.renderAuthNavItems() }
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = function (state) {
  return { isAuthenticated: state.auth.isAuthenticated };
};

export default connect(mapStateToProps, actions)(Header);
