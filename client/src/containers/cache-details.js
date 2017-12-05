import { Button } from 'react-bootstrap';
import { CommentList } from '../components';
import { connect } from 'react-redux';
import React from 'react';
import * as actions from '../actions';

class CacheDetails extends React.Component {

  constructor () {
    super();
    this.state = { newComment: '', isFounderComment: false, errorMessage: '' };
  }

  componentDidMount () {
    this.props.requestCacheDetails(this.props.match.params.cacheId);
    this.props.observeComments().then(cancelObserving => {
      this.cancelObservingComments = cancelObserving;
    });
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
            <Button bsSize='large' bsStyle='success' onClick={ this.handleFind }>I found it!</Button>
          </div>
          <div className='col-md-8'>
            <img src='https://place-hold.it/750x360&text=MapContainer' alt='Map Placeholder' />
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
