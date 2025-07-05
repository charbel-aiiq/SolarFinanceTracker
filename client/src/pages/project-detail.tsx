import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import { Zap, DollarSign, TrendingUp, Calendar, MapPin, User, Edit, Download } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  
  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: payments } = useQuery({
    queryKey: [`/api/projects/${id}/payments`],
    enabled: !!id,
  });

  const { data: irr } = useQuery({
    queryKey: [`/api/projects/${id}/irr`],
    enabled: !!id,
  });

  const { data: pnl } = useQuery({
    queryKey: [`/api/projects/${id}/pnl`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Project Not Found</h2>
          <p className="text-neutral-500">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={project.name}
        subtitle={`${project.location} • ${project.systemSize}kW System`}
        actions={
          <>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
          </>
        }
      />

      <div className="p-6">
        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Investment</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    ${parseFloat(project.totalInvestment).toLocaleString()}
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
                  <p className="text-sm font-medium text-neutral-500">System Size</p>
                  <p className="text-2xl font-bold text-neutral-800">{project.systemSize}kW</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="text-green-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Current IRR</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    {irr?.irr ? `${irr.irr.toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-blue-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Status</p>
                  <div className="mt-2">
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-purple-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Location:</span>
                    <span className="font-medium">{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">System Size:</span>
                    <span className="font-medium">{project.systemSize}kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Client:</span>
                    <span className="font-medium">{project.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Expected IRR:</span>
                    <span className="font-medium">
                      {project.expectedIRR ? `${parseFloat(project.expectedIRR).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Created:</span>
                    <span className="font-medium">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Name:</span>
                    <span className="font-medium">{project.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Total Payments:</span>
                    <span className="font-medium">
                      {payments?.filter((p: any) => p.type === 'client_payment').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Total Received:</span>
                    <span className="font-medium">
                      ${payments?.filter((p: any) => p.type === 'client_payment')
                        .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0)
                        .toLocaleString() || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Client Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  {payments?.filter((p: any) => p.type === 'client_payment').length > 0 ? (
                    <div className="space-y-4">
                      {payments
                        .filter((p: any) => p.type === 'client_payment')
                        .map((payment: any) => (
                          <div key={payment.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-sm text-neutral-500">
                                {new Date(payment.paymentDate).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="font-bold text-green-600">
                              +${parseFloat(payment.amount).toLocaleString()}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500 text-center py-8">No client payments recorded</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Supplier Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  {payments?.filter((p: any) => p.type === 'supplier_payment').length > 0 ? (
                    <div className="space-y-4">
                      {payments
                        .filter((p: any) => p.type === 'supplier_payment')
                        .map((payment: any) => (
                          <div key={payment.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-sm text-neutral-500">
                                {new Date(payment.paymentDate).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="font-bold text-red-600">
                              -${parseFloat(payment.amount).toLocaleString()}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500 text-center py-8">No supplier payments recorded</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>IRR Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Expected IRR:</span>
                    <span className="font-medium">
                      {project.expectedIRR ? `${parseFloat(project.expectedIRR).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Actual IRR:</span>
                    <span className="font-medium">
                      {irr?.irr ? `${irr.irr.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Variance:</span>
                    <span className={`font-medium ${
                      irr?.irr && project.expectedIRR && irr.irr > parseFloat(project.expectedIRR) 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {irr?.irr && project.expectedIRR 
                        ? `${(irr.irr - parseFloat(project.expectedIRR)).toFixed(1)}%` 
                        : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>P&L Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Total Income:</span>
                    <span className="font-medium text-green-600">
                      ${pnl?.totalIncome?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Total Expenses:</span>
                    <span className="font-medium text-red-600">
                      ${pnl?.totalExpenses?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-neutral-500">Net Profit:</span>
                    <span className={`font-bold ${
                      pnl?.netProfit && pnl.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${pnl?.netProfit?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Profit Margin:</span>
                    <span className="font-medium">
                      {pnl?.profitMargin ? `${pnl.profitMargin.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-500 text-center py-8">
                  Cash flow projections feature coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
