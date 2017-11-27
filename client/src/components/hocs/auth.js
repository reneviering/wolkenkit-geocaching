import { connect } from 'react-redux';
import React, { Component } from 'react';

/**
 * Higher order component to apply Authentication to existing components.
 * It checks if the app is authenticated. If not it redirects to the home route
 */
export const authenticated = function (ComposedComponent, hashToRedirect) {
  class Auth extends Component {

    componentDidMount () {
      if (!this.props.isAuthenticated) {
        window.location.hash = hashToRedirect;
      }
    }

    componentWillReceiveProps (nextProps) {
      if (!this.isAuthenticated !== nextProps.isAuthenticated && nextProps.isAuthenticated === false) {
        window.location.hash = hashToRedirect;
      }
    }

    render () {
      return <ComposedComponent { ...this.props } />;
    }
	}

  const mapStateToProps = function (state) {
    return { isAuthenticated: state.auth.isAuthenticated };
  };

  return connect(mapStateToProps)(Auth);
};
