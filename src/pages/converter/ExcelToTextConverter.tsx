import * as XLSX from 'xlsx';

class ExcelToTextConverter {
  static async convert(file: File, targetFormat: string, setProgress: (progress: number) => void): Promise<Blob> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(firstSheet);
    setProgress(90);
    
    return new Blob([csv], { type: 'text/plain' });
  }
}

export default ExcelToTextConverter;