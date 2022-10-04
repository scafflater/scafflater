/* eslint-disable no-undef */
const PackageTemplateSource = require("./package-template-source");
const util = require("util");
const {
  ScafflaterFileNotFoundError,
  TemplateDefinitionNotFound,
} = require("../../errors");
const fsUtil = require("../../fs-util");
const { LocalTemplate } = require("../../scafflater-config/local-template");

jest.mock("../../fs-util");

describe("getTemplate", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  jest.setTimeout(15000);

  test("get template", async () => {
    jest.spyOn(util, "promisify").mockReturnValue(() => {
      return { stdout: "", stderr: "" };
    });
    const packageTemplateSource = new PackageTemplateSource();
    expect(packageTemplateSource.getTemplate("template-fastify")).toBeTruthy();
  });
});
