const mockedScafflater = {
  init: jest.fn(),
};

module.exports = class Scafflater {
  constructor() {
    return mockedScafflater;
  }
};
