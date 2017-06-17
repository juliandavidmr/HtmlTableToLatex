"use strict";
exports.__esModule = true;
var fs = require("fs");
var cheerio = require("cheerio");
var HtmlTableToLatex = (function () {
    function HtmlTableToLatex(args) {
        this.minLengthColumnsByRow = 3;
    }
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
    HtmlTableToLatex.prototype.toTableLatex = function (caption, colums, rowContent) {
        if (colums === void 0) { colums = []; }
        if (rowContent === void 0) { rowContent = []; }
        var l = colums.map(function (_) { return 'l'; }).join('');
        var prepareContent = [];
        rowContent.map(function (row) { return prepareContent.push(row.join(' & ') + ' \\\\ \n'); });
        return "\n\t\t\tcaption{" + caption + "}\n\t\t\t\begin{tabular}{" + l + "}\n\t\t\t\t" + colums.join(' & ') + "\\\n\t\t\t\t" + prepareContent.join('') + "\n\t\t\tend{tabular}\n\t\t\tend{table}\n\t\t";
    };
    HtmlTableToLatex.prototype.toLatex = function (html, dirname) {
        var _this = this;
        var $;
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
            console.log("Item", i, caption, "\nTemplate:", template_temp);
        });
        return;
    };
    return HtmlTableToLatex;
}());
exports.HtmlTableToLatex = HtmlTableToLatex;
var hl = new HtmlTableToLatex();
hl.prepare("export.html").then(function (html) {
    hl.toLatex();
});
