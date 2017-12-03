'use strict';

const onlyIfCacheHasBeenPublished = function () {
  return function (cache, command, mark) {
    if (!cache.state.published) {
      return mark.asRejected('Cache has not been published yet.');
    }

    mark.asReadyForNext();
  };
};

module.exports = onlyIfCacheHasBeenPublished;
