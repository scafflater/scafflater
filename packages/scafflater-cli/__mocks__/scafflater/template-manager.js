const mockedTemplateManager = {
  templateCache: {
    getTemplatePath: jest.fn(),
  },
  getTemplateFromSource: jest.fn(),
  listPartials: jest.fn(),
};

module.exports = class TemplateManager {
  constructor() {
    return mockedTemplateManager;
  }
};
