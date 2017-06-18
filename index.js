"use strict";
exports.__esModule = true;
var fs = require("fs");
var cheerio = require("cheerio");
var HtmlTableToLatex = (function () {
    function HtmlTableToLatex(minLengthColumnsByRow, separator, lines) {
        if (minLengthColumnsByRow === void 0) { minLengthColumnsByRow = 3; }
        if (separator === void 0) { separator = 'l'; }
        if (lines === void 0) { lines = true; }
        this.minLengthColumnsByRow = 3;
        this.separator = 'l';
        this.lines = true;
        this.minLengthColumnsByRow = minLengthColumnsByRow;
        this.separator = separator;
        this.lines = lines;
    }
    /**
     * Read content file
     * @param dirname
     * @param format
     */
    HtmlTableToLatex.prototype.prepare = function (dirname, format) {
        var _this = this;
        if (format === void 0) { format = 'utf8'; }
        return new Promise(function (resolve, reject) {
            fs.readFile(dirname, format, function (err, data) {
                if (err) {
                    return reject(err);
                }
                _this.contentHtml = data;
                return resolve(data);
            });
        });
    };
    HtmlTableToLatex.prototype.camelize = function (string) {
        return string.replace(/(?:^|[-_ :])(\w)/g, function (_, c) {
            return c ? c.toUpperCase() : '';
        });
    };
    HtmlTableToLatex.prototype.camelizeList = function (list) {
        var _this = this;
        return list.map(function (item) { return _this.camelize(item); });
    };
    HtmlTableToLatex.prototype.camelizeRows = function (rows) {
        var _this = this;
        return rows.map(function (sub_list) { return sub_list.map(function (str) { return _this.camelize(str); }); });
    };
    /**
     * Returns a latex table
     * @param caption
     * @param colums
     * @param rowContent
     */
    HtmlTableToLatex.prototype.toTableLatex = function (caption, colums, rowContent) {
        var _this = this;
        if (colums === void 0) { colums = []; }
        if (rowContent === void 0) { rowContent = []; }
        caption = this.camelize(caption).trim();
        colums = this.camelizeList(colums);
        rowContent = this.camelizeRows(rowContent);
        var l = (this.lines ? '|' : '') + colums.map(function (_) { return 'l'; }).join(this.lines ? '|' : '') + (this.lines ? '|' : '');
        var prepareContent = [];
        rowContent.map(function (row) { return prepareContent.push(row.join(' & ') + ("\\\\ " + (_this.lines ? '\\hline' : '') + " \n")); });
        return "\n\t\t\t\\begin{center}\n\t\t\t\t\\caption{table" + this.camelize(caption) + "}\n        \\label{label" + this.camelize(caption) + "}\n\t\t\t\t\\begin{tabular}{ " + l + " }\n\t\t\t\t\t" + (this.lines ? '\\hline' : '') + "\n\t\t\t\t\t" + colums.join(' & ') + " \\\\\n\t\t\t\t\t" + prepareContent.join('') + "\n\t\t\t\t\\end{tabular}\n\t\t\t\\end{center}\n\t\t";
    };
    /**
     * Converts many html tables into latex tables
     * @param html
     * @param dirname
     */
    HtmlTableToLatex.prototype.toLatex = function (html, dirname) {
        var _this = this;
        var $, templates_list = [];
        if (dirname === void 0 && this.contentHtml) {
            $ = cheerio.load(this.contentHtml);
        }
        else if (html === void 0) {
            $ = cheerio.load(html);
        }
        $('table').each(function (i, elem) {
            var caption = (cheerio.load(elem))("caption").text();
            var columnsDom = (cheerio.load(elem))("tr th").toArray();
            var columnsText = [];
            columnsDom.map(function (th) { return columnsText.push((cheerio.load(th)).text()); });
            var rows = [];
            (cheerio.load(elem))("tr").each(function (i, tr) {
                var rows_temp = [];
                (cheerio.load(tr))("td").each(function (i, td) {
                    rows_temp.push($(td).text());
                });
                rows_temp.length >= _this.minLengthColumnsByRow ? rows.push(rows_temp) : null;
            });
            // console.log("Content:", rows);
            var template_temp = _this.toTableLatex(caption || 'Caption ' + i, columnsText, rows);
            templates_list.push(template_temp);
            // console.log("Item", i, caption, "\nTemplate:", template_temp);
        });
        return templates_list;
    };
    /**
     * Convert content file html to latex
     * @param dirname
     */
    HtmlTableToLatex.prototype.latex = function (dirname) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.prepare(dirname).then(function (_) {
                return resolve(_this.toLatex());
            }, function (err) { return reject(err); });
        });
    };
    /**
     * Save file
     * @param dirname
     * @param content
     * @param cb callback
     */
    HtmlTableToLatex.prototype.save = function (dirname, content, cb) {
        fs.writeFile(dirname, content, cb);
    };
    return HtmlTableToLatex;
}());
exports.HtmlTableToLatex = HtmlTableToLatex;
exports.HTTL = new HtmlTableToLatex();
/*
var hl = new HtmlTableToLatex();
hl.latex("export.html").then(latex => {
  // console.log("Latex", latex);
  hl.save('latex.tex', latex.join('\n'));
});
*/ 
