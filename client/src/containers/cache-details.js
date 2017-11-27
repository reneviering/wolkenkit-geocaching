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
    if (this.state.isFounderComment) {
      this.props.findCache(this.props.cache.id, this.state.newComment)
      .catch(errorMessage => {
        this.setState({ errorMessage });
      });
    } else {
      this.props.commentCache(this.props.cache.id, this.state.newComment);
    }

    this.setState({ newComment: '' });
  }

  handleCommentChanged = event => {
    this.setState({ newComment: event.target.value, errorMessage: '' });
  }

  render () {
    const commentButtonLabel = this.state.isFounderComment ? 'Find' : 'Comment';

    return (
      <div>
        <h1>{this.props.cache.name} <span className='badge'>{this.props.cache.countFindings}</span></h1>
        <p>{this.props.cache.description}</p>

        <hr />

        {this.state.errorMessage && <div className='alert alert-danger' role='alert'>{this.state.errorMessage}</div>}

        <div className='form-group'>
          <div className='checkbox'>
            <label>
              <input type='checkbox' checked={ this.state.isFounderComment } onChange={ () => this.setState({ isFounderComment: !this.state.isFounderComment }) } /> I found it
            </label>
          </div>

          <textarea className='form-control' placeholder='Add a few lines to comment the cache' onChange={ this.handleCommentChanged } value={ this.state.newComment } />
        </div>

        <div className='form-group text-right'>
          <Button bsStyle='primary' onClick={ this.handleComment }>{commentButtonLabel}</Button>
        </div>

        { this.props.cache.comments && <CommentList comments={ this.props.cache.comments } />}

      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return { cache: state.cacheDetails.cache };
};

export default connect(mapStateToProps, actions)(CacheDetails);
