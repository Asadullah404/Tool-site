import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
import * as mammoth from "mammoth";

interface ConversionOptions {
  fontSize?: number;
  lineHeight?: number;
  margin?: number;
  fontFamily?: StandardFonts;
  textColor?: [number, number, number];
  pageSize?: [number, number];
  preserveFormatting?: boolean;
}

interface FormattedContent {
  text: string;
  isHeading?: boolean;
  level?: number;
  isBold?: boolean;
  isItalic?: boolean;
  fontSize?: number;
}

class WordToPdfConverter {
  private static readonly DEFAULT_OPTIONS: Required<ConversionOptions> = {
    fontSize: 12,
    lineHeight: 16,
    margin: 50,
    fontFamily: StandardFonts.Helvetica,
    textColor: [0, 0, 0],
    pageSize: [595, 842], // A4
    preserveFormatting: true
  };

  static async convert(
    file: File,
    targetFormat: string = "pdf",
    setProgress: (progress: number) => void,
    options: ConversionOptions = {}
  ): Promise<Blob> {
    try {
      const config = { ...this.DEFAULT_OPTIONS, ...options };
      setProgress(10);

      // Step 1: Read and extract content from DOCX
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const extractedContent = await this.extractContent(arrayBuffer, config.preserveFormatting);
      setProgress(40);

      // Step 2: Create PDF with enhanced formatting
      const pdfDoc = await PDFDocument.create();
      
      // Set PDF metadata
      pdfDoc.setTitle(file.name.replace(/\.[^/.]+$/, ''));
      pdfDoc.setAuthor('Word to PDF Converter');
      pdfDoc.setCreator('PDF-lib');
      pdfDoc.setProducer('Word to PDF Converter');
      pdfDoc.setCreationDate(new Date());
      pdfDoc.setModificationDate(new Date());

      const fonts = await this.loadFonts(pdfDoc);
      setProgress(50);

      // Step 3: Process content and create pages
      await this.createPagesWithContent(pdfDoc, extractedContent, fonts, config, setProgress);
      setProgress(90);

      // Step 4: Generate final PDF with proper options
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        objectsPerTick: 50
      });
      setProgress(100);

      // Verify the PDF bytes are valid
      if (!pdfBytes || pdfBytes.length === 0) {
        throw new Error('Generated PDF is empty');
      }

      // Check for PDF header
      const header = new Uint8Array(pdfBytes.slice(0, 4));
      const headerString = String.fromCharCode(...header);
      if (!headerString.startsWith('%PDF')) {
        throw new Error('Invalid PDF format generated');
      }

      return new Blob([pdfBytes], { 
        type: "application/pdf"
      });
    } catch (error) {
      console.error("PDF conversion failed:", error);
      throw new Error(`PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async extractContent(arrayBuffer: ArrayBuffer, preserveFormatting: boolean): Promise<FormattedContent[]> {
    if (preserveFormatting) {
      // Extract with HTML formatting to preserve structure
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
      return this.parseHtmlContent(htmlResult.value);
    } else {
      // Extract plain text
      const textResult = await mammoth.extractRawText({ arrayBuffer });
      const cleanText = this.cleanText(textResult.value || "Empty Document");
      return [{ text: cleanText }];
    }
  }

  private static parseHtmlContent(html: string): FormattedContent[] {
    const content: FormattedContent[] = [];
    
    // Simple HTML parsing - split by common tags
    const sections = html.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>|<p[^>]*>.*?<\/p>|<strong>.*?<\/strong>|<em>.*?<\/em>)/gi);
    
    for (const section of sections) {
      if (!section.trim()) continue;
      
      const cleanSection = this.cleanText(section.replace(/<[^>]*>/g, ''));
      if (!cleanSection.trim()) continue;
      
      if (section.match(/<h([1-6])[^>]*>/i)) {
        const level = parseInt(section.match(/<h([1-6])[^>]*>/i)![1]);
        content.push({
          text: cleanSection,
          isHeading: true,
          level,
          fontSize: Math.max(16 - level, 12),
          isBold: true
        });
      } else if (section.match(/<strong>/i)) {
        content.push({ text: cleanSection, isBold: true });
      } else if (section.match(/<em>/i)) {
        content.push({ text: cleanSection, isItalic: true });
      } else {
        content.push({ text: cleanSection });
      }
    }
    
    // If no structured content found, fall back to plain text
    if (content.length === 0) {
      const plainText = this.cleanText(html.replace(/<[^>]*>/g, ''));
      content.push({ text: plainText });
    }
    
    return content;
  }

  private static cleanText(text: string): string {
    return text
      .replace(/\u0000/g, '') // Remove null characters
      .replace(/\r\n/g, '\n') // Normalize line breaks
      .replace(/\r/g, '\n')
      .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
      .normalize('NFKD') // Normalize unicode
      .trim();
  }

  private static async loadFonts(pdfDoc: PDFDocument) {
    return {
      regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
      bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      italic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
      boldItalic: await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique)
    };
  }

  private static async createPagesWithContent(
    pdfDoc: PDFDocument,
    content: FormattedContent[],
    fonts: any,
    config: Required<ConversionOptions>,
    setProgress: (progress: number) => void
  ): Promise<void> {
    // Ensure we have at least one page and some content
    if (content.length === 0) {
      const page = pdfDoc.addPage(config.pageSize);
      page.drawText('No content found in document', {
        x: config.margin,
        y: config.pageSize[1] - config.margin - 20,
        size: config.fontSize,
        font: fonts.regular,
        color: rgb(...config.textColor)
      });
      return;
    }

    let currentPage = pdfDoc.addPage(config.pageSize);
    let currentY = config.pageSize[1] - config.margin;
    const maxWidth = config.pageSize[0] - (config.margin * 2);
    
    // Ensure maxWidth is positive
    if (maxWidth <= 0) {
      throw new Error('Page margins are too large for the page size');
    }
    
    const totalItems = content.length;
    let processedItems = 0;

    for (const item of content) {
      try {
        // Skip empty items
        if (!item.text || !item.text.trim()) {
          processedItems++;
          continue;
        }

        const fontSize = Math.max(8, Math.min(72, item.fontSize || config.fontSize));
        const font = this.selectFont(fonts, item);
        const lineHeight = Math.max(fontSize * 1.2, item.isHeading ? fontSize * 1.5 : config.lineHeight);
        
        // Add extra spacing before headings
        if (item.isHeading && currentY < config.pageSize[1] - config.margin) {
          currentY -= lineHeight * 0.5;
        }
        
        const wrappedLines = this.wrapText(item.text, font, fontSize, maxWidth);
        
        for (let i = 0; i < wrappedLines.length; i++) {
          const line = wrappedLines[i].trim();
          
          // Skip empty lines but preserve spacing
          if (!line) {
            currentY -= lineHeight * 0.5;
            continue;
          }
          
          // Check if we need a new page
          if (currentY - lineHeight < config.margin) {
            currentPage = pdfDoc.addPage(config.pageSize);
            currentY = config.pageSize[1] - config.margin;
          }
          
          // Ensure coordinates are valid
          const xPos = Math.max(0, config.margin);
          const yPos = Math.max(config.margin, Math.min(config.pageSize[1] - config.margin, currentY));
          
          // Draw the text
          currentPage.drawText(line, {
            x: xPos,
            y: yPos,
            size: fontSize,
            font: font,
            color: rgb(...config.textColor)
          });
          
          currentY -= lineHeight;
        }
        
        // Add extra spacing after headings and paragraphs
        if (item.isHeading || item.text.length > 100) {
          currentY -= lineHeight * 0.3;
        }
      } catch (itemError) {
        console.warn('Error processing content item:', itemError);
        // Continue with next item instead of failing completely
      }
      
      processedItems++;
      const progressValue = 50 + Math.round((processedItems / totalItems) * 40);
      setProgress(Math.min(89, progressValue));
    }
    
    // Ensure we have at least one page with some content
    if (pdfDoc.getPages().length === 0) {
      pdfDoc.addPage(config.pageSize);
    }
  }

  private static selectFont(fonts: any, item: FormattedContent): PDFFont {
    if (item.isBold && item.isItalic) return fonts.boldItalic;
    if (item.isBold) return fonts.bold;
    if (item.isItalic) return fonts.italic;
    return fonts.regular;
  }

  private static wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
    if (!text || !text.trim()) return [''];
    if (maxWidth <= 0) return [text];
    
    const lines: string[] = [];
    const paragraphs = text.split('\n');
    
    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        lines.push(''); // Preserve empty lines
        continue;
      }
      
      const words = paragraph.trim().split(/\s+/);
      let currentLine = '';
      
      for (const word of words) {
        if (!word) continue; // Skip empty words
        
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        
        try {
          const width = font.widthOfTextAtSize(testLine, fontSize);
          
          if (width <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              lines.push(currentLine);
              currentLine = word;
              
              // Check if single word is too long
              if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
                lines.push(...this.breakLongWord(word, font, fontSize, maxWidth));
                currentLine = '';
              }
            } else {
              // First word is too long, need to break it
              lines.push(...this.breakLongWord(word, font, fontSize, maxWidth));
            }
          }
        } catch (fontError) {
          // Fallback if font width calculation fails
          console.warn('Font width calculation failed, using character count fallback');
          const maxChars = Math.floor(maxWidth / (fontSize * 0.6)); // Rough estimate
          if (testLine.length <= maxChars) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              // Break long word by characters
              const chunks = this.breakLongWordByChars(word, maxChars);
              lines.push(...chunks.slice(0, -1));
              currentLine = chunks[chunks.length - 1] || '';
            }
          }
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
    }
    
    return lines.length > 0 ? lines : [''];
  }

  private static breakLongWord(word: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
    if (!word) return [''];
    
    const parts: string[] = [];
    let currentPart = '';
    
    try {
      for (const char of word) {
        const testPart = currentPart + char;
        const width = font.widthOfTextAtSize(testPart, fontSize);
        
        if (width <= maxWidth) {
          currentPart = testPart;
        } else {
          if (currentPart) {
            parts.push(currentPart);
            currentPart = char;
          } else {
            parts.push(char); // Single character that's still too wide
          }
        }
      }
      
      if (currentPart) {
        parts.push(currentPart);
      }
    } catch (error) {
      // Fallback to character-based breaking
      return this.breakLongWordByChars(word, Math.floor(maxWidth / (fontSize * 0.6)));
    }
    
    return parts.length > 0 ? parts : [word];
  }

  private static breakLongWordByChars(word: string, maxChars: number): string[] {
    if (!word || maxChars <= 0) return [word];
    
    const parts: string[] = [];
    for (let i = 0; i < word.length; i += maxChars) {
      parts.push(word.substring(i, i + maxChars));
    }
    return parts;
  }

  // Utility method to validate file type
  static isValidWordFile(file: File): boolean {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      '.docx',
      '.doc'
    ];
    
    return validTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith(type)
    );
  }

  // Method to get conversion progress estimates
  static getProgressStages(): { [key: string]: string } {
    return {
      '10': 'Reading document...',
      '20': 'Extracting content...',
      '40': 'Processing formatting...',
      '50': 'Creating PDF structure...',
      '70': 'Generating pages...',
      '90': 'Finalizing PDF...',
      '100': 'Complete!'
    };
  }
}

export default WordToPdfConverter;