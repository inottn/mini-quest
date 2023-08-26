import adapter from './adapter';

export default {
  adapter,
  headers: { 'content-type': 'application/json' },
  validateStatus: (status: number) => {
    return status >= 200 && status < 300;
  },
};
