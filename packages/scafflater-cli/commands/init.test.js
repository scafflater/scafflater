jest.mock("scafflater/fs-util");
jest.mock("scafflater/logger");
jest.mock("scafflater/template-manager");
jest.mock("scafflater");

const InitCommand = require("./init");
const fsUtil = require("scafflater/fs-util");
const logger = require("scafflater/logger");
const TemplateManager = require("scafflater/template-manager");
const Scafflater = require("scafflater");

describe("InitCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test("Template is already initialized, should abort", async () => {
    // ARRANGE
    fsUtil.pathExistsSync.mockReturnValue(true);
    const initCommand = new InitCommand([], {});

    // ACT
    await initCommand.run();

    //ASSERT
    expect(logger.info).toHaveBeenCalledWith(
      "The output folder is initialized!"
    );
  });

  test("Template is not initialized, should initialize it", async () => {
    // ARRANGE
    fsUtil.pathExistsSync.mockReturnValue(false);
    const initCommand = new InitCommand(["some/repo"], {});
    new TemplateManager({}).getTemplateFromSource.mockResolvedValue({
      parameters: [],
    });
    const scafflater = new Scafflater({}, {});

    // ACT
    await initCommand.run();

    //ASSERT
    expect(scafflater.init).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith(
      "notice",
      "Template initialized. Fell free to run partials. 🥳"
    );
  });
});