// httl => HtmlTableToLatex 
var httl = require('./').HTTL;

httl.latex("export.html").then(latex => {
	// console.log("Latex", latex);
	httl.save('latex.tex', latex.join('\n'), (err, res) => {});
});