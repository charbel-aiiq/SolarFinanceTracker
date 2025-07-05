import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/layout/header";
import ComponentForm from "@/components/components/component-form";
import { Plus, Edit, Trash2, Download, Package } from "lucide-react";

export default function Components() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { data: components, isLoading } = useQuery({
    queryKey: ["/api/cost-components"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'solar_panels': 'bg-blue-100 text-blue-600',
      'inverters': 'bg-green-100 text-green-600',
      'mounting': 'bg-gray-100 text-gray-600',
      'labor': 'bg-purple-100 text-purple-600',
      'permits': 'bg-orange-100 text-orange-600',
      'electrical': 'bg-yellow-100 text-yellow-600',
    };
    return colors[category] || 'bg-neutral-100 text-neutral-600';
  };

  return (
    <div>
      <Header
        title="Cost Components"
        subtitle="Manage reusable cost components for your solar projects"
        actions={
          <>
            <Button variant="outline" className="text-neutral-600 border-neutral-300 hover:bg-neutral-50">
              <Download className="w-4 h-4 mr-2" />
              Export Components
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Component
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <ComponentForm onSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="p-6">
        {components && components.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component: any) => (
              <Card key={component.id} className="bg-white shadow-sm border-neutral-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="text-green-600 w-6 h-6" />
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className={getCategoryColor(component.category)}>
                        {component.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant={component.isActive ? 'default' : 'secondary'}>
                        {component.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    {component.name}
                  </h3>
                  
                  {component.description && (
                    <p className="text-sm text-neutral-500 mb-4">
                      {component.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Base Price:</span>
                      <span className="font-medium">
                        ${parseFloat(component.basePrice).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Unit Type:</span>
                      <span className="font-medium capitalize">
                        {component.unitType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Suppliers
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">No components yet</h3>
            <p className="text-neutral-500 mb-6">
              Create reusable cost components that can be used across multiple solar projects
            </p>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Component
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <ComponentForm onSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}