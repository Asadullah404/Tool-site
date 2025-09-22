import { jsPDF } from 'jspdf';

class TextToPdfConverter {
  static async convert(file: File, targetFormat: string, setProgress: (progress: number) => void): Promise<Blob> {
    const text = await file.text();
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 10);
    setProgress(90);
    
    // jsPDF returns a string for output('blob') in some builds; .output('blob') works generally
    return doc.output('blob');
  }
}

export default TextToPdfConverter;