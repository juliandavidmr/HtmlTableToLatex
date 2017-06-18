import * as fs from "fs";
import * as cheerio from "cheerio";

declare var Promise: any;

export class HtmlTableToLatex {

  contentHtml: string;
  minLengthColumnsByRow: number = 3;
  separator: string = 'l';
  lines: boolean = true;

  constructor(
    minLengthColumnsByRow: number = 3,
    separator: string = 'l',
    lines: boolean = true
  ) {
    this.minLengthColumnsByRow = minLengthColumnsByRow;
    this.separator = separator;
    this.lines = lines;
  }

	/**
	 * Read content file
	 * @param dirname 
	 * @param format 
	 */
  public prepare(dirname: string, format: string = 'utf8') {
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

  private camelize(string: string) {
    return string.replace(/(?:^|[-_ :])(\w)/g, function (_, c) {
      return c ? c.toUpperCase() : '';
    })
  }

  private camelizeList(list: Array<string>) {
    return list.map(item => this.camelize(item));
  }

  private camelizeRows(rows: Array<Array<string>>) {
    return rows.map((sub_list:Array<string>) => sub_list.map(str => this.camelize(str)))
  }

	/**
	 * Returns a latex table
	 * @param caption 
	 * @param colums 
	 * @param rowContent 
	 */
  public toTableLatex(caption: string, colums: Array<string> = [], rowContent: Array<Array<string>> = []): string {
    caption = this.camelize(caption).trim();
    colums = this.camelizeList(colums);
    rowContent = this.camelizeRows(rowContent);

    let l: string = (this.lines ? '|' : '') + colums.map(_ => 'l').join(this.lines ? '|' : '') + (this.lines ? '|' : '');
    let prepareContent: Array<string> = [];
    rowContent.map(row => prepareContent.push(row.join(' & ') + `\\\\ ${this.lines ? '\\hline' : ''} \n`))

    return `
			\\begin{center}
				\\caption{table${this.camelize(caption)}}
        \\label{label${this.camelize(caption)}}
				\\begin{tabular}{ ${l} }
					${this.lines ? '\\hline' : ''}
					${colums.join(' & ')} \\\\
					${prepareContent.join('')}
				\\end{tabular}
			\\end{center}
		`;
  }

	/**
	 * Converts many html tables into latex tables
	 * @param html 
	 * @param dirname 
	 */
  public toLatex(html?: string, dirname?: string): Array<string> {
    var $, templates_list: Array<string> = [];
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
        rows_temp.length >= this.minLengthColumnsByRow ? rows.push(rows_temp) : null;
      })
      // console.log("Content:", rows);
      let template_temp = this.toTableLatex(
        caption || 'Caption ' + i,
        columnsText,
        rows
      );
      templates_list.push(template_temp);
      // console.log("Item", i, caption, "\nTemplate:", template_temp);
    });
    return templates_list;
  }

  /**
   * Convert content file html to latex
   * @param dirname 
   */
  public latex(dirname: string) {
    return new Promise((resolve, reject) => {
      this.prepare(dirname).then(_ => {
        return resolve(this.toLatex());
      }, err => reject(err));
    })
  }

  /**
   * Save file
   * @param dirname 
   * @param content 
   * @param cb callback
   */
  public save(dirname: string, content: string, cb?: Function) {
    fs.writeFile(dirname, content, cb);
  }
}

export const HTTL = new HtmlTableToLatex();
/*
var hl = new HtmlTableToLatex();
hl.latex("export.html").then(latex => {
  // console.log("Latex", latex);
  hl.save('latex.tex', latex.join('\n'));
});
*/