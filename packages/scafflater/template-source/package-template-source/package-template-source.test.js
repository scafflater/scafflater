/* eslint-disable no-undef */
const PackageTemplateSource = require("./package-template-source");
const util = require("util");
const fsUtil = require("../../fs-util");

jest.mock("../../fs-util");

describe("getTemplate", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  jest.setTimeout(15000);

  test("get template", async () => {
    jest.spyOn(fsUtil, "getTempFolder").mockReturnValue("some/temp/folder");
    jest.spyOn(util, "promisify").mockReturnValue(() => {
      return { stdout: "", stderr: "" };
    });
    const packageTemplateSource = new PackageTemplateSource();
    expect(packageTemplateSource.getTemplate("template-fastify")).toBeTruthy();
  });
});
