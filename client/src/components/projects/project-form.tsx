import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertProjectSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ProjectFormProps {
  onSuccess: () => void;
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      location: "",
      systemSize: "",
      totalInvestment: "",
      clientName: "",
      expectedIRR: "",
      status: "active"
    }
  });

  const createProject = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    createProject.mutate(data);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Create New Solar Project</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            placeholder="Enter project name"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Project location"
            {...form.register("location")}
          />
          {form.formState.errors.location && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.location.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="systemSize">System Size (kW)</Label>
            <Input
              id="systemSize"
              type="number"
              placeholder="50"
              {...form.register("systemSize")}
            />
            {form.formState.errors.systemSize && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.systemSize.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="totalInvestment">Total Investment ($)</Label>
            <Input
              id="totalInvestment"
              type="number"
              placeholder="125000"
              {...form.register("totalInvestment")}
            />
            {form.formState.errors.totalInvestment && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.totalInvestment.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            placeholder="Client name"
            {...form.register("clientName")}
          />
          {form.formState.errors.clientName && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.clientName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="expectedIRR">Expected IRR (%)</Label>
          <Input
            id="expectedIRR"
            type="number"
            step="0.1"
            placeholder="8.5"
            {...form.register("expectedIRR")}
          />
          {form.formState.errors.expectedIRR && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.expectedIRR.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue="active"
            onValueChange={(value) => form.setValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={createProject.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createProject.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {createProject.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
