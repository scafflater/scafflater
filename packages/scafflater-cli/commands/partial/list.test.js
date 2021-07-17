jest.mock("scafflater/fs-util");
jest.mock("scafflater/logger");
jest.mock("scafflater/template-manager");
jest.mock("scafflater");

const ListCommand = require("./list");
const fsUtil = require("scafflater/fs-util");
const logger = require("scafflater/logger");
const TemplateManager = require("scafflater/template-manager");
const Scafflater = require("scafflater");

describe("ListCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test("Template is not initialized, should log error", async () => {
    // ARRANGE
    fsUtil.pathExistsSync.mockReturnValue(false);
    const listCommand = new ListCommand([], {});

    // ACT
    await listCommand.run();

    //ASSERT
    expect(logger.error).toHaveBeenCalledWith(
      "The template is not initialized!"
    );
  });

  test("Template could not be located, should log error", async () => {
    // ARRANGE
    fsUtil.pathExistsSync.mockReturnValue(true);
    fsUtil.readJSON.mockResolvedValue({
      template: {
        name: "some-template",
        version: "some-version",
        source: {
          key: "some-gh-repo",
        },
      },
    });
    const listCommand = new ListCommand([], {});
    new TemplateManager({}).templateCache.getTemplatePath.mockResolvedValue(
      null
    );

    // ACT
    await listCommand.run();

    //ASSERT
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/Cannot get template/)
    );
  });

  test("Template is not cached, should get it from source", async () => {
    // ARRANGE
    fsUtil.pathExistsSync.mockReturnValue(true);
    fsUtil.readJSON.mockResolvedValue({
      template: {
        name: "some-template",
        version: "some-version",
        source: {
          key: "some-gh-repo",
        },
      },
    });
    const listCommand = new ListCommand([], {});
    new TemplateManager({}).templateCache.getTemplatePath.mockResolvedValueOnce(
      null
    );
    new TemplateManager({}).templateCache.getTemplatePath.mockResolvedValueOnce(
      "some/path"
    );

    // ACT
    await listCommand.run();

    //ASSERT
    expect(new TemplateManager({}).getTemplateFromSource).toHaveBeenCalled();
  });

  test("Template does not have partials, should error it", async () => {
    // ARRANGE
    fsUtil.pathExistsSync.mockReturnValue(true);
    fsUtil.readJSON.mockResolvedValue({
      template: {
        name: "some-template",
        version: "some-version",
        source: {
          key: "some-gh-repo",
        },
      },
    });
    const listCommand = new ListCommand([], {});
    new TemplateManager({}).templateCache.getTemplatePath.mockResolvedValueOnce(
      "some/path"
    );
    new TemplateManager({}).listPartials.mockResolvedValueOnce([]);

    // ACT
    await listCommand.run();

    //ASSERT
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/No partials available on template/)
    );
  });

  test("Template is available and has partials, should print it", async () => {
    // ARRANGE
    fsUtil.pathExistsSync.mockReturnValue(true);
    fsUtil.readJSON.mockResolvedValue({
      template: {
        name: "some-template",
        version: "some-version",
        source: {
          key: "some-gh-repo",
        },
      },
    });
    const listCommand = new ListCommand([], {});
    new TemplateManager({}).templateCache.getTemplatePath.mockResolvedValueOnce(
      "some/path"
    );
    new TemplateManager({}).listPartials.mockResolvedValueOnce([
      {
        config: {
          type: "partial",
          name: "partial-name",
          description: "Partial Description",
        },
      },
      {
        config: {
          type: "partial2",
          name: "partial2-name",
        },
      },
    ]);

    // ACT
    await listCommand.run();

    //ASSERT
    expect(logger.write).toHaveBeenCalledWith(
      expect.stringMatching(/PARTIALS/)
    );
    expect(logger.write).toHaveBeenCalledWith(
      expect.stringMatching(/  partial-name\tPartial Description/)
    );
    expect(logger.write).toHaveBeenCalledWith(
      expect.stringMatching(/  partial2-name\t/)
    );
  });
});
