import { FileText, Image, File, Grid3X3 } from 'lucide-react';

export const formatConfig = {
  pdf: { icon: FileText, name: 'PDF', accept: ['.pdf'], color: 'text-red-500' },
  word: { icon: FileText, name: 'Word', accept: ['.doc', '.docx'], color: 'text-blue-500' },
  excel: { icon: Grid3X3, name: 'Excel', accept: ['.xls', '.xlsx'], color: 'text-green-500' },
  powerpoint: { icon: FileText, name: 'PowerPoint', accept: ['.ppt', '.pptx'], color: 'text-orange-500' },
  jpg: { icon: Image, name: 'JPG', accept: ['.jpg', '.jpeg'], color: 'text-purple-500' },
  png: { icon: Image, name: 'PNG', accept: ['.png'], color: 'text-indigo-500' },
  text: { icon: File, name: 'Text', accept: ['.txt'], color: 'text-gray-500' },
  json: { icon: File, name: 'JSON', accept: ['.json'], color: 'text-yellow-500' },
};