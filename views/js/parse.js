var newloc =[];
var subloc = [];
function ExportToTable() {
     var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
     /*Checks whether the file is a valid excel file*/
     if (regex.test($("#excelfile").val().toLowerCase())) {
         var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
         if ($("#excelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
             xlsxflag = true;
         }
         /*Checks whether the browser supports HTML5*/
         if (typeof (FileReader) != "undefined") {
             var reader = new FileReader();
             reader.onload = function (e) {
                 var data = e.target.result;
                 /*Converts the excel data in to object*/
                 if (xlsxflag) {
                     var workbook = XLSX.read(data, { type: 'binary' });
                 }
                 else {
                     var workbook = XLS.read(data, { type: 'binary' });
                 }
                 /*Gets all the sheetnames of excel in to a variable*/
                 var sheet_name_list = workbook.SheetNames;

                 var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                 sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                     /*Convert the cell value to Json*/
                     var values = "";
                     if (xlsxflag) {
                         var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                         console.log(exceljson[0]);
                     }
                     else {
                         var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                         console.log(exceljson);
                     }
                     for (var i = 0; i<exceljson.length; i++){
                        values='\''+exceljson[i].Date+'\''+', '+'\''+exceljson[i].Description+'\''+', '+exceljson[i].Amount.substring(1,exceljson[i].Amount.length-1);
                        console.log(values);
                     }

                     if (exceljson.length > 0 && cnt == 0) {
                         BindTable(exceljson, '#dataTable');
                         cnt++;
                     }
                 });
                 $('#dataTable').show();
             }
             if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                 reader.readAsArrayBuffer($("#excelfile")[0].files[0]);
             }
             else {
                 reader.readAsBinaryString($("#excelfile")[0].files[0]);
             }
         }
         else {
             alert("Sorry! Your browser does not support HTML5!");
         }
     }
     else {
         alert("Please upload a valid Excel file!");
     }

 }

function BindTable(jsondata, tableid) {/*Function used to convert the JSON array to Html Table*/
     var columns = BindTableHeader(jsondata, tableid); /*Gets all the column headings of Excel*/
     var locationsInM = [];
     for (var i = 0; i < jsondata.length; i++) {
         var row$ = $('<tr/>');
                var cellValue = jsondata[i][columns[1]];
                locationsInM.push(cellValue);
                //console.log("locations from parse.js are" + cellValue);
                console.log(contains.call(subloc, cellValue.substring(0,9)));
                console.log(subloc);
                console.log(newloc);
                if(!contains.call(subloc, cellValue.substring(0,    9))){
                    if (cellValue != null)
                       cellValue = cellValue.substring(0,cellValue.length-5).trim();
                    newloc.push(cellValue);
                    subloc.push(cellValue.substring(0,9));
                    for(var colIndex = 0; colIndex < columns.length; colIndex++){
                        cellValue = jsondata[i][columns[colIndex]];
                        var cellValue = jsondata[i][columns[colIndex]];
                        if (cellValue != null && colIndex==1)
                           cellValue = cellValue.substring(0,cellValue.length-5).trim();
                        if (colIndex==2)
                           cellValue = ""+Math.abs(parseFloat(cellValue));
                        if (cellValue == null)
                            cellValue = "";
                        if (colIndex==2)
                            cellValue = "$" + cellValue
                        row$.append($('<td/>').html(cellValue));
                    }
                }
         $(tableid).append(row$);
     }
    console.log("locations after binding table:" + newloc[0]);
    window.initMap();
 }
 function BindTableHeader(jsondata, tableid) {/*Function used to get all column names from JSON and bind the html table header*/
     var columnSet = [];
     var headerTr$ = $('<tr/>');
     for (var i = 0; i < jsondata.length; i++) {
         var rowHash = jsondata[i];
         for (var key in rowHash) {
             if (rowHash.hasOwnProperty(key)) {
                 if ($.inArray(key, columnSet) == -1) {/*Adding each unique column names to a variable array*/
                     columnSet.push(key);
                     headerTr$.append($('<th/>').html(key));
                 }
             }
         }
     }
     $(tableid).append(headerTr$);
     return columnSet;
 }

 var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};
