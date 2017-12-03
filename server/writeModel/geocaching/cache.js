'use strict';

const { only } = require('wolkenkit-command-tools');
const onlyIfCacheHasBeenPublished = require('../../shared/middleware/onlyIfCacheHasBeenPublished');
const onlyIfCacheHasNotBeenPublished = require('../../shared/middleware/onlyIfCacheHasNotBeenPublished');

const initialState = {
  name: '',
  description: '',
  coordinate: { lat: 0, lon: 0 },
  countFavorites: 0,
  published: false,
  countFindings: 0,
  comments: [],
  removed: false,

  isAuthorized: {
    commands: {
      comment: { forAuthenticated: true, forPublic: false },
      favor: { forAuthenticated: true, forPublic: false },
      find: { forAuthenticated: true, forPublic: false },
      hide: { forAuthenticated: false, forPublic: false },
      publish: { forAuthenticated: true, forPublic: false },
      remove: { forAuthenticated: false, forPublic: false }
    },
    events: {
      commented: { forAuthenticated: true, forPublic: false },
      favored: { forAuthenticated: true, forPublic: false },
      found: { forAuthenticated: true, forPublic: false },
      hidden: { forAuthenticated: false, forPublic: false },
      published: { forAuthenticated: true, forPublic: false },
      removed: { forAuthenticated: false, forPublic: false }
    }
  }
};

const commands = {
  hide: [
    only.ifNotExists(),
    only.ifValidatedBy({
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
        coordinate: {
          type: 'object',
          properties: {
            lat: { type: 'number' },
            lon: { type: 'number' }
          }
        }
      },
      required: [ 'name', 'description', 'coordinate' ]
    }),
    (cache, command, mark) => {
      cache.events.publish('hidden', {
        name: command.data.name,
        description: command.data.description,
        coordinate: {
          lat: command.data.coordinate.lat,
          lon: command.data.coordinate.lon
        }
      });
      mark.asDone();
    }
  ],

  publish: [
    only.ifExists(),
    (cache, command, mark) => {
      cache.events.publish('published', {
        name: cache.state.name,
        description: cache.state.description,
        coordinate: {
          lat: cache.state.coordinate.lat,
          lon: cache.state.coordinate.lon
        },
        countFavorites: cache.state.countFavorites,
        countFindings: cache.state.countFindings,
        comments: cache.state.comments,
        removed: cache.state.removed,
        published: true
      });
      mark.asDone();
    }
  ],

  find: [
    only.ifExists(),
    only.ifValidatedBy({
      type: 'object',
      properties: {
        text: { type: 'string', minLength: 1 }
      },
      required: [ 'text' ]
    }),
    onlyIfCacheHasBeenPublished(),
    (cache, command, mark) => {
      cache.events.publish('found', {
        comments: [ ...cache.state.comments, {
          text: command.data.text,
          finder: command.user.id,
          timestamp: command.metadata.timestamp
        }],
        countFindings: cache.state.countFindings + 1
      });
      mark.asDone();
    }
  ],

  comment: [
    only.ifExists(),
    only.ifValidatedBy({
      type: 'object',
      properties: {
        text: { type: 'string', minLength: 1 }
      },
      required: [ 'text' ]
    }),
    onlyIfCacheHasBeenPublished(),
    (cache, command, mark) => {
      cache.events.publish('commented', {
        comments: [ ...cache.state.comments, {
          text: command.data.text,
          author: command.user.id,
          timestamp: command.metadata.timestamp
        }]
      });
      mark.asDone();
    }
  ],

  favor: [
    only.ifExists(),
    onlyIfCacheHasBeenPublished(),
    (cache, command, mark) => {
      cache.events.publish('favored', {
        countFavorites: cache.state.countFavorites + 1
      });
      mark.asDone();
    }
  ],

  remove: [
    only.ifExists(),
    onlyIfCacheHasNotBeenPublished(),
    (cache, command, mark) => {
      cache.events.publish('removed');
      mark.asDone();
    }
  ]
};

const events = {
  hidden (cache, event) {
    cache.setState({
      name: event.data.name,
      description: event.data.description,
      coordinate: event.data.coordinate
    });
  },

  published (cache, event) {
    cache.setState({
      published: event.data.published
    });
  },

  found (cache, event) {
    cache.setState({
      countFindings: event.data.countFindings,
      comments: event.data.comments,
      finder: event.data.finder
    });
  },

  commented (cache, event) {
    cache.setState({
      comments: event.data.comments
    });
  },

  favored (cache, event) {
    cache.setState({
      countFavorites: event.data.countFavorites
    });
  },

  removed (cache) {
    cache.setState({
      removed: true
    });
  }
};

module.exports = {
  initialState,
  commands,
  events
};
