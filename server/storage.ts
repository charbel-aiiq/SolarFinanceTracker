import { 
  projects, 
  payments, 
  cashFlowProjections,
  type Project, 
  type InsertProject,
  type Payment,
  type InsertPayment,
  type CashFlowProjection,
  type InsertCashFlowProjection
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
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private payments: Map<number, Payment>;
  private cashFlowProjections: Map<number, CashFlowProjection>;
  private currentProjectId: number;
  private currentPaymentId: number;
  private currentCashFlowId: number;

  constructor() {
    this.projects = new Map();
    this.payments = new Map();
    this.cashFlowProjections = new Map();
    this.currentProjectId = 1;
    this.currentPaymentId = 1;
    this.currentCashFlowId = 1;
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
}

export const storage = new MemStorage();
