import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertPaymentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  onSuccess: () => void;
}

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const form = useForm({
    resolver: zodResolver(insertPaymentSchema),
    defaultValues: {
      projectId: "",
      type: "client_payment",
      amount: "",
      description: "",
      paymentDate: new Date().toISOString().split('T')[0],
      isRecurring: false,
      recurringFrequency: ""
    }
  });

  const createPayment = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/payments", {
        ...data,
        projectId: parseInt(data.projectId),
        paymentDate: new Date(data.paymentDate).toISOString()
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
      onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    createPayment.mutate(data);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Record Payment</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="projectId">Project</Label>
          <Select
            onValueChange={(value) => form.setValue("projectId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project: any) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.projectId && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.projectId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="type">Payment Type</Label>
          <Select
            defaultValue="client_payment"
            onValueChange={(value) => form.setValue("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client_payment">Client Payment</SelectItem>
              <SelectItem value="supplier_payment">Supplier Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="10000"
            {...form.register("amount")}
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.amount.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Payment description"
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input
            id="paymentDate"
            type="date"
            {...form.register("paymentDate")}
          />
          {form.formState.errors.paymentDate && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.paymentDate.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={createPayment.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createPayment.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {createPayment.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Recording...
              </>
            ) : (
              "Record Payment"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
