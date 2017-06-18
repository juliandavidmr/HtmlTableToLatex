# HtmlTableToLatex

Converter html tables tables in latex

## Installation
```bash
$ npm install htmltabletolatex --save
```

## Usage
```js
// httl = HtmlTableToLatex 
var httl = require('htmltabletolatex').HTTL;

httl.latex("mytables.html").then(latex => {
	// console.log("Latex tables:", latex);
	httl.save('latex.tex', latex.join('\n'), (err, success) => {});
});
```

## Example

#### Html input
```html
<table>
    <caption>Table: usuario </caption>        
    <tr>
        <th>Name</th>
        <th>Data Type</th>
        <th>Nullable</th>
        <th>PK</th>
        <th>FK</th>
        <th>Default</th>
        <th>Comment</th>
    </tr>
    <tr>
        <td>user_idUsuario</td>
        <td>VARCHAR(45)</td>
        <td>Yes</td>
        <td>Yes</td>
        <td>No</td>
        <td></td>
        <td></td>
    </tr>        
    <tr>
        <td>user_Correo</td>
        <td>VARCHAR(45)</td>
        <td>Yes</td>
        <td>No</td>
        <td>No</td>
        <td></td>
        <td></td>
    </tr>
</table>
```
#### Latex output
```tex
\begin{center}
	\caption{tableTableUsuario}
	\label{labelTableUsuario}
	\begin{tabular}{ |l|l|l|l|l|l|l| }
		\hline
		Name & DataType & Nullable & PK & FK & Default & Comment \\
		UserIdUsuario & VARCHAR(45) & Yes & Yes & No &  & \\ \hline
		UserCorreo & VARCHAR(45) & Yes & No & No &  & \\ \hline		
	\end{tabular}
\end{center}
```

## API

### constructor(args) -> `HtmlTableToLatex`

| Param | Type | Description | Default |
| ----- | ---- | ----------- | ------- |
| minLengthColumnsByRow | number | Take into account only columns by minimum size in text | 3 |
| separator | string | Table columns size. i.e: `l, c, r` | l |
| lines | boolean | Show lines | `true` |

#### Example
```js
var HtmlTableToLatex = require('htmltabletolatex').HtmlTableToLatex;

var httl = new HtmlTableToLatex(2, 'l', false);
```

**You can also change the parameters without the need of a constructor:**
```js
var httl = require('htmltabletolatex').HTTL;

httl.lines = false;
httl.minLengthColumnsByRow = 2;
httl.separator = 'l';
```

## Colaborate
```bash
# Fork it this repo
# Install typescript cli
$ git clone https://github.com/<your-username>/HtmlTableToLatex.git
$ cd HtmlTableToLatex
# Edit & transpile file index.ts
# Commit + push + Pull request
```

### License MIT

This software is released under the [MIT License](./LICENSE).