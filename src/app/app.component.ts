import { Component, OnInit } from '@angular/core';
import { WebworkerService } from './webworker.service';
import { EXCEL_EXPORT } from './excel-export.script';
import * as fileSaver from 'file-saver';
import { DataService } from './data.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public apiUrl = 'http://localhost:3000/';

  public dataSource: any;
  public displayedColumns: string[] = ['driver', 'seasons', 'entries', 'wins', 'percentage'];

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  constructor(private workerService: WebworkerService, private dataService: DataService) {
  }
  ngOnInit() {
    console.log('fetching data');
    this.dataService.getData(this.apiUrl).subscribe(
      resp => {
        this.dataSource = resp;
        console.log(this.dataSource);
    },
    (err: HttpErrorResponse) => {
      console.error(err.message);
    });
  }

  public exportAsExcel() {
    if (this.dataSource !== undefined) {
      const input = {
        config: {
          body: this.dataSource
        },
        host: window.location.host,
        path: window.location.pathname,
        protocol: window.location.protocol
      };
      console.log(input);

      this.workerService.run(EXCEL_EXPORT, input).then(
        (result) => {
          this.save(result, 'export', this.EXCEL_TYPE, this.EXCEL_EXTENSION);
        }
      ).catch(console.error);
    } else {
      console.log('no data');
    }
  }

  private save(file, filename, filetype, fileextension) {
    const blob = new Blob([this.s2ab(file)], {
      type: filetype
    });
    const today = new Date();
    const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
    const time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    const name = `${filename}${date}${time}.${fileextension}`;

    fileSaver.saveAs(blob, name);
  }

  private s2ab(text: string): ArrayBuffer {
    const buf = new ArrayBuffer(text.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== text.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = text.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  public exportAsPdf() {
  }

  doSomething() {
    let p = document.getElementById('mydiv').innerHTML;
    p = p + '<p>Anudeep<p>';
    document.getElementById('mydiv').innerHTML = p;
    // console.log('running');
  }

  clear() {
    document.getElementById('mydiv').innerHTML = '';
  }
}
