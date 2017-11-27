/* eslint-disable no-process-env */
export const getLatLonForAddress = function (addressString) {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressString}&key=${process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY}`)
  .then(response => response.json())
  .then(response => {
    if (response.results.length && response.results[0].geometry && response.results[0].geometry.location) {
      return response.results[0].geometry.location;
    }

    return { lat: -1, lng: -1 };
  });
};
