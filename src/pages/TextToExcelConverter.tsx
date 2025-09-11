import * as XLSX from 'xlsx';

class TextToExcelConverter {
  static async convert(file: File, targetFormat: string, setProgress: (progress: number) => void): Promise<Blob> {
    const text = await file.text();
    let jsonData: any[][];
    
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          jsonData = [];
        } else if (Array.isArray(parsed[0])) {
          jsonData = parsed;
        } else {
          jsonData = parsed.map((r: any) => Object.values(r));
        }
      } else {
        // not an array -> fallback to lines
        throw new Error('Not array');
      }
    } catch {
      const lines = text.split(/\r?\n/).filter(Boolean);
      jsonData = lines.map(line => line.split(/[\t,]+/));
    }
    
    const worksheet = XLSX.utils.aoa_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    setProgress(90);
    
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }
}

export default TextToExcelConverter;