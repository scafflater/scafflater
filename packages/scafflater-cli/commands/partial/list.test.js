jest.mock("scafflater/fs-util");
jest.mock("scafflater/logger");
jest.mock("scafflater/template-manager");
jest.mock("scafflater");

const ListCommand = require("./list");
const fsUtil = require("scafflater/fs-util");
const logger = require("scafflater/logger");
const TemplateManager = require("scafflater/template-manager");

describe("ListCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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
    new TemplateManager({}).templateCache.getTemplatePath.mockResolvedValueOnce(
      "some/path"
    );
    new TemplateManager({}).listPartials.mockResolvedValueOnce([]);
    const listCommand = new ListCommand([], {});

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
