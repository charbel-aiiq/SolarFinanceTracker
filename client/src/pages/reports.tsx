import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import { Download, FileText, TrendingUp, DollarSign } from "lucide-react";

export default function Reports() {
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: payments } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const generateReport = (type: string) => {
    // In a real app, this would generate and download the report
    console.log(`Generating ${type} report...`);
  };

  return (
    <div>
      <Header
        title="Reports & Analytics"
        subtitle="Generate financial reports and analyze project performance"
        actions={
          <Button variant="outline" className="text-neutral-600 border-neutral-300 hover:bg-neutral-50">
            <Download className="w-4 h-4 mr-2" />
            Export All Reports
          </Button>
        }
      />

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    ${stats?.totalInvestment ? (stats.totalInvestment / 1000000).toFixed(1) : 0}M
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-primary w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Average IRR</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    {stats?.avgIRR ? stats.avgIRR.toFixed(1) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Active Projects</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    {projects?.filter((p: any) => p.status === 'active').length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-neutral-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-neutral-800">Portfolio P&L Summary</h4>
                  <p className="text-sm text-neutral-500">Comprehensive profit and loss analysis</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport('pnl')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-neutral-800">Cash Flow Analysis</h4>
                  <p className="text-sm text-neutral-500">Monthly cash flow trends and projections</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport('cashflow')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-neutral-800">IRR Analysis</h4>
                  <p className="text-sm text-neutral-500">Internal rate of return by project</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport('irr')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-neutral-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Project Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-neutral-800">Project Performance</h4>
                  <p className="text-sm text-neutral-500">Individual project analysis</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport('performance')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-neutral-800">Payment History</h4>
                  <p className="text-sm text-neutral-500">Complete payment records</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport('payments')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-neutral-800">Risk Assessment</h4>
                  <p className="text-sm text-neutral-500">Project risk analysis and recommendations</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport('risk')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Performance Table */}
        <Card className="bg-white shadow-sm border-neutral-200">
          <CardHeader>
            <CardTitle>Project Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Project</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Investment</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">IRR</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-600">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project: any) => (
                      <tr key={project.id} className="border-b border-neutral-100">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-neutral-800">{project.name}</p>
                            <p className="text-sm text-neutral-500">{project.location}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">${parseFloat(project.totalInvestment).toLocaleString()}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-green-600">
                            {project.actualIRR ? `${parseFloat(project.actualIRR).toFixed(1)}%` : 'N/A'}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            On Track
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-500">No projects to analyze</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
