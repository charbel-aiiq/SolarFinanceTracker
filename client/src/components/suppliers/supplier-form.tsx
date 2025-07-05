import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertSupplierSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface SupplierFormProps {
  onSuccess: () => void;
}

export default function SupplierForm({ onSuccess }: SupplierFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      paymentTerms: "",
      creditRating: "",
      isActive: true
    }
  });

  const createSupplier = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/suppliers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({
        title: "Success",
        description: "Supplier created successfully",
      });
      onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create supplier. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    createSupplier.mutate(data);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Add New Supplier</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="name">Supplier Name *</Label>
          <Input
            id="name"
            placeholder="Enter supplier name"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            placeholder="Primary contact name"
            {...form.register("contactPerson")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@supplier.com"
              {...form.register("email")}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              {...form.register("phone")}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Business address"
            {...form.register("address")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Select onValueChange={(value) => form.setValue("paymentTerms", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">Cash on Delivery</SelectItem>
                <SelectItem value="Net 15">Net 15 days</SelectItem>
                <SelectItem value="Net 30">Net 30 days</SelectItem>
                <SelectItem value="Net 45">Net 45 days</SelectItem>
                <SelectItem value="Net 60">Net 60 days</SelectItem>
                <SelectItem value="Net 90">Net 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="creditRating">Credit Rating</Label>
            <Select onValueChange={(value) => form.setValue("creditRating", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A - Excellent</SelectItem>
                <SelectItem value="B">B - Good</SelectItem>
                <SelectItem value="C">C - Fair</SelectItem>
                <SelectItem value="D">D - Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={createSupplier.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createSupplier.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {createSupplier.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Supplier"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}