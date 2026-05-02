import ToolClientWrapper from '@/components/ToolClientWrapper';
import { TOOLS } from '@/constants/tools';

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    toolId: tool.id,
  }));
}

export default async function ToolPage({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  return <ToolClientWrapper toolId={toolId} />;
}
