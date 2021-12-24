import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '@grapecity/spread-sheets-resources-zh';

import GC from '@grapecity/spread-sheets';
import { sjsKey } from './key';
GC.Spread.Sheets.LicenseKey = sjsKey

GC.Spread.Common.CultureManager.culture("zh-cn");
import '@grapecity/spread-sheets-charts';
import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react';
import { IO } from "@grapecity/spread-excelio";
import { jsonData } from './data';
import './styles.css';
const Component = React.Component;

window.GC = GC;

function _getElementById(id) {
  return document.getElementById(id);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.spread = null;
    this.importExcelFile = null;
    this.exportFileName = "export.xlsx";
    this.password = "";
  }
  render() {
    return <div class="sample-tutorial">
      <div class="sample-spreadsheets">
        <SpreadSheets workbookInitialized={spread => this.initSpread(spread)}>
          <Worksheet>
          </Worksheet>
        </SpreadSheets>
      </div>
      <div className="options-container">
        <div className="option-row">
          <div className="inputContainer">
            <input type="checkbox" id="incremental" onChange={e => this.changeIncremental(e)} defaultChecked />
            <label for="incremental">Incremental Loading</label>

            <p class="summary" id="loading-container">
              Loading progress:
              <input style={{ width: '231px' }} id="loadingStatus" type="range" name="points" min="0" max="100" value="0" step="0.01" />
            </p>
            <input type="file" id="fileDemo" className="input" onChange={e => this.changeFileDemo(e)} />
            <br />
            <input type="button" id="loadExcel" defaultValue="import" className="button" onClick={e => this.loadExcel(e)} />
          </div>
          <div className="inputContainer">
            <input id="exportFileName" defaultValue="export.xlsx" className="input" onChange={e => this.changeExportFileName(e)} />
            <input type="button" id="saveExcel" defaultValue="export" className="button" onClick={e => this.saveExcel(e)} />
          </div>
        </div>
        <div className="option-row">
          <div className="group">
            <label>Password:
              <input type="password" id="password" onChange={e => this.changePassword(e)} />
            </label>
          </div>
        </div>
      </div>
    </div>;
  }
  initSpread(spread) {
    this.spread = spread;
    spread.options.calcOnDemand = true;
    spread.fromJSON(jsonData);
  }
  changeFileDemo(e) {
    this.importExcelFile = e.target.files[0];
  }
  changePassword(e) {
    this.password = e.target.value;
  }
  changeExportFileName(e) {
    this.exportFileName = e.target.value;
  }
  changeIncremental(e) {
    _getElementById('loading-container').style.display = e.target.checked ? "block" : "none";
  }
  loadExcel(e) {
    let spread = this.spread;
    let excelIo = new IO();
    let excelFile = this.importExcelFile;
    let password = this.password;

    let incrementalEle = _getElementById("incremental");
    let loadingStatus = _getElementById("loadingStatus");
    // here is excel IO API
    excelIo.open(excelFile, function (json) {
      let workbookObj = json;
      if (incrementalEle.checked) {
        spread.fromJSON(workbookObj, {
          incrementalLoading: {
            loading: function (progress, args) {
              progress = progress * 100;
              loadingStatus.value = progress;
              console.log("current loading sheet", args.sheet && args.sheet.name());
            },
            loaded: function () {
            }
          }
        });
      } else {
        spread.fromJSON(workbookObj);
      }
    }, function (e) {
      // process error
      alert(e.errorMessage);
    }, { password: password });
  }
  saveExcel(e) {
    let spread = this.spread;
    let excelIo = new IO();

    let fileName = this.exportFileName;
    let password = this.password;
    if (fileName.substr(-5, 5) !== '.xlsx') {
      fileName += '.xlsx';
    }

    let json = spread.toJSON();

    // here is excel IO API
    excelIo.save(json, function (blob) {
      saveAs(blob, fileName);
    }, function (e) {
      // process error
      console.log(e);
    }, { password: password });

  }
}
export default App
