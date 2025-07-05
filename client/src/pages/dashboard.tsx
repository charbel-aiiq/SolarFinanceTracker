import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import { Link } from "wouter";
import { 
  FolderOpen, 
  DollarSign, 
  TrendingUp, 
  ArrowUp,
  Download,
  Plus,
  Zap,
  ExternalLink,
  Edit,
  AlertTriangle,
  Info
} from "lucide-react";

export default function Dashboard() {
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (projectsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Project Dashboard"
        subtitle="Manage your solar financing projects and track performance"
        actions={
          <>
            <Button variant="outline" className="text-neutral-600 border-neutral-300 hover:bg-neutral-50">
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </Button>
            <Link href="/projects/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </>
        }
      />

      <div className="p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Projects</p>
                  <p className="text-3xl font-bold text-neutral-800">
                    {stats?.totalProjects || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FolderOpen className="text-primary w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-600 font-medium">+3 this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Investment</p>
                  <p className="text-3xl font-bold text-neutral-800">
                    ${stats?.totalInvestment ? (stats.totalInvestment / 1000000).toFixed(1) : 0}M
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-600 font-medium">+12% this quarter</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Average IRR</p>
                  <p className="text-3xl font-bold text-neutral-800">
                    {stats?.avgIRR ? stats.avgIRR.toFixed(1) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-blue-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-600 font-medium">Above target</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Active Cash Flow</p>
                  <p className="text-3xl font-bold text-neutral-800">
                    ${stats?.activeCashFlow ? (stats.activeCashFlow / 1000).toFixed(0) : 0}K
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowUp className="text-green-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-600 font-medium">Monthly positive</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-800">Active Projects</h3>
                  <Link href="/projects">
                    <Button variant="ghost" className="text-sm text-primary hover:text-primary/80">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                {projects && projects.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Investment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          IRR
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {projects.map((project: any) => (
                        <tr key={project.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                <Zap className="text-primary w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-neutral-800">
                                  {project.name}
                                </div>
                                <div className="text-sm text-neutral-500">
                                  {project.location}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-neutral-800">
                              ${parseFloat(project.totalInvestment).toLocaleString()}
                            </div>
                            <div className="text-sm text-neutral-500">
                              {project.systemSize}kW System
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-green-600">
                              {project.actualIRR ? `${parseFloat(project.actualIRR).toFixed(1)}%` : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                              {project.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link href={`/projects/${project.id}`}>
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 mr-2">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-neutral-600">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-neutral-500">
                    <p>No projects found</p>
                    <Link href="/projects/new">
                      <Button className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            {/* Cash Flow Widget */}
            <Card className="bg-white shadow-sm border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-800">Cash Flow Summary</h3>
                <p className="text-sm text-neutral-500">This month</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-sm text-neutral-600">Client Payments</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    +${stats?.monthlyPayments?.clientPayments ? (stats.monthlyPayments.clientPayments / 1000).toFixed(0) : 0}K
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-3"></div>
                    <span className="text-sm text-neutral-600">Supplier Payments</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">
                    -${stats?.monthlyPayments?.supplierPayments ? (stats.monthlyPayments.supplierPayments / 1000).toFixed(0) : 0}K
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-800">Net Cash Flow</span>
                    <span className="text-sm font-bold text-green-600">
                      +${stats?.monthlyPayments?.netFlow ? (stats.monthlyPayments.netFlow / 1000).toFixed(0) : 0}K
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions Widget */}
            <Card className="bg-white shadow-sm border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-800">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Link href="/projects/new">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Project
                  </Button>
                </Link>
                <Link href="/payments">
                  <Button variant="outline" className="w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                </Link>
                <Link href="/irr">
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Calculate IRR
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Alerts Widget */}
            <Card className="bg-white shadow-sm border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-800">Alerts</h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertTriangle className="text-yellow-600 w-4 h-4 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Payment Due</p>
                    <p className="text-sm text-yellow-700">Supplier payment of $45,000 due in 3 days</p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <Info className="text-blue-600 w-4 h-4 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Project Milestone</p>
                    <p className="text-sm text-blue-700">Commercial installation 50% complete</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
