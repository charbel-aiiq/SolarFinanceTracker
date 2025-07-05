import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/layout/header";
import ProjectForm from "@/components/projects/project-form";
import { Link } from "wouter";
import { Plus, Zap, ExternalLink, Edit, Trash2, Download } from "lucide-react";

export default function Projects() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
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
        title="All Projects"
        subtitle="Manage your solar financing projects"
        actions={
          <>
            <Button variant="outline" className="text-neutral-600 border-neutral-300 hover:bg-neutral-50">
              <Download className="w-4 h-4 mr-2" />
              Export Projects
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <ProjectForm onSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="p-6">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <Card key={project.id} className="bg-white shadow-sm border-neutral-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="text-primary w-6 h-6" />
                    </div>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    {project.name}
                  </h3>
                  
                  <p className="text-sm text-neutral-500 mb-4">
                    {project.location}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Investment:</span>
                      <span className="font-medium">
                        ${parseFloat(project.totalInvestment).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">System Size:</span>
                      <span className="font-medium">{project.systemSize}kW</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">IRR:</span>
                      <span className="font-medium text-green-600">
                        {project.actualIRR ? `${parseFloat(project.actualIRR).toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
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
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">No projects yet</h3>
            <p className="text-neutral-500 mb-6">
              Create your first solar financing project to get started
            </p>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <ProjectForm onSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
