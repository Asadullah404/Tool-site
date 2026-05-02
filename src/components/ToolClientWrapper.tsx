'use client';

import dynamic from 'next/dynamic';
import GenericToolPage from '@/components/GenericToolPage';
import { TOOLS, Tool } from '@/constants/tools';

const ImageEditorTool = dynamic(() => import('@/components/ImageEditorTool'), { ssr: false });
const PdfEditorTool = dynamic(() => import('@/components/PdfEditorTool'), { ssr: false });
const CalculatorTool = dynamic(() => import('@/components/CalculatorTool'), { ssr: false });

interface ToolClientWrapperProps {
  toolId: string;
}

export default function ToolClientWrapper({ toolId }: ToolClientWrapperProps) {
  const tool = TOOLS.find((t) => t.id === toolId);
  
  if (toolId === 'crop-image' || toolId === 'resize-image') {
    return <ImageEditorTool toolId={toolId} />;
  }
  
  if (tool?.category === 'PDF') {
    return <PdfEditorTool toolId={toolId} />;
  }

  if (tool?.category === 'Calculator') {
    return <CalculatorTool toolId={toolId} />;
  }
  
  return <GenericToolPage toolId={toolId} />;
}
