'use strict';

const onlyIfCacheHasNotBeenPublished = function () {
  return function (cache, command, mark) {
    if (cache.state.published) {
      return mark.asRejected('Cache has already been published.');
    }

    mark.asReadyForNext();
  };
};

module.exports = onlyIfCacheHasNotBeenPublished;
