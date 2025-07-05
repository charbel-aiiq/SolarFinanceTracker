import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CashFlowChartProps {
  data: any[];
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  // This is a placeholder for a chart component
  // In a real app, you would use a charting library like recharts, Chart.js, or D3
  
  return (
    <Card className="bg-white shadow-sm border-neutral-200">
      <CardHeader>
        <CardTitle>Cash Flow Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
          <p className="text-neutral-500">Chart visualization coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
