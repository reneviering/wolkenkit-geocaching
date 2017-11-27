import { Button } from 'react-bootstrap';
import { getLatLonForAddress } from '../shared/google-geocoding-api';
import React from 'react';

export default class AddressHelper extends React.Component {
  constructor () {
    super();
    this.state = { currentAddress: '' };
  }

  handleAddressSearch = () => {
    getLatLonForAddress(this.state.currentAddress).then(response => {
      this.props.onAddressChanged({ lat: response.lat, lon: response.lng });
    });
  }

  handleAddressChange = event => {
    this.setState({ currentAddress: event.target.value });
  }

  render () {
    return (
      <div className='form-group'>
        <div className='input-group'>
          <input
            className='form-control'
            type='text' id='addressSearch' onChange={ this.handleAddressChange } placeholder='type an address to geocode to lat/lon'
          />
          <span className='input-group-btn'>
            <Button onClick={ this.handleAddressSearch }>Geocode address</Button>
          </span>
        </div>
      </div>
    );
  }
}
