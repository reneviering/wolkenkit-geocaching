'use strict';

const fields = {
	name: { initialState: '' },
	description: {initialState: ''},
	coordinate: {initialState: {lat: 0, lon: 0}},
	published: {initialState: false},
	countFavorites: {initialState: 0},
	countFindings: {initialState: 0},
	comments: {initialState: []}
};

const when = {
	'geocaching.cache.hidden': (caches, event, mark) => {
		caches.add({
			name: event.data.name,
			description: event.data.description,
			coordinate: event.data.coordinate
		});
		mark.asDone();
	},

	'geocaching.cache.published': (caches, event, mark) => {
		caches.update({
			where: {id: event.aggregate.id},
			set: {
				published: event.data.published
			}
		});
		mark.asDone();
	},

	'geocaching.cache.favored': (caches, event, mark) => {
		caches.update({
			where: {id: event.aggregate.id},
			set: {
				countFavorites: event.data.countFavorites
			}
		});
		mark.asDone();
	},

	'geocaching.cache.found': (caches, event, mark) => {
		caches.update({
			where: {id: event.aggregate.id},
			set: {
				countFindings: event.data.countFindings,
				comments: event.data.comments
			}
		});
		mark.asDone();
	},

	'geocaching.cache.commented': (caches, event, mark) => {
		caches.update({
			where: {id: event.aggregate.id},
			set: {
				comments: event.data.comments
			}
		});
		mark.asDone();
	},

	'geocaching.cache.removed': (caches, event, mark) => {
		caches.remove({
			where: {id: event.aggregate.id}
		});
		mark.asDone();
	}
};

module.exports = { fields, when };
