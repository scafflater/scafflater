const mockedScafflater = {
  init: jest.fn(),
  runPartial: jest.fn(),
  templateManager: {
    getTemplateFromSource: jest.fn(),
    listPartials: jest.fn(),
    templateCache: {
      getTemplatePath: jest.fn(),
    },
  },
};

module.exports = class Scafflater {
  constructor() {
    return mockedScafflater;
  }
};
