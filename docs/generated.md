## Generated Code Config

Path: `**/_scf.json`

File with informations about how the code was generated

### Contents
```
{
  template: {
    name: "template-name",
    version: "template-version",
    source:{
      name: "source-name",
      key: "source-key",
      gitHub:{
        baseurl: "https://github.com/"
      }
    },
  },
  partials: [
    {
      path: "some-template/some-sub-template"
      parameters: {} // The responses to generate the partials
    }
  ]
}
```