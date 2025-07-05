import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import PaymentForm from "@/components/payments/payment-form";
import { Plus, Download, ArrowUp, ArrowDown } from "lucide-react";

export default function Payments() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const clientPayments = payments?.filter((p: any) => p.type === 'client_payment') || [];
  const supplierPayments = payments?.filter((p: any) => p.type === 'supplier_payment') || [];

  const getProjectName = (projectId: number) => {
    const project = projects?.find((p: any) => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Payments"
        subtitle="Manage client and supplier payments"
        actions={
          <>
            <Button variant="outline" className="text-neutral-600 border-neutral-300 hover:bg-neutral-50">
              <Download className="w-4 h-4 mr-2" />
              Export Payments
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <PaymentForm onSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="client">Client Payments</TabsTrigger>
            <TabsTrigger value="supplier">Supplier Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {payments && payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment: any) => (
                  <Card key={payment.id} className="bg-white shadow-sm border-neutral-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            payment.type === 'client_payment' 
                              ? 'bg-green-100' 
                              : 'bg-red-100'
                          }`}>
                            {payment.type === 'client_payment' ? (
                              <ArrowUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowDown className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-800">
                              {payment.description}
                            </h3>
                            <p className="text-sm text-neutral-500">
                              {getProjectName(payment.projectId)} • {new Date(payment.paymentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            payment.type === 'client_payment' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {payment.type === 'client_payment' ? '+' : '-'}${parseFloat(payment.amount).toLocaleString()}
                          </p>
                          <Badge variant={payment.type === 'client_payment' ? 'default' : 'destructive'}>
                            {payment.type === 'client_payment' ? 'Client' : 'Supplier'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-500 mb-6">No payments recorded yet</p>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Record Your First Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <PaymentForm onSuccess={() => setIsFormOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>

          <TabsContent value="client" className="space-y-6">
            {clientPayments.length > 0 ? (
              <div className="space-y-4">
                {clientPayments.map((payment: any) => (
                  <Card key={payment.id} className="bg-white shadow-sm border-neutral-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <ArrowUp className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-800">
                              {payment.description}
                            </h3>
                            <p className="text-sm text-neutral-500">
                              {getProjectName(payment.projectId)} • {new Date(payment.paymentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            +${parseFloat(payment.amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-500">No client payments recorded</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="supplier" className="space-y-6">
            {supplierPayments.length > 0 ? (
              <div className="space-y-4">
                {supplierPayments.map((payment: any) => (
                  <Card key={payment.id} className="bg-white shadow-sm border-neutral-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <ArrowDown className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-800">
                              {payment.description}
                            </h3>
                            <p className="text-sm text-neutral-500">
                              {getProjectName(payment.projectId)} • {new Date(payment.paymentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">
                            -${parseFloat(payment.amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-500">No supplier payments recorded</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
