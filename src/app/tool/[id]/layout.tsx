import { mockTools } from "@/data/mockTools";

export function generateStaticParams() {
  return mockTools.map((tool) => ({ id: String(tool.id) }));
}

export default function ToolDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
