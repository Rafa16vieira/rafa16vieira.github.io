import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ChartCard({ title, children, className }) {
  return (
    <Card className={`bg-white border-0 shadow-sm ${className || ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}