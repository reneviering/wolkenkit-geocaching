'use strict';

const onlyIfCacheHasNotBeenPublished = function () {
  return function (cache, command) {
    if (cache.state.published) {
      return command.reject('Cache has already been published.');
    }
  };
};

module.exports = onlyIfCacheHasNotBeenPublished;
