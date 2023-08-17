export default {
  validateStatus: (status: number) => {
    return status >= 200 && status < 300;
  },
};
