const mockedScafflater = {
  init: jest.fn(),
  runPartial: jest.fn(),
};

module.exports = class Scafflater {
  constructor() {
    return mockedScafflater;
  }
};
