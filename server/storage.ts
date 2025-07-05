import { 
  projects, 
  payments, 
  cashFlowProjections,
  suppliers,
  costComponents,
  supplierComponents,
  projectComponents,
  type Project, 
  type InsertProject,
  type Payment,
  type InsertPayment,
  type CashFlowProjection,
  type InsertCashFlowProjection,
  type Supplier,
  type InsertSupplier,
  type CostComponent,
  type InsertCostComponent,
  type SupplierComponent,
  type InsertSupplierComponent,
  type ProjectComponent,
  type InsertProjectComponent
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Payments
  getPayments(): Promise<Payment[]>;
  getPaymentsByProject(projectId: number): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;

  // Cash Flow Projections
  getCashFlowProjections(): Promise<CashFlowProjection[]>;
  getCashFlowProjectionsByProject(projectId: number): Promise<CashFlowProjection[]>;
  createCashFlowProjection(projection: InsertCashFlowProjection): Promise<CashFlowProjection>;
  updateCashFlowProjection(id: number, projection: Partial<InsertCashFlowProjection>): Promise<CashFlowProjection | undefined>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Cost Components
  getCostComponents(): Promise<CostComponent[]>;
  getCostComponent(id: number): Promise<CostComponent | undefined>;
  createCostComponent(component: InsertCostComponent): Promise<CostComponent>;
  updateCostComponent(id: number, component: Partial<InsertCostComponent>): Promise<CostComponent | undefined>;
  deleteCostComponent(id: number): Promise<boolean>;

  // Supplier Components (pricing for specific supplier-component combinations)
  getSupplierComponents(): Promise<SupplierComponent[]>;
  getSupplierComponentsBySupplier(supplierId: number): Promise<SupplierComponent[]>;
  getSupplierComponentsByComponent(componentId: number): Promise<SupplierComponent[]>;
  createSupplierComponent(supplierComponent: InsertSupplierComponent): Promise<SupplierComponent>;
  updateSupplierComponent(id: number, supplierComponent: Partial<InsertSupplierComponent>): Promise<SupplierComponent | undefined>;
  deleteSupplierComponent(id: number): Promise<boolean>;

  // Project Components (actual components used in projects)
  getProjectComponents(): Promise<ProjectComponent[]>;
  getProjectComponentsByProject(projectId: number): Promise<ProjectComponent[]>;
  createProjectComponent(projectComponent: InsertProjectComponent): Promise<ProjectComponent>;
  updateProjectComponent(id: number, projectComponent: Partial<InsertProjectComponent>): Promise<ProjectComponent | undefined>;
  deleteProjectComponent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private payments: Map<number, Payment>;
  private cashFlowProjections: Map<number, CashFlowProjection>;
  private suppliers: Map<number, Supplier>;
  private costComponents: Map<number, CostComponent>;
  private supplierComponents: Map<number, SupplierComponent>;
  private projectComponents: Map<number, ProjectComponent>;
  private currentProjectId: number;
  private currentPaymentId: number;
  private currentCashFlowId: number;
  private currentSupplierId: number;
  private currentComponentId: number;
  private currentSupplierComponentId: number;
  private currentProjectComponentId: number;

  constructor() {
    this.projects = new Map();
    this.payments = new Map();
    this.cashFlowProjections = new Map();
    this.suppliers = new Map();
    this.costComponents = new Map();
    this.supplierComponents = new Map();
    this.projectComponents = new Map();
    this.currentProjectId = 1;
    this.currentPaymentId = 1;
    this.currentCashFlowId = 1;
    this.currentSupplierId = 1;
    this.currentComponentId = 1;
    this.currentSupplierComponentId = 1;
    this.currentProjectComponentId = 1;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
      actualIRR: null,
      expectedIRR: insertProject.expectedIRR || null,
      status: insertProject.status || "active",
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectUpdate };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getPaymentsByProject(projectId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(p => p.projectId === projectId);
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: new Date(),
      isRecurring: insertPayment.isRecurring || null,
      recurringFrequency: insertPayment.recurringFrequency || null,
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, paymentUpdate: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...paymentUpdate };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async deletePayment(id: number): Promise<boolean> {
    return this.payments.delete(id);
  }

  // Cash Flow Projections
  async getCashFlowProjections(): Promise<CashFlowProjection[]> {
    return Array.from(this.cashFlowProjections.values());
  }

  async getCashFlowProjectionsByProject(projectId: number): Promise<CashFlowProjection[]> {
    return Array.from(this.cashFlowProjections.values()).filter(p => p.projectId === projectId);
  }

  async createCashFlowProjection(insertProjection: InsertCashFlowProjection): Promise<CashFlowProjection> {
    const id = this.currentCashFlowId++;
    const projection: CashFlowProjection = {
      ...insertProjection,
      id,
      actualInflow: insertProjection.actualInflow || null,
      actualOutflow: insertProjection.actualOutflow || null,
    };
    this.cashFlowProjections.set(id, projection);
    return projection;
  }

  async updateCashFlowProjection(id: number, projectionUpdate: Partial<InsertCashFlowProjection>): Promise<CashFlowProjection | undefined> {
    const projection = this.cashFlowProjections.get(id);
    if (!projection) return undefined;
    
    const updatedProjection = { ...projection, ...projectionUpdate };
    this.cashFlowProjections.set(id, updatedProjection);
    return updatedProjection;
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentSupplierId++;
    const supplier: Supplier = {
      ...insertSupplier,
      id,
      createdAt: new Date(),
      contactPerson: insertSupplier.contactPerson || null,
      email: insertSupplier.email || null,
      phone: insertSupplier.phone || null,
      address: insertSupplier.address || null,
      paymentTerms: insertSupplier.paymentTerms || null,
      creditRating: insertSupplier.creditRating || null,
      isActive: insertSupplier.isActive ?? true,
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: number, supplierUpdate: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    
    const updatedSupplier = { ...supplier, ...supplierUpdate };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Cost Components
  async getCostComponents(): Promise<CostComponent[]> {
    return Array.from(this.costComponents.values());
  }

  async getCostComponent(id: number): Promise<CostComponent | undefined> {
    return this.costComponents.get(id);
  }

  async createCostComponent(insertComponent: InsertCostComponent): Promise<CostComponent> {
    const id = this.currentComponentId++;
    const component: CostComponent = {
      id,
      name: insertComponent.name,
      category: insertComponent.category,
      unitType: insertComponent.unitType,
      basePrice: insertComponent.basePrice,
      description: insertComponent.description || null,
      isActive: insertComponent.isActive ?? true,
      createdAt: new Date(),
    };
    this.costComponents.set(id, component);
    return component;
  }

  async updateCostComponent(id: number, componentUpdate: Partial<InsertCostComponent>): Promise<CostComponent | undefined> {
    const component = this.costComponents.get(id);
    if (!component) return undefined;
    
    const updatedComponent = { ...component, ...componentUpdate };
    this.costComponents.set(id, updatedComponent);
    return updatedComponent;
  }

  async deleteCostComponent(id: number): Promise<boolean> {
    return this.costComponents.delete(id);
  }

  // Supplier Components
  async getSupplierComponents(): Promise<SupplierComponent[]> {
    return Array.from(this.supplierComponents.values());
  }

  async getSupplierComponentsBySupplier(supplierId: number): Promise<SupplierComponent[]> {
    return Array.from(this.supplierComponents.values()).filter(sc => sc.supplierId === supplierId);
  }

  async getSupplierComponentsByComponent(componentId: number): Promise<SupplierComponent[]> {
    return Array.from(this.supplierComponents.values()).filter(sc => sc.componentId === componentId);
  }

  async createSupplierComponent(insertSupplierComponent: InsertSupplierComponent): Promise<SupplierComponent> {
    const id = this.currentSupplierComponentId++;
    const supplierComponent: SupplierComponent = {
      id,
      supplierId: insertSupplierComponent.supplierId,
      componentId: insertSupplierComponent.componentId,
      price: insertSupplierComponent.price,
      leadTime: insertSupplierComponent.leadTime || null,
      minimumOrder: insertSupplierComponent.minimumOrder || null,
      paymentTerms: insertSupplierComponent.paymentTerms || null,
      isPreferred: insertSupplierComponent.isPreferred ?? false,
      createdAt: new Date(),
    };
    this.supplierComponents.set(id, supplierComponent);
    return supplierComponent;
  }

  async updateSupplierComponent(id: number, supplierComponentUpdate: Partial<InsertSupplierComponent>): Promise<SupplierComponent | undefined> {
    const supplierComponent = this.supplierComponents.get(id);
    if (!supplierComponent) return undefined;
    
    const updatedSupplierComponent = { ...supplierComponent, ...supplierComponentUpdate };
    this.supplierComponents.set(id, updatedSupplierComponent);
    return updatedSupplierComponent;
  }

  async deleteSupplierComponent(id: number): Promise<boolean> {
    return this.supplierComponents.delete(id);
  }

  // Project Components
  async getProjectComponents(): Promise<ProjectComponent[]> {
    return Array.from(this.projectComponents.values());
  }

  async getProjectComponentsByProject(projectId: number): Promise<ProjectComponent[]> {
    return Array.from(this.projectComponents.values()).filter(pc => pc.projectId === projectId);
  }

  async createProjectComponent(insertProjectComponent: InsertProjectComponent): Promise<ProjectComponent> {
    const id = this.currentProjectComponentId++;
    const projectComponent: ProjectComponent = {
      id,
      projectId: insertProjectComponent.projectId,
      componentId: insertProjectComponent.componentId,
      supplierId: insertProjectComponent.supplierId,
      quantity: insertProjectComponent.quantity,
      unitPrice: insertProjectComponent.unitPrice,
      totalCost: insertProjectComponent.totalCost,
      scheduledDate: insertProjectComponent.scheduledDate || null,
      actualDate: insertProjectComponent.actualDate || null,
      status: insertProjectComponent.status || "planned",
      paymentStatus: insertProjectComponent.paymentStatus || "pending",
      notes: insertProjectComponent.notes || null,
      createdAt: new Date(),
    };
    this.projectComponents.set(id, projectComponent);
    return projectComponent;
  }

  async updateProjectComponent(id: number, projectComponentUpdate: Partial<InsertProjectComponent>): Promise<ProjectComponent | undefined> {
    const projectComponent = this.projectComponents.get(id);
    if (!projectComponent) return undefined;
    
    const updatedProjectComponent = { ...projectComponent, ...projectComponentUpdate };
    this.projectComponents.set(id, updatedProjectComponent);
    return updatedProjectComponent;
  }

  async deleteProjectComponent(id: number): Promise<boolean> {
    return this.projectComponents.delete(id);
  }
}

import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set(projectUpdate)
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async getPaymentsByProject(projectId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.projectId, projectId));
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  async updatePayment(id: number, paymentUpdate: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [payment] = await db
      .update(payments)
      .set(paymentUpdate)
      .where(eq(payments.id, id))
      .returning();
    return payment || undefined;
  }

  async deletePayment(id: number): Promise<boolean> {
    const result = await db.delete(payments).where(eq(payments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Cash Flow Projections
  async getCashFlowProjections(): Promise<CashFlowProjection[]> {
    return await db.select().from(cashFlowProjections);
  }

  async getCashFlowProjectionsByProject(projectId: number): Promise<CashFlowProjection[]> {
    return await db.select().from(cashFlowProjections).where(eq(cashFlowProjections.projectId, projectId));
  }

  async createCashFlowProjection(insertProjection: InsertCashFlowProjection): Promise<CashFlowProjection> {
    const [projection] = await db
      .insert(cashFlowProjections)
      .values(insertProjection)
      .returning();
    return projection;
  }

  async updateCashFlowProjection(id: number, projectionUpdate: Partial<InsertCashFlowProjection>): Promise<CashFlowProjection | undefined> {
    const [projection] = await db
      .update(cashFlowProjections)
      .set(projectionUpdate)
      .where(eq(cashFlowProjections.id, id))
      .returning();
    return projection || undefined;
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers);
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db
      .insert(suppliers)
      .values(insertSupplier)
      .returning();
    return supplier;
  }

  async updateSupplier(id: number, supplierUpdate: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const [supplier] = await db
      .update(suppliers)
      .set(supplierUpdate)
      .where(eq(suppliers.id, id))
      .returning();
    return supplier || undefined;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    const result = await db.delete(suppliers).where(eq(suppliers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Cost Components
  async getCostComponents(): Promise<CostComponent[]> {
    return await db.select().from(costComponents);
  }

  async getCostComponent(id: number): Promise<CostComponent | undefined> {
    const [component] = await db.select().from(costComponents).where(eq(costComponents.id, id));
    return component || undefined;
  }

  async createCostComponent(insertComponent: InsertCostComponent): Promise<CostComponent> {
    const [component] = await db
      .insert(costComponents)
      .values(insertComponent)
      .returning();
    return component;
  }

  async updateCostComponent(id: number, componentUpdate: Partial<InsertCostComponent>): Promise<CostComponent | undefined> {
    const [component] = await db
      .update(costComponents)
      .set(componentUpdate)
      .where(eq(costComponents.id, id))
      .returning();
    return component || undefined;
  }

  async deleteCostComponent(id: number): Promise<boolean> {
    const result = await db.delete(costComponents).where(eq(costComponents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Supplier Components
  async getSupplierComponents(): Promise<SupplierComponent[]> {
    return await db.select().from(supplierComponents);
  }

  async getSupplierComponentsBySupplier(supplierId: number): Promise<SupplierComponent[]> {
    return await db.select().from(supplierComponents).where(eq(supplierComponents.supplierId, supplierId));
  }

  async getSupplierComponentsByComponent(componentId: number): Promise<SupplierComponent[]> {
    return await db.select().from(supplierComponents).where(eq(supplierComponents.componentId, componentId));
  }

  async createSupplierComponent(insertSupplierComponent: InsertSupplierComponent): Promise<SupplierComponent> {
    const [supplierComponent] = await db
      .insert(supplierComponents)
      .values(insertSupplierComponent)
      .returning();
    return supplierComponent;
  }

  async updateSupplierComponent(id: number, supplierComponentUpdate: Partial<InsertSupplierComponent>): Promise<SupplierComponent | undefined> {
    const [supplierComponent] = await db
      .update(supplierComponents)
      .set(supplierComponentUpdate)
      .where(eq(supplierComponents.id, id))
      .returning();
    return supplierComponent || undefined;
  }

  async deleteSupplierComponent(id: number): Promise<boolean> {
    const result = await db.delete(supplierComponents).where(eq(supplierComponents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Project Components
  async getProjectComponents(): Promise<ProjectComponent[]> {
    return await db.select().from(projectComponents);
  }

  async getProjectComponentsByProject(projectId: number): Promise<ProjectComponent[]> {
    return await db.select().from(projectComponents).where(eq(projectComponents.projectId, projectId));
  }

  async createProjectComponent(insertProjectComponent: InsertProjectComponent): Promise<ProjectComponent> {
    const [projectComponent] = await db
      .insert(projectComponents)
      .values(insertProjectComponent)
      .returning();
    return projectComponent;
  }

  async updateProjectComponent(id: number, projectComponentUpdate: Partial<InsertProjectComponent>): Promise<ProjectComponent | undefined> {
    const [projectComponent] = await db
      .update(projectComponents)
      .set(projectComponentUpdate)
      .where(eq(projectComponents.id, id))
      .returning();
    return projectComponent || undefined;
  }

  async deleteProjectComponent(id: number): Promise<boolean> {
    const result = await db.delete(projectComponents).where(eq(projectComponents.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
