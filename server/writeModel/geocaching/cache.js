'use strict';

const initialState = {
	name: '',
	description: '',
	coordinate: {lat: 0, lon: 0},
	countFavorites: 0,
	published: false,
	countFindings: 0,
	comments: [],
	removed: false,

	isAuthorized: {
		commands: {
			publish: { forAuthenticated: true, forPublic: false },
			favor: { forAuthenticated: true, forPublic: false },
			find: { forAuthenticated: true, forPublic: false },
			comment: { forAuthenticated: true, forPublic: false }
		},
		events: {
			published: { forAuthenticated: true, forPublic: false },
			favored: { forAuthenticated: true, forPublic: false },
			found: { forAuthenticated: true, forPublic: false },
			commented: { forAuthenticated: true, forPublic: false }
		}
	}
};

const commands = {
	hide(cache, command, mark) {
		cache.events.publish('hidden', {
			name: command.data.name,
			description: command.data.description,
			coordinate: {
				lat: command.data.coordinate.lat,
				lon: command.data.coordinate.lon
			}
		});
		mark.asDone();
	},

	publish(cache, command, mark) {
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
			published: true,
		});
		mark.asDone();
	},

	favor(cache, command, mark) {
		cache.events.publish('favored', {
			countFavorites: cache.state.countFavorites + 1
		});
		mark.asDone();
	},

	find(cache, command, mark) {
		cache.events.publish('found', {
			comments: [...cache.state.comments, {
				text: command.data.text,
				finder: command.user.id,
				timestamp: command.metadata.timestamp
			}],
			countFindings: cache.state.countFindings + 1
		});
		mark.asDone();
	},

	comment(cache, command, mark) {
		cache.events.publish('commented', {
			comments: [...cache.state.comments, {
				text: command.data.text,
				author: command.user,
				timestamp: command.metadata.timestamp
			}],
		});
		mark.asDone();
	},

	remove(cache, command, mark) {
		if(cache.state.published) {
			 return mark.asRejected('An already published cache can not be removed');
		}

		cache.events.publish('removed');
		mark.asDone();
	}
};

const events = {
	hidden(cache, event) {
		cache.setState({
			name: event.data.name,
			description: event.data.description,
			coordinate: event.data.coordinate
		})
	},

	favored(cache, event) {
		cache.setState({
			countFavorites: event.data.countFavorites
		})
	},

	published(cache, event) {
		cache.setState({
			published: event.data.published
		})
	},

	found(cache, event) {
		cache.setState({
			countFindings: event.data.countFindings,
			comments: event.data.comments,
			finder: event.data.finder
		});
	},

	commented(cache, event) {
		cache.setState({
			comments: event.data.comments
		});
	},

	removed(cache, event) {
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
