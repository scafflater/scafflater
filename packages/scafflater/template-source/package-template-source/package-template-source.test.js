/* eslint-disable no-undef */
const PackageTemplateSource = require("./package-template-source");
const util = require("util");
const fsUtil = require("../../fs-util");
const { LocalTemplate } = require("../../scafflater-config/local-template");
const { ScafflaterFileNotFoundError } = require("../../errors");

jest.mock("../../fs-util");

describe("getTemplate", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  jest.setTimeout(15000);

  test("get template", async () => {
    const packageTemplateSource = new PackageTemplateSource();
    const virtualFolder = "/some/virtual/folder";
    jest.spyOn(fsUtil, "getTempFolderSync").mockReturnValue("some/temp/folder");
    jest.spyOn(fsUtil, "getTempFolder").mockReturnValue("some/temp/folder");
    jest
      .spyOn(LocalTemplate, "loadFromPath")
      .mockResolvedValue([
        new LocalTemplate(
          "/some/virtual/folder",
          "template-name",
          "the template",
          "0.0.0",
          [],
          {},
          [{ name: "some-parameter" }]
        ),
      ]);
    jest.spyOn(util, "promisify").mockReturnValue(() => {
      return { stdout: "username", stderr: "" };
    });
    await expect(
      packageTemplateSource.getTemplate("template-fastify", virtualFolder)
    ).rejects.toBeInstanceOf(ScafflaterFileNotFoundError);
  });
});
