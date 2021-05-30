Template Folder Structure
===

```
.
├── _scf.json
├── _partials
│   └── _init
│       └── _scf.json
│   └── partial-template-1
│       └── _scf.json
│   └── ...
│   └── partial-template-2
│       └── _scf.json
├── _hooks
│   ├── hook-implementation-1.js
│   ├── ...
│   └── hook-implementation-n.js
```

<div class="mobile-side-scroller">
<table>
  <thead>
    <tr>
      <th>File / Directory</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p><code>/_scf.json</code></p>
      </td>
      <td>
        <p>
          Stores the <a href="#main-configuration">main configuration</a> data.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>/_partials</code></p>
      </td>
      <td>
        <p>
          Stores the available partial templates. Each folder is a partial template that could be used to scaffold new features. 
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>/_partials/_init</code></p>
      </td>
      <td>
        <p>
          Partial template used to initialize the source.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>/_partials/<i>&lt;partial-folder&gt;</i></code></p>
      </td>
      <td>
        <p>
          A partial template is a set of files and folders that will be generated and merged in your code structure.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>/_partials/<i>&lt;partial-folder&gt;</i>/_scf.json</code></p>
      </td>
      <td>
        <p>
          The partial template configuration. In this file you can configure where and how the partial template must be generated.
        </p>
      </td>
    </tr>
  </tbody>
</table>
</div>

## Main configuration 

Path: `/_scf.json`

File with main template configuration

### Contents
```
{
  name: "main-name",
  version: "main-version"
}
```

## Partial configutation

Path: `/_partials/*/_scf.json`
### Contents
```
{
  name: "partial-template-name",
  parameters: [],
}
```

