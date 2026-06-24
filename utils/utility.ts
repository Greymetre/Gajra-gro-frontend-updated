import { writeFile, read, utils } from 'xlsx';
// import * as XLSX from 'xlsx';
export const objectAppendIntoformData = async(formData: any, obj: any, key: any) => {
  var i, k;
    for (i in obj) {
        if(i !== '_id')
        {
            k = key ? key + '[' + i + ']' : i;
            if (typeof obj[i] == 'object')
            objectAppendIntoformData(formData, obj[i], k);
            else
                formData.append(k, obj[i]);
        }
    }
    return formData
}
export const convertExcelToJson = (file: File) => {
     const fileReader = new FileReader();
     fileReader.readAsBinaryString(file);
     fileReader.onload = async () => {
       const workbook = read(fileReader.result, { type: 'binary' });
       const data = await utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
       return data
     }
}

export const handleExportTemplate = async (data:any, filename:string) => {
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, "Data");
    return writeFile(wb, filename);
}
