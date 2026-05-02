export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'PDF' | 'Media' | 'Image' | 'AI' | 'Finance' | 'Dev' | 'Calculator';
}

export const TOOLS: Tool[] = [
  // --- PDF TOOLS ---
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine PDFs in the order you want with the easiest PDF merger available.', url: '/tools/merge-pdf', category: 'PDF' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', url: '/tools/split-pdf', category: 'PDF' },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', url: '/tools/compress-pdf', category: 'PDF' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.', url: '/tools/pdf-to-word', category: 'PDF' },
  { id: 'pdf-to-powerpoint', name: 'PDF to PowerPoint', description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', url: '/tools/pdf-to-powerpoint', category: 'PDF' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.', url: '/tools/pdf-to-excel', category: 'PDF' },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Make DOC and DOCX files easy to read by converting them to PDF.', url: '/tools/word-to-pdf', category: 'PDF' },
  { id: 'powerpoint-to-pdf', name: 'PowerPoint to PDF', description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', url: '/tools/powerpoint-to-pdf', category: 'PDF' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', url: '/tools/excel-to-pdf', category: 'PDF' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Extract all images that are within a PDF or convert each page to a JPG image.', url: '/tools/pdf-to-jpg', category: 'PDF' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds.', url: '/tools/jpg-to-pdf', category: 'PDF' },
  { id: 'sign-pdf', name: 'Sign PDF', description: 'Sign a document and request signatures with eSign.', url: '/tools/sign-pdf', category: 'PDF' },
  { id: 'watermark-pdf', name: 'Watermark', description: 'Stamp an image or text over your PDF in seconds.', url: '/tools/watermark-pdf', category: 'PDF' },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate your PDFs the way you need them. Even rotate multiple PDFs at once!', url: '/tools/rotate-pdf', category: 'PDF' },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert web pages to PDF with high accuracy.', url: '/tools/html-to-pdf', category: 'PDF' },
  { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove PDF password security, so you can use your PDFs however you want.', url: '/tools/unlock-pdf', category: 'PDF' },
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Protect PDF files with a password. Encrypt PDF documents.', url: '/tools/protect-pdf', category: 'PDF' },
  { id: 'text-to-pdf', name: 'Text to PDF', description: 'Convert your text files to PDF for professional sharing.', url: '/tools/text-to-pdf', category: 'PDF' },
  { id: 'pdf-to-text', name: 'PDF to Text', description: 'Extract all the text from a PDF file into a TXT document.', url: '/tools/pdf-to-text', category: 'PDF' },
  { id: 'excel-to-text', name: 'Excel to Text', description: 'Extract and convert data from Excel spreadsheets to plain text.', url: '/tools/excel-to-text', category: 'PDF' },
  { id: 'text-to-excel', name: 'Text to Excel', description: 'Convert raw text data into structured Excel spreadsheets.', url: '/tools/text-to-excel', category: 'PDF' },

  // --- IMAGE TOOLS ---
  { id: 'compress-image', name: 'Compress Image', description: 'Compress JPG, PNG, SVG or GIF with the best quality and compression.', url: '/tools/compress-image', category: 'Image' },
  { id: 'resize-image', name: 'Resize Image', description: 'Define your dimensions, by pixel or percentage, and resize your images.', url: '/tools/resize-image', category: 'Image' },
  { id: 'crop-image', name: 'Crop Image', description: 'Crop JPG, PNG or GIF with ease; Choose pixels to crop your image.', url: '/tools/crop-image', category: 'Image' },
  { id: 'convert-to-jpg', name: 'Convert to JPG', description: 'Turn PNG, GIF, TIF, PSD, SVG, WEBP, HEIC or RAW to JPG format.', url: '/tools/convert-to-jpg', category: 'Image' },
  { id: 'convert-from-jpg', name: 'Convert from JPG', description: 'Turn JPG images to PNG and GIF. Choose several JPGs to create an animated GIF!', url: '/tools/convert-from-jpg', category: 'Image' },
  { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Quickly convert PNG images to JPG format.', url: '/tools/png-to-jpg', category: 'Image' },
  { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Quickly convert JPG images to PNG format.', url: '/tools/jpg-to-png', category: 'Image' },
  { id: 'png-to-svg', name: 'PNG to SVG', description: 'Convert PNG images to SVG vector format.', url: '/tools/png-to-svg', category: 'Image' },
  { id: 'svg-to-png', name: 'SVG to PNG', description: 'Convert SVG vectors to PNG images.', url: '/tools/svg-to-png', category: 'Image' },
  { id: 'photo-editor', name: 'Photo Editor', description: 'Enliven your photos with text, effects, frames, or stickers.', url: '/tools/photo-editor', category: 'Image' },
  { id: 'watermark-image', name: 'Watermark Image', description: 'Stamp an image or text over your images in seconds.', url: '/tools/watermark-image', category: 'Image' },
  { id: 'meme-generator', name: 'Meme Generator', description: 'Create your own memes online with ease.', url: '/tools/meme-generator', category: 'Image' },
  { id: 'rotate-image', name: 'Rotate Image', description: 'Rotate multiple images at once.', url: '/tools/rotate-image', category: 'Image' },
  { id: 'html-to-image', name: 'HTML to Image', description: 'Convert web pages to JPG or SVG with high accuracy.', url: '/tools/html-to-image', category: 'Image' },

  // --- CALCULATOR TOOLS ---
  { id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate your Body Mass Index (BMI) and check your health status.', url: '/tools/bmi-calculator', category: 'Calculator' },
  { id: 'basic-calculator', name: 'Scientific Calculator', description: 'A high-performance scientific calculator inspired by the Casio ClassWiz 991EX.', url: '/tools/basic-calculator', category: 'Calculator' },
  { id: 'graphing-calculator', name: 'Graphing Calculator', description: 'Plot functions and visualize mathematical equations in real-time.', url: '/tools/graphing-calculator', category: 'Calculator' },
  { id: 'financial-calculator', name: 'Financial Calculator', description: 'Calculate simple and compound interest for your investments.', url: '/tools/financial-calculator', category: 'Calculator' },
  { id: 'emi-calculator', name: 'EMI Calculator', description: 'Calculate monthly installments for loans and mortgages.', url: '/tools/emi-calculator', category: 'Calculator' },
  { id: 'profit-loss-calc', name: 'Profit & Loss Calc', description: 'Quickly determine profit margins and loss percentages.', url: '/tools/profit-loss-calc', category: 'Calculator' },
  { id: 'depreciation-calc', name: 'Depreciation Calc', description: 'Calculate asset depreciation using various methods.', url: '/tools/depreciation-calc', category: 'Calculator' },
  { id: 'math-simplify', name: 'Simplify Expression', description: 'Reduce complex mathematical expressions to their simplest form.', url: '/tools/math-simplify', category: 'Calculator' },
  { id: 'math-factor', name: 'Factor Polynomials', description: 'Find the factors of algebraic expressions and polynomials.', url: '/tools/math-factor', category: 'Calculator' },
  { id: 'math-derivative', name: 'Derivative Calc', description: 'Compute derivatives and rates of change for any function.', url: '/tools/math-derivative', category: 'Calculator' },
  { id: 'math-integrate', name: 'Integral Calc', description: 'Calculate definite and indefinite integrals with precision.', url: '/tools/math-integrate', category: 'Calculator' },
  { id: 'math-solve', name: 'Equation Solver', description: 'Solve linear, quadratic, and complex algebraic equations.', url: '/tools/math-solve', category: 'Calculator' },
  { id: 'programmable-calculator', name: 'Programmable Calc', description: 'Execute complex logic and custom scripts for advanced calculations.', url: '/tools/programmable-calculator', category: 'Calculator' },

  // --- MEDIA TOOLS ---
  { id: 'yt-to-mp3', name: 'YouTube to MP3', description: 'Convert YouTube videos to high-quality MP3 audio.', url: '/tools/yt-to-mp3', category: 'Media' },
  { id: 'yt-to-mp4', name: 'YouTube to MP4', description: 'Download YouTube videos in MP4 format.', url: '/tools/yt-to-mp4', category: 'Media' },
  { id: 'insta-to-mp4', name: 'Instagram to MP4', description: 'Download Instagram videos in MP4 format.', url: '/tools/insta-to-mp4', category: 'Media' },
  { id: 'insta-to-mp3', name: 'Instagram to MP3', description: 'Download audio from Instagram videos in MP3 format.', url: '/tools/insta-to-mp3', category: 'Media' },
  { id: 'fb-to-mp4', name: 'Facebook to MP4', description: 'Download Facebook videos in MP4 format.', url: '/tools/fb-to-mp4', category: 'Media' },
  { id: 'fb-to-mp3', name: 'Facebook to MP3', description: 'Download audio from Facebook videos in MP3 format.', url: '/tools/fb-to-mp3', category: 'Media' },
  { id: 'video-to-mp4', name: 'Video to MP4', description: 'Convert any video format to MP4.', url: '/tools/video-to-mp4', category: 'Media' },
  { id: 'audio-to-mp3', name: 'Audio to MP3', description: 'Convert any audio format to MP3.', url: '/tools/audio-to-mp3', category: 'Media' },
  { id: 'mp4-to-mp3', name: 'MP4 to MP3', description: 'Extract audio from your MP4 videos.', url: '/tools/mp4-to-mp3', category: 'Media' },
  { id: 'wav-to-mp3', name: 'WAV to MP3', description: 'Convert WAV audio files to MP3.', url: '/tools/wav-to-mp3', category: 'Media' },
  { id: 'mp3-to-wav', name: 'MP3 to WAV', description: 'Convert MP3 audio files to WAV.', url: '/tools/mp3-to-wav', category: 'Media' },
  { id: 'video-to-gif', name: 'Video to GIF', description: 'Create animated GIFs from your video files.', url: '/tools/video-to-gif', category: 'Media' },
  { id: 'link-dumper', name: 'Bulk Link Dumper', description: 'Paste multiple links and download them all at once.', url: '/tools/link-dumper', category: 'Media' },

  // --- AI TOOLS ---
  { id: 'ai-grammar', name: 'AI Grammar Fixer', description: 'Fix grammar and spelling mistakes instantly using advanced AI.', url: '/tools/ai-grammar', category: 'AI' },
  { id: 'ai-summarizer', name: 'AI PDF Summarizer', description: 'Get the most important insights from your PDF documents using AI.', url: '/tools/ai-summarizer', category: 'AI' },
  { id: 'ai-translator', name: 'AI Translator', description: 'Translate your documents and media text into any language instantly.', url: '/tools/ai-translator', category: 'AI' },

  // --- FINANCE TOOLS ---
  { id: 'mortgage-calculator', name: 'Mortgage Calculator', description: 'Calculate monthly payments, taxes, and insurance for your home loan.', url: '/tools/mortgage-calculator', category: 'Finance' },
  { id: 'crypto-profit', name: 'Crypto Profit Calculator', description: 'Calculate your ROI and profits from cryptocurrency investments.', url: '/tools/crypto-profit', category: 'Finance' },
  { id: 'compound-interest', name: 'Compound Interest Calc', description: 'See how your savings grow over time with compound interest.', url: '/tools/compound-interest', category: 'Finance' },
  { id: 'loan-calculator', name: 'Loan Calculator', description: 'Calculate monthly payments for personal or business loans.', url: '/tools/loan-calculator', category: 'Finance' },

  // --- DEV TOOLS ---
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Clean and format your JSON code to make it readable.', url: '/tools/json-formatter', category: 'Dev' },
  { id: 'base64-encode', name: 'Base64 Encode/Decode', description: 'Encode or decode text to Base64 format.', url: '/tools/base64-encode', category: 'Dev' },
  { id: 'html-minify', name: 'HTML Minifier', description: 'Compress your HTML code for better performance.', url: '/tools/html-minify', category: 'Dev' },
  { id: 'sql-formatter', name: 'SQL Formatter', description: 'Pretty print your SQL queries.', url: '/tools/sql-formatter', category: 'Dev' },
];
