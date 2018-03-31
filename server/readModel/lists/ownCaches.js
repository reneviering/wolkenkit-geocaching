'use strict';

const fields = {
  name: { initialState: '' },
  description: { initialState: '' },
  coordinate: { initialState: { lat: 0, lon: 0 }},
  published: { initialState: false },
  countFavorites: { initialState: 0 },
  countFindings: { initialState: 0 },
  comments: { initialState: []}
};

const when = {
  'geocaching.cache.hidden' (ownCaches, event) {
    ownCaches.add({
      name: event.data.name,
      description: event.data.description,
      coordinate: event.data.coordinate
    });
  },

  'geocaching.cache.published' (ownCaches, event) {
    ownCaches.update({
      where: {
        id: event.aggregate.id
      },
      set: {
        published: event.data.published
      }
    });
  },

  'geocaching.cache.found' (ownCaches, event) {
    ownCaches.update({
      where: {
        id: event.aggregate.id
      },
      set: {
        countFindings: event.data.countFindings,
        comments: event.data.comments
      }
    });
  },

  'geocaching.cache.commented' (ownCaches, event) {
    ownCaches.update({
      where: {
        id: event.aggregate.id
      },
      set: {
        comments: event.data.comments
      }
    });
  },

  'geocaching.cache.favored' (ownCaches, event) {
    ownCaches.update({
      where: {
        id: event.aggregate.id
      },
      set: {
        countFavorites: event.data.countFavorites
      }
    });
  },

  'geocaching.cache.removed' (ownCaches, event) {
    ownCaches.remove({
      where: {
        id: event.aggregate.id
      }
    });
  }
};

module.exports = { fields, when };
