import adapter from './adapter';

export default {
  adapter,
  validateStatus: (status: number) => {
    return status >= 200 && status < 300;
  },
};
