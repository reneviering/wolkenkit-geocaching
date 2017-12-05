import { Button } from 'react-bootstrap';
import { CommentList } from '../components';
import { connect } from 'react-redux';
import React from 'react';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import * as actions from '../actions';

const configureGoogleMapsContainer = function ({ marker }) {
  return (
    <GoogleMap defaultZoom={ 13 } defaultCenter={ marker.position }>
      <Marker { ...marker } />
    </GoogleMap>
  );
};

let GoogleMapsContainer;

class CacheDetails extends React.PureComponent {

  constructor () {
    super();
    this.state = { newComment: '', isFounderComment: false, errorMessage: '' };
  }

  componentDidMount () {
    this.props.requestCacheDetails(this.props.match.params.cacheId);
    this.props.observeComments().then(cancelObserving => {
      this.cancelObservingComments = cancelObserving;
    });

    // Configure GoogleMapsContainer on every load of cache-details
    GoogleMapsContainer = withScriptjs(withGoogleMap(configureGoogleMapsContainer));
  }

  componentWillUnmount () {
    if (this.cancelObservingComments) {
      this.cancelObservingComments();
    }
  }

  handleComment = () => {
    this.props.commentCache(this.props.cache.id, this.state.newComment);

    this.setState({ newComment: '' });
  }

  handleFind = () => {
    this.props.findCache(this.props.cache.id, 'I found the cache.')
    .catch(errorMessage => {
      this.setState({ errorMessage });
    });
  }

  handleCommentChanged = event => {
    this.setState({ newComment: event.target.value, errorMessage: '' });
  }

  renderMap () {
    if (!this.props.cache.coordinate) {
      return null;
    }
    const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`; // eslint-disable-line

    return (
      <GoogleMapsContainer
        googleMapURL={ googleMapsUrl }
        loadingElement={ <div /> }
        containerElement={ <div style={{ height: `350px`, width: '100%' }} /> }
        mapElement={ <div style={{ height: `100%`, width: '100%' }} /> }
        marker={{
          position: { lat: this.props.cache.coordinate.lat, lng: this.props.cache.coordinate.lon },
          cacheId: this.props.cache.id,
          key: this.props.cache.name,
          defaultAnimation: 2
        }}
      />
    );
  }

  render () {
    return (
      <div>
        <h3>
          <a href='/#/own-caches'>My Caches</a> / <span>{this.props.cache.name}</span>
        </h3>

        <hr />

        <div className='row'>
          <div className='col-md-4'>
            <p>{this.props.cache.description}</p>
            <p>
              <strong>Latitude</strong> {this.props.cache.coordinate && this.props.cache.coordinate.lat}<br />
              <strong>Longitude</strong> {this.props.cache.coordinate && this.props.cache.coordinate.lon}
            </p>
            <p>
              <span className='cache-list-item__infoItem'><span className='label label-default'>{this.props.cache.countFindings || 0} found</span></span>
              <span className='cache-list-item__infoItem'><span className='label label-danger'>{this.props.cache.countFavorites || 0} <span className='glyphicon glyphicon-heart' /></span></span>
            </p>
            <hr />

            <div className='form-group'>
              <Button bsSize='large' bsStyle='success' onClick={ this.handleFind }>I found it!</Button>
            </div>

          </div>
          <div className='col-md-8'>
            {this.renderMap()}
          </div>
        </div>

        <h3>Comments</h3>

        { this.props.cache.comments && <CommentList comments={ this.props.cache.comments } />}

        {this.state.errorMessage && <div className='alert alert-danger' role='alert'>{this.state.errorMessage}</div>}

        <div className='form-group'>
          <textarea className='form-control' placeholder='Add a few lines to comment the cache' onChange={ this.handleCommentChanged } value={ this.state.newComment } />
        </div>

        <div className='form-group text-right'>
          <Button bsStyle='primary' onClick={ this.handleComment }>Comment</Button>
        </div>

      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return { cache: state.cacheDetails.cache };
};

export default connect(mapStateToProps, actions)(CacheDetails);
