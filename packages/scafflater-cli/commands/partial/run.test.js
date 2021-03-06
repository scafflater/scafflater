const RunPartialCommand = require("./run");
const {
  Scafflater,
  TemplateManager,
  TemplateCache,
  logger,
  Config,
} = require("@scafflater/scafflater");
const inquirer = require("inquirer");

jest.mock("inquirer");
jest.mock("@scafflater/scafflater");

describe("ListCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("Folder does not have a initialized template, should info.", async () => {
    // ARRANGE
    const templateCache = new TemplateCache();
    const templateManager = new TemplateManager();
    templateManager.templateCache = templateCache;
    const mockedScafflater = {
      templateManager,
      templateCache,
      init: jest.fn(),
    };
    Scafflater.mockImplementation(() => {
      return mockedScafflater;
    });
    Config.fromLocalPath.mockResolvedValue(null);
    const listCommand = new RunPartialCommand([], {});

    // ACT
    await listCommand.run();

    // ASSERT
    expect(logger.info).toHaveBeenCalledWith("No initialized template found!");
  });

  test("Has initializes Templates, but the templates are not in cache. Should get template from source and error if it could not be loaded.", async () => {
    // ARRANGE
    const templateCache = new TemplateCache();
    const templateManager = new TemplateManager();
    templateManager.templateCache = templateCache;
    const mockedScafflater = {
      templateManager,
      templateCache,
      init: jest.fn(),
    };
    Scafflater.mockImplementation(() => {
      return mockedScafflater;
    });

    Config.fromLocalPath.mockResolvedValue({
      config: {
        templates: [
          {
            name: "some-template",
            source: {
              name: "some-source",
              key: "http://some/url/to/template",
            },
          },
          {
            name: "some-other-template",
            source: {
              name: "some-source",
              key: "http://some/url/to/other-template",
            },
          },
        ],
      },
    });
    templateCache.getTemplate.mockResolvedValue(null);
    templateManager.getTemplateFromSource.mockResolvedValueOnce(
      new (jest.requireActual("@scafflater/scafflater").LocalTemplate)(
        "/some/template/path",
        "some-template",
        "The template",
        "0.0.1",
        [
          new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
            "/some/partial/path",
            "the-partial",
            "This is an partial"
          ),
          new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
            "/some/partial/path",
            "the-partial"
          ),
        ]
      )
    );
    const listCommand = new RunPartialCommand(["some-partial"], {});

    // ACT
    await listCommand.run();

    // ASSERT
    expect(templateManager.getTemplateFromSource).toHaveBeenNthCalledWith(
      1,
      "http://some/url/to/template"
    );
    expect(templateManager.getTemplateFromSource).toHaveBeenNthCalledWith(
      2,
      "http://some/url/to/other-template"
    );
    expect(logger.error).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/Could not get template/)
    );
  });

  test("Has initializes Templates, has partials but the partial does not exist. Should Info.", async () => {
    // ARRANGE
    const templateCache = new TemplateCache();
    const templateManager = new TemplateManager();
    templateManager.templateCache = templateCache;
    const mockedScafflater = {
      templateManager,
      templateCache,
      init: jest.fn(),
    };
    Scafflater.mockImplementation(() => {
      return mockedScafflater;
    });

    Config.fromLocalPath.mockResolvedValue({
      config: {
        templates: [
          {
            name: "some-template",
            source: {
              name: "some-source",
              key: "http://some-template/url",
            },
          },
        ],
      },
    });
    templateCache.getTemplate.mockResolvedValueOnce(
      new (jest.requireActual("@scafflater/scafflater").LocalTemplate)(
        "/some/template/path",
        "some-template",
        "The template",
        "0.0.1",
        [
          new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
            "/some/partial/path",
            "the-partial",
            "This is an partial"
          ),
        ]
      )
    );
    templateCache.getTemplate.mockResolvedValueOnce(null);
    const listCommand = new RunPartialCommand(["some-invalid-partial"], {});

    // ACT
    await listCommand.run();

    // ASSERT
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(
        /The partial '.*' is not available on any initialized template/
      )
    );
  });

  test("Has initializes Templates, and the partial is an Argument is available on many templates. Should prompt.", async () => {
    // ARRANGE
    const templateCache = new TemplateCache();
    const templateManager = new TemplateManager();
    templateManager.templateCache = templateCache;
    const mockedScafflater = {
      templateManager,
      templateCache,
      init: jest.fn(),
    };
    Scafflater.mockImplementation(() => {
      return mockedScafflater;
    });

    Config.fromLocalPath.mockResolvedValue({
      config: {
        templates: [
          {
            name: "some-template",
            source: {
              name: "some-source",
              key: "http://some-template/url",
            },
          },
          {
            name: "other-template",
            source: {
              name: "some-source",
              key: "http://some-template/url",
            },
          },
        ],
      },
    });
    templateCache.getTemplate.mockResolvedValueOnce(
      new (jest.requireActual("@scafflater/scafflater").LocalTemplate)(
        "/some/template/path",
        "/some/template/path/.scafflater/scafflater.jsonc",
        "some-template",
        "The template",
        "0.0.1",
        [
          new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
            "/some/partial/path",
            "the-partial",
            "This is an partial"
          ),
        ]
      )
    );
    templateCache.getTemplate.mockResolvedValueOnce(
      new (jest.requireActual("@scafflater/scafflater").LocalTemplate)(
        "/some/other/template/path",
        "/some/other/template/path/.scafflater/scafflater.jsonc",
        "other-template",
        "The other template",
        "0.0.1",
        [
          new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
            "/some/partial/path",
            "the-partial",
            "This is an partial in another template"
          ),
        ]
      )
    );
    inquirer.prompt = jest.fn().mockResolvedValue({
      localPartial: new (jest.requireActual(
        "@scafflater/scafflater"
      ).LocalPartial)(
        "/some/partial/path",
        "the-partial",
        "This is an partial in another template"
      ),
    });
    const listCommand = new RunPartialCommand(["the-partial"], {});
    // ACT;
    await listCommand.run();
    // ASSERT;
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
  });

  test("Has initializes Templates, and the partial is not informed. Should prompt.", async () => {
    // ARRANGE
    const templateCache = new TemplateCache();
    const templateManager = new TemplateManager();
    templateManager.templateCache = templateCache;
    const mockedScafflater = {
      templateManager,
      templateCache,
      init: jest.fn(),
    };
    Scafflater.mockImplementation(() => {
      return mockedScafflater;
    });

    Config.fromLocalPath.mockResolvedValue({
      config: {
        templates: [
          {
            name: "some-template",
            source: {
              name: "some-source",
              key: "http://some-template/url",
            },
          },
          {
            name: "other-template",
            source: {
              name: "some-source",
              key: "http://some-template/url",
            },
          },
        ],
      },
    });
    templateCache.getTemplate.mockResolvedValueOnce(
      new (jest.requireActual("@scafflater/scafflater").LocalTemplate)(
        "/some/template/path",
        "/some/template/path/.scafflater/scafflater.jsonc",
        "some-template",
        "The template",
        "0.0.1",
        [
          new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
            "/some/partial/path",
            "the-partial",
            "This is an partial"
          ),
        ]
      )
    );
    templateCache.getTemplate.mockResolvedValueOnce(
      new (jest.requireActual("@scafflater/scafflater").LocalTemplate)(
        "/some/other/template/path",
        "/some/other/template/path/.scafflater/scafflater.jsonc",
        "other-template",
        "The other template",
        "0.0.1",
        [
          new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
            "/some/partial/path",
            "the-partial",
            "This is an partial in another template"
          ),
        ]
      )
    );
    inquirer.prompt = jest.fn().mockResolvedValue({
      localPartial: new (jest.requireActual(
        "@scafflater/scafflater"
      ).LocalPartial)(
        "/some/partial/path",
        "the-partial",
        "This is an partial in another template"
      ),
    });
    const listCommand = new RunPartialCommand([], {});
    // ACT;
    await listCommand.run();
    // ASSERT;
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
  });

  test("Has initializes Templates, and the template is an Argument. Should prompt only template partials.", async () => {
    // ARRANGE
    const templateCache = new TemplateCache();
    const templateManager = new TemplateManager();
    templateManager.templateCache = templateCache;
    const mockedScafflater = {
      templateManager,
      templateCache,
      init: jest.fn(),
      runPartial: jest.fn(),
    };
    Scafflater.mockImplementation(() => {
      return mockedScafflater;
    });

    Config.fromLocalPath.mockResolvedValue({
      config: {
        templates: [
          {
            name: "some-template",
            source: {
              name: "some-source",
              key: "http://some-template/url",
            },
          },
          {
            name: "other-template",
            source: {
              name: "some-source",
              key: "http://some-template/url",
            },
          },
        ],
      },
    });
    templateCache.getTemplate.mockResolvedValueOnce(
      new (jest.requireActual("@scafflater/scafflater").LocalTemplate)(
        "/some/template/path",
        "some-template",
        "The template",
        "0.0.1",
        [
          new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
            "/some/partial/path",
            "the-partial",
            "This is an partial"
          ),
        ]
      )
    );
    templateCache.getTemplate.mockResolvedValueOnce(
      new (jest.requireActual("@scafflater/scafflater").LocalTemplate)(
        "/some/other/template/path",
        "other-template",
        "The other template",
        "0.0.1",
        [
          new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
            "/some/partial/path",
            "the-partial",
            "This is an partial in another template"
          ),
        ]
      )
    );
    inquirer.prompt = jest.fn().mockResolvedValue({
      availablePartial: {
        templateName: "some-template",
        ...new (jest.requireActual("@scafflater/scafflater").LocalPartial)(
          "/some/partial/path",
          "the-partial",
          "This is an partial in another template"
        ),
      },
    });
    const listCommand = new RunPartialCommand(["-t", "some-template"], {});
    // ACT;
    await listCommand.run();
    // ASSERT;
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(
      "notice",
      expect.stringMatching(/Partial results appended to output!/)
    );
  });
});
