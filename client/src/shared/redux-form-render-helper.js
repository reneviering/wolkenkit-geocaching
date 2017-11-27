import { FormGroup } from 'react-bootstrap';
import React from 'react';

export const renderField = function ({ input, label, type, id, meta: { touched, error, warning }}) {
  return (
    <FormGroup validationState={ touched && error ? 'error' : null }>
      <label className='control-label' htmlFor={ id }>{label}</label>
      <div>
        <input className='form-control' { ...input } placeholder={ label } type={ type } id={ id } />
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </FormGroup>);
};

export const renderTextArea = function ({ input, label, type, id, meta: { touched, error, warning }}) {
  return (
    <FormGroup validationState={ touched && error ? 'error' : null }>
      <label className='control-label' htmlFor={ id }>{label}</label>
      <div>
        <textarea className='form-control' { ...input } placeholder={ label } type={ type } id={ id } />
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </FormGroup>
  );
};
