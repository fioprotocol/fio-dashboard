export default {
  token() {
    return function(value) {
      if (value === undefined || value === null || value === '') return;
      if (value.indexOf('Bearer ') !== 0) return 'NOT_VALID_TOKEN';

      const jwtToken = value.replace('Bearer ', '').trim();
      if (!jwtToken) return 'NOT_VALID_TOKEN';
    };
  },
};
