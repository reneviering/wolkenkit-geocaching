import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import { connect } from 'react-redux';
import initHideCacheModal from '../components/HideCacheModal';
import React from 'react';
import * as actions from '../actions';
import './own-caches.css';

let HideCacheModal = initHideCacheModal();

class OwnCaches extends React.Component {
  constructor () {
    super();
    this.state = { showHideCacheModal: false };
  }

  componentDidMount () {
    this.props.requestAndObserveOwnCaches().then(cancelObserving => {
      this.stopObservingOwnCaches = cancelObserving;
    });
  }

  componentWillUnmount () {
    if (this.stopObservingOwnCaches) {
      this.stopObservingOwnCaches();
    }
  }

  handleHideCache = ({ name, description, lat, lon }) => {
    this.props.hideCache(name, description, { lat: parseFloat(lat), lon: parseFloat(lon) });
    this.handleCloseHideCacheModal();
  }

  handlePublishCache = cacheId => {
    this.props.publishCache(cacheId);
  }

  handleRemoveCache = cacheId => {
    this.props.removeCache(cacheId);
  }

  handleNavigateToDetails = cacheId => () => {
    window.location.hash = `public-caches/${cacheId}`;
  }

  handleOpenHideCacheModal = () => {
    HideCacheModal = initHideCacheModal();
    this.setState({ showHideCacheModal: true });
  }

  handleCloseHideCacheModal = () => {
    this.setState({ showHideCacheModal: false });
  }

  renderCacheList () {
    return this.props.caches.map((cache, index) => {
      const listItemClass = classNames('list-group-item', 'cache-list-item', {
        'cache-list-item--not-published': !cache.published
      });

      return (
        <li className={ listItemClass } key={ cache.id || index }>
          <button className='btn btn-default pull-right' onClick={ this.handleNavigateToDetails(cache.id) }>show cache details</button>
          <h3>{cache.name}</h3>
          <p>{cache.description}</p>
          <p>
            <span className='cache-list-item__infoItem'>findings: <span className='badge'>{cache.countFindings || 0}</span></span>
            <span className='cache-list-item__infoItem'>favorites: <span className='badge'>{cache.countFavorites || 0}</span></span>
          </p>

          {!cache.published && <Button bsStyle='primary' onClick={ () => this.handlePublishCache(cache.id) }>publish cache</Button>}
          {!cache.published && <Button bsStyle='danger' onClick={ () => this.handleRemoveCache(cache.id) }>delete cache</Button>}
        </li>
      );
    });
  }

  render () {
    return (
      <div>
        <h1>
          <span>My caches</span>
          <button onClick={ this.handleOpenHideCacheModal } className='btn btn-primary pull-right'>Hide new cache</button>
        </h1>

        <hr />

        <ul className='list-group cache-list'>
          {this.renderCacheList()}
        </ul>

        <HideCacheModal
          show={ this.state.showHideCacheModal }
          onHide={ this.handleCloseHideCacheModal }
          onSubmit={ this.handleHideCache }
        />

      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return { caches: state.ownCaches.caches };
};

export default connect(mapStateToProps, actions)(OwnCaches);
