import classNames from 'classnames';
import { connect } from 'react-redux';
import initHideCacheModal from '../components/HideCacheModal';
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
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

  handleNavigateToDetails = cacheId => event => {
    if (event.target.classList.contains('btn')) {
      return;
    }

    window.location.hash = `public-caches/${cacheId}`;
  }

  handleOpenHideCacheModal = () => {
    HideCacheModal = initHideCacheModal();
    this.setState({ showHideCacheModal: true });
  }

  handleCloseHideCacheModal = () => {
    this.setState({ showHideCacheModal: false });
  }

  renderCacheActions (cache) {
    if (cache.published) {
      return null;
    }

    return (
      <ButtonGroup className='pull-right'>
        <Button bsSize='small' bsStyle='default' onClick={ () => this.handlePublishCache(cache.id) }>Publish</Button>
        <Button bsSize='small' onClick={ () => this.handleRemoveCache(cache.id) }>Delete</Button>
      </ButtonGroup>
    );
  }

  renderCacheList () {
    return this.props.caches.map((cache, index) => {
      const listItemClass = classNames('list-group-item', 'cache-list-item', {
        'cache-list-item--not-published': !cache.published
      });

      return (
        <li onClick={ this.handleNavigateToDetails(cache.id) } className={ listItemClass } key={ cache.id || index }>
          <h4>
            {cache.name}
          </h4>
          <div className='row'>
            <div className='col-md-10'><p>{cache.description}</p></div>
            <div className='col-md-2 cache-list-item__actions'>
              {this.renderCacheActions(cache)}
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <span className='cache-list-item__infoItem'><span className='label label-default'>{cache.countFindings || 0} found</span></span>
              <span className='cache-list-item__infoItem'><span className='label label-danger'>{cache.countFavorites || 0} <span className='glyphicon glyphicon-heart' /></span></span>
            </div>
          </div>
        </li>
      );
    });
  }

  render () {
    return (
      <div>
        <h3>
          <span>My Caches</span>
          <button onClick={ this.handleOpenHideCacheModal } className='btn btn-primary pull-right'>Hide new cache</button>
        </h3>

        <hr />

        <div className='list-group cache-list'>
          {this.renderCacheList()}
        </div>

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
