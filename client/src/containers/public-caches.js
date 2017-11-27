import { connect } from 'react-redux';
import React from 'react';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import * as actions from '../actions';

const MapMarker = function ({ marker }) {
  const handleClick = () => {
    window.location.hash = `public-caches/${marker.cacheId}`;
  };

  return <Marker { ...marker } onClick={ handleClick } />;
};

const configureGoogleMapsContainer = function ({ markers }) {
  const defaultCenter = { lat: 51.30482, lng: 9.444709999999999 };

  return (
    <GoogleMap defaultZoom={ 8 } defaultCenter={ defaultCenter }>
      { markers.map((marker, index) => <MapMarker key={ index } marker={ marker } />) }
    </GoogleMap>
  );
};

const GoogleMapsContainer = withScriptjs(withGoogleMap(configureGoogleMapsContainer));

class PublicCaches extends React.Component {

  componentDidMount () {
    this.props.requestPublicCaches();
    this.props.observeCachePublishing().then(cancelObserving => {
      this.stopObservingCachePublishing = cancelObserving;
    });
  }

  componentWillUnmount () {
    if (this.stopObservingCachePublishing) {
      this.stopObservingCachePublishing();
    }
  }

  render () {
    /*  eslint-disable no-process-env */
    const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    /* eslint-enable no-process-env */

    const markers = this.props.caches
    .filter(cache => cache && cache.coordinate)
    .map(cache => ({
      position: { lat: cache.coordinate.lat, lng: cache.coordinate.lon },
      cacheId: cache.id,
      key: cache.name,
      defaultAnimation: 2
    }));

    return (
      <div>
        <h1>Public Cache-List <span className='badge'>{this.props.caches.length}</span></h1>

        <GoogleMapsContainer
          googleMapURL={ googleMapsUrl }
          loadingElement={ <div style={{ height: `100%` }} /> }
          containerElement={ <div style={{ height: `600px` }} /> }
          mapElement={ <div style={{ height: `600px` }} /> }
          markers={ markers }
        />
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return { caches: state.publicCaches.caches };
};

export default connect(mapStateToProps, actions)(PublicCaches);
