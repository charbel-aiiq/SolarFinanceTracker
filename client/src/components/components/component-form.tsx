import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCostComponentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ComponentFormProps {
  onSuccess: () => void;
}

export default function ComponentForm({ onSuccess }: ComponentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(insertCostComponentSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      unitType: "",
      basePrice: "",
      isActive: true
    }
  });

  const createComponent = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/cost-components", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cost-components"] });
      toast({
        title: "Success",
        description: "Cost component created successfully",
      });
      onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create component. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    createComponent.mutate(data);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Add New Cost Component</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="name">Component Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Solar Panel - 300W Monocrystalline"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select onValueChange={(value) => form.setValue("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solar_panels">Solar Panels</SelectItem>
              <SelectItem value="inverters">Inverters</SelectItem>
              <SelectItem value="mounting">Mounting Systems</SelectItem>
              <SelectItem value="electrical">Electrical Components</SelectItem>
              <SelectItem value="labor">Labor</SelectItem>
              <SelectItem value="permits">Permits & Fees</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Detailed description of the component"
            {...form.register("description")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="unitType">Unit Type *</Label>
            <Select onValueChange={(value) => form.setValue("unitType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_kw">Per kW</SelectItem>
                <SelectItem value="per_panel">Per Panel</SelectItem>
                <SelectItem value="per_unit">Per Unit</SelectItem>
                <SelectItem value="per_hour">Per Hour</SelectItem>
                <SelectItem value="fixed">Fixed Cost</SelectItem>
                <SelectItem value="per_sq_ft">Per Square Foot</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.unitType && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.unitType.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="basePrice">Base Price ($) *</Label>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              placeholder="250.00"
              {...form.register("basePrice")}
            />
            {form.formState.errors.basePrice && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.basePrice.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={createComponent.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createComponent.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {createComponent.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Component"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}