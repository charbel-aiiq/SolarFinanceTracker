import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, 
  insertPaymentSchema, 
  insertCashFlowProjectionSchema,
  insertSupplierSchema,
  insertCostComponentSchema,
  insertSupplierComponentSchema,
  insertProjectComponentSchema
} from "@shared/schema";
import { calculateIRR, calculatePnL } from "./utils/financial";

export async function registerRoutes(app: Express): Promise<Server> {
  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Payment routes
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.get("/api/projects/:id/payments", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const payments = await storage.getPaymentsByProject(projectId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data" });
    }
  });

  app.patch("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(id, validatedData);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data" });
    }
  });

  app.delete("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePayment(id);
      if (!deleted) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payment" });
    }
  });

  // Cash flow projections routes
  app.get("/api/cash-flow-projections", async (req, res) => {
    try {
      const projections = await storage.getCashFlowProjections();
      res.json(projections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cash flow projections" });
    }
  });

  app.get("/api/projects/:id/cash-flow-projections", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const projections = await storage.getCashFlowProjectionsByProject(projectId);
      res.json(projections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cash flow projections" });
    }
  });

  app.post("/api/cash-flow-projections", async (req, res) => {
    try {
      const validatedData = insertCashFlowProjectionSchema.parse(req.body);
      const projection = await storage.createCashFlowProjection(validatedData);
      res.status(201).json(projection);
    } catch (error) {
      res.status(400).json({ message: "Invalid cash flow projection data" });
    }
  });

  // Financial calculations
  app.get("/api/projects/:id/irr", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const payments = await storage.getPaymentsByProject(projectId);
      const irr = calculateIRR(payments);
      res.json({ irr });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate IRR" });
    }
  });

  app.get("/api/projects/:id/pnl", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const payments = await storage.getPaymentsByProject(projectId);
      const pnl = calculatePnL(payments);
      res.json(pnl);
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate P&L" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const payments = await storage.getPayments();
      
      const totalProjects = projects.length;
      const totalInvestment = projects.reduce((sum, p) => sum + parseFloat(p.totalInvestment), 0);
      const avgIRR = projects.reduce((sum, p) => sum + (parseFloat(p.actualIRR || "0")), 0) / totalProjects;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyPayments = payments.filter(p => {
        const paymentDate = new Date(p.paymentDate);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      });
      
      const clientPayments = monthlyPayments
        .filter(p => p.type === "client_payment")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      const supplierPayments = monthlyPayments
        .filter(p => p.type === "supplier_payment")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      const activeCashFlow = clientPayments - supplierPayments;

      res.json({
        totalProjects,
        totalInvestment,
        avgIRR,
        activeCashFlow,
        monthlyPayments: {
          clientPayments,
          supplierPayments,
          netFlow: activeCashFlow
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Supplier routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplier(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.patch("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(id, validatedData);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSupplier(id);
      if (!deleted) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // Cost Component routes
  app.get("/api/cost-components", async (req, res) => {
    try {
      const components = await storage.getCostComponents();
      res.json(components);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cost components" });
    }
  });

  app.post("/api/cost-components", async (req, res) => {
    try {
      const validatedData = insertCostComponentSchema.parse(req.body);
      const component = await storage.createCostComponent(validatedData);
      res.status(201).json(component);
    } catch (error) {
      res.status(400).json({ message: "Invalid cost component data" });
    }
  });

  // Supplier Component routes (pricing for supplier-component combinations)
  app.get("/api/supplier-components", async (req, res) => {
    try {
      const supplierComponents = await storage.getSupplierComponents();
      res.json(supplierComponents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier components" });
    }
  });

  app.get("/api/suppliers/:id/components", async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      const supplierComponents = await storage.getSupplierComponentsBySupplier(supplierId);
      res.json(supplierComponents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier components" });
    }
  });

  app.post("/api/supplier-components", async (req, res) => {
    try {
      const validatedData = insertSupplierComponentSchema.parse(req.body);
      const supplierComponent = await storage.createSupplierComponent(validatedData);
      res.status(201).json(supplierComponent);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier component data" });
    }
  });

  // Project Component routes (actual components used in projects)
  app.get("/api/project-components", async (req, res) => {
    try {
      const projectComponents = await storage.getProjectComponents();
      res.json(projectComponents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project components" });
    }
  });

  app.get("/api/projects/:id/components", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const projectComponents = await storage.getProjectComponentsByProject(projectId);
      res.json(projectComponents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project components" });
    }
  });

  app.post("/api/project-components", async (req, res) => {
    try {
      const validatedData = insertProjectComponentSchema.parse(req.body);
      const projectComponent = await storage.createProjectComponent(validatedData);
      res.status(201).json(projectComponent);
    } catch (error) {
      res.status(400).json({ message: "Invalid project component data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
