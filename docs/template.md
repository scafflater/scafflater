Template Folder Structure
===

```
.
├── _scf.json
├── _templates
│   └── _init
│       └── _scf.json
│   └── sample-template-1
│       └── _scf.json
│   └── ...
│   └── sample-template-2
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
        <p><code>/_templates</code></p>
      </td>
      <td>
        <p>
          Stores the available templates. Each folder is a template that could be used to scaffold new features in you source code. 
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>/_templates/_init</code></p>
      </td>
      <td>
        <p>
          Template used to initialize the repository.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>/_templates/<i>&lt;template-folder&gt;</i></code></p>
      </td>
      <td>
        <p>
          Template is a set of files and folders that will be generated and included in your code structure.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <p><code>/_templates/<i>&lt;template-folder&gt;</i>/_scf.json</code></p>
      </td>
      <td>
        <p>
          The <a href="/template/configuration">template configuration</a>. In this file you can configure where and how the template must be generated.
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

## Template configutation

Path: `/_templates/*/_scf.json`
### Contents
```
{
  name: "template-name",
  parameters: [],
}
```

