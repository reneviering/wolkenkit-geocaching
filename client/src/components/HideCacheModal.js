import AddressHelper from './AddressHelper';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { change, Field, reduxForm } from 'redux-form';
import { renderField, renderTextArea } from '../shared/redux-form-render-helper';

const required = function (value) {
  return value ? undefined : 'Required';
};

const number = function (value) {
  return value && isNaN(Number(value)) ? 'Must be a number' : undefined;
};

const HideCacheModal = props => {
  const { handleSubmit, dispatch, reset } = props;

  const onAddressChanged = ({ lat, lon }) => {
    dispatch(change('hidecache', 'lat', lat));
    dispatch(change('hidecache', 'lon', lon));
  };

  return (
    <Modal show={ props.show } onHide={ props.onHide } onEnter={ reset }>
      <form onSubmit={ handleSubmit }>
        <Modal.Header closeButton={ true }>
          <Modal.Title>Hide a new cache</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Field id='name' name='name' component={ renderField } type='text' label='cache name' validate={ required } />
          <Field id='description' name='description' component={ renderTextArea } label='description' validate={ required } />

          <AddressHelper onAddressChanged={ onAddressChanged } />

          <Field id='lat' name='lat' component={ renderField } type='text' label='Latitude' validate={ [ required, number ] } />
          <Field id='lon' name='lon' component={ renderField } type='text' label='Longitude' validate={ [ required, number ] } />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ props.onHide }>Cancel</Button>
          <Button bsStyle='primary' type='submit'>Hide cache</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default () => reduxForm({
  form: 'hidecache',
  enableReinitialize: true,
  destroyOnUnmount: false
})(HideCacheModal);
