'use strict';

const fields = {
  name: { initialState: '' },
  description: { initialState: '' },
  coordinate: { initialState: { lat: 0, lon: 0 }},
  countFavorites: { initialState: 0 },
  countFindings: { initialState: 0 },
  comments: { initialState: []}
};

const when = {
  'geocaching.cache.published' (publicCaches, event) {
    publicCaches.add({
      name: event.data.name,
      description: event.data.description,
      coordinate: event.data.coordinate
    });
  },

  'geocaching.cache.found' (publicCaches, event) {
    publicCaches.update({
      where: { id: event.aggregate.id },
      set: {
        countFindings: event.data.countFindings,
        comments: event.data.comments
      }
    });
  },

  'geocaching.cache.commented' (publicCaches, event) {
    publicCaches.update({
      where: { id: event.aggregate.id },
      set: {
        comments: event.data.comments
      }
    });
  },

  'geocaching.cache.favored' (publicCaches, event) {
    publicCaches.update({
      where: { id: event.aggregate.id },
      set: {
        countFavorites: event.data.countFavorites
      }
    });
  }
};

module.exports = { fields, when };
