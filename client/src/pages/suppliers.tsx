import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/layout/header";
import SupplierForm from "@/components/suppliers/supplier-form";
import { Plus, Edit, Trash2, Download, User } from "lucide-react";

export default function Suppliers() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["/api/suppliers"],
  });

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
        title="Supplier Management"
        subtitle="Manage your solar project suppliers and vendors"
        actions={
          <>
            <Button variant="outline" className="text-neutral-600 border-neutral-300 hover:bg-neutral-50">
              <Download className="w-4 h-4 mr-2" />
              Export Suppliers
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <SupplierForm onSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="p-6">
        {suppliers && suppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier: any) => (
              <Card key={supplier.id} className="bg-white shadow-sm border-neutral-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="text-blue-600 w-6 h-6" />
                    </div>
                    <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
                      {supplier.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    {supplier.name}
                  </h3>
                  
                  {supplier.contactPerson && (
                    <p className="text-sm text-neutral-500 mb-2">
                      Contact: {supplier.contactPerson}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {supplier.email && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Email:</span>
                        <span className="font-medium">{supplier.email}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Phone:</span>
                        <span className="font-medium">{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.paymentTerms && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Payment Terms:</span>
                        <span className="font-medium">{supplier.paymentTerms}</span>
                      </div>
                    )}
                    {supplier.creditRating && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Credit Rating:</span>
                        <Badge variant="outline" className="text-xs">
                          {supplier.creditRating}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Components
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">No suppliers yet</h3>
            <p className="text-neutral-500 mb-6">
              Add your first supplier to start managing your solar project components and costs
            </p>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <SupplierForm onSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}