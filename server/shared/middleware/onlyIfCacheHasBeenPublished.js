'use strict';

const onlyIfCacheHasBeenPublished = function () {
  return function (cache, command) {
    if (!cache.state.published) {
      return command.reject('Cache has not been published yet.');
    }
  };
};

module.exports = onlyIfCacheHasBeenPublished;
