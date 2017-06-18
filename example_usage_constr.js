// httl => HtmlTableToLatex 
var HtmlTableToLatex = require('./').HtmlTableToLatex;

var httl = new HtmlTableToLatex(2, 'l', false);

httl.latex("export.html").then(latex => {
	// console.log("Latex", latex);
	httl.save('latex.tex', latex.join('\n'), (err, res) => {});
});