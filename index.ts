import * as fs from "fs";
import * as cheerio from "cheerio";

declare var Promise: any;

export class HtmlTableToLatex {

	contentHtml: string;
	minLengthColumnsByRow: number = 3;

	constructor(args?) {
	}

	prepare(dirname: string, format: string = 'utf8') {
		return new Promise((resolve, reject) => {
			fs.readFile(dirname, format, (err, data) => {
				if (err) {
					return reject(err);
				}
				this.contentHtml = data;
				return resolve(data);
			});
		})
	}

	toTableLatex(caption: string, colums: Array<string> = [], rowContent: Array<Array<string>> = []) {
		let l: string = colums.map(_ => 'l').join('');
		let prepareContent: Array<string> = [];
		rowContent.map(row => prepareContent.push(row.join(' & ') + ' \\\\ \n'))
		return `
			\caption{${caption}}
			\begin{tabular}{${l}}
				${colums.join(' & ')}\\
				${prepareContent.join('')}
			\end{tabular}
			\end{table}
		`;
	}

	toLatex(html?: string, dirname?: string) {
		var $;
		if (dirname === void 0 && this.contentHtml) {
			$ = cheerio.load(this.contentHtml);
		} else if (html === void 0) {
			$ = cheerio.load(html);
		}
		$('table').each((i, elem) => {
			let caption: string = (cheerio.load(elem))("caption").text();
			let columnsDom: Array<any> = (cheerio.load(elem))("tr th").toArray();
			let columnsText: Array<string> = [];
			columnsDom.map(th => columnsText.push((cheerio.load(th)).text()))
			let rows: Array<Array<string>> = [];
			(cheerio.load(elem))("tr").each((i, tr) => {
				let rows_temp: Array<string> = [];
				(cheerio.load(tr))("td").each((i, td) => {
					rows_temp.push($(td).text());
				});
				rows_temp.length >= this.minLengthColumnsByRow? rows.push(rows_temp) : null;
			})
			// console.log("Content:", rows);
			let template_temp = this.toTableLatex(
				caption || 'Caption ' + i, 
				columnsText,
				rows
			);
			console.log("Item", i, caption, "\nTemplate:", template_temp);
		});
		return
	}
}

var hl = new HtmlTableToLatex();
hl.prepare("export.html").then(html => {
	hl.toLatex();
});
