import React from 'react';
import * as GC from '@grapecity/spread-sheets';


import "@grapecity/spread-sheets-pivot-addon";
import '@grapecity/spread-sheets-resources-zh';
import '@grapecity/spread-sheets-designer-resources-cn';
import { Designer } from '@grapecity/spread-sheets-designer-react';
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css"
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css"
import "./custom.less"
import * as ExcelIO from "@grapecity/spread-excelio";
//Apply License
var sjsLicense = "sjs-distribution-key";
// GC.Spread.Sheets.LicenseKey = sjsLicense;
import { sjsKey, toolsKey } from './key';
GC.Spread.Sheets.LicenseKey = ExcelIO.LicenseKey = sjsKey;
GC.Spread.Sheets.Designer.LicenseKey = toolsKey
// GC.Spread.Sheets.Designer.LicenseKey = "designer-component-distribution-key";

GC.Spread.Common.CultureManager.culture('zh-cn');
// ---------------------------

import { IO } from "@grapecity/spread-excelio";
import { data } from './data2'
function App() {
  var config = GC.Spread.Sheets.Designer.DefaultConfig;
  // config.commandMap = {
  //   Welcome: {
  //     title: "Welcome",
  //     text: "Welcome",
  //     iconClass: "ribbon-button-welcome",
  //     bigButton: "true",
  //     commandName: "Welcome",
  //     execute: async (context, propertyName, fontItalicChecked) => {
  //       alert("Welcome to new designer.");
  //     },
  //   },
  // };
  // config.ribbon[0].buttonGroups.unshift({
  //   label: "NewDesigner",
  //   thumbnailClass: "welcome",
  //   commandGroup: {
  //     children: [
  //       {
  //         direction: "vertical",
  //         commands: ["Welcome"],
  //       },
  //       // This is custom button ----------------end-------------
  //     ],
  //   },
  // });
  // // ------------------------
  // let importExcelFile = null
  // function changeFileDemo(e) {
  //   importExcelFile = e.target.files[0];
  // }

  // let spread = null
  // let exportFileName = "export.xlsx";
  // let password = "";

  // function loadExcel(e) {
  //   let spread = spread;
  //   let excelIo = new IO();
  //   let excelFile = importExcelFile;
  //   let password = password;

  //   // let incrementalEle = _getElementById("incremental");
  //   // let loadingStatus = _getElementById("loadingStatus");
  //   // here is excel IO API
  //   excelIo.open(excelFile, function (json) {
  //     let workbookObj = json;
  //     console.log(69, workbookObj)
  //     // if (incrementalEle.checked) {
  //     spread.fromJSON(workbookObj, {
  //       incrementalLoading: {
  //         loading: function (progress, args) {
  //           progress = progress * 100;
  //           // loadingStatus.value = progress;
  //           console.log("current loading sheet", args.sheet && args.sheet.name());
  //         },
  //         loaded: function () {
  //         }
  //       }
  //     });
  //     // } else {
  //     //   spread.fromJSON(workbookObj);
  //     // }
  //   }, function (e) {
  //     // process error
  //     alert(e.errorMessage);
  //   }, { password: password });
  // }

  return (
    <div>
      {/* <input type="file" id="fileDemo" className="input" onChange={e => changeFileDemo(e)} />
      <input type="button" id="loadExcel" defaultValue="import" className="button" onClick={e => loadExcel(e)} /> */}
      <input type="button" value="保存" />
      <Designer
        styleInfo={{ width: "100%", height: '98vh' }}
        config={config}
        spreadOptions={{ sheetCount: 2 }}
        designerInitialized={(designer) => {
          const spread = designer.getWorkbook();
          spread.fromJSON(JSON.parse(data), {
            ignoreFormula: false,
            ignoreStyle: false,
            frozenColumnsAsRowHeaders: false,
            frozenRowsAsColumnHeaders: false,
            doNotRecalculateAfterLoad: false
          })
        }}
      ></Designer>
    </div >
  );
}
export default App;
