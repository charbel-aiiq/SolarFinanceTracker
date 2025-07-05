import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  systemSize: decimal("system_size", { precision: 10, scale: 2 }).notNull(),
  totalInvestment: decimal("total_investment", { precision: 12, scale: 2 }).notNull(),
  clientName: text("client_name").notNull(),
  expectedIRR: decimal("expected_irr", { precision: 5, scale: 2 }),
  actualIRR: decimal("actual_irr", { precision: 5, scale: 2 }),
  status: text("status").notNull().default("active"), // active, in_progress, completed, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  type: text("type").notNull(), // client_payment, supplier_payment
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description").notNull(),
  paymentDate: timestamp("payment_date").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  recurringFrequency: text("recurring_frequency"), // monthly, quarterly, annual
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  paymentTerms: text("payment_terms"), // e.g., "Net 30", "Net 60", "COD"
  creditRating: text("credit_rating"), // A, B, C rating system
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const costComponents = pgTable("cost_components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // solar_panels, inverters, mounting, labor, permits, etc.
  description: text("description"),
  unitType: text("unit_type").notNull(), // per_kw, per_panel, fixed, per_hour
  basePrice: decimal("base_price", { precision: 12, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const supplierComponents = pgTable("supplier_components", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
  componentId: integer("component_id").notNull().references(() => costComponents.id),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  leadTime: integer("lead_time"), // days
  minimumOrder: decimal("minimum_order", { precision: 12, scale: 2 }),
  paymentTerms: text("payment_terms"), // specific terms for this supplier-component combo
  isPreferred: boolean("is_preferred").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projectComponents = pgTable("project_components", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  componentId: integer("component_id").notNull().references(() => costComponents.id),
  supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull(),
  scheduledDate: timestamp("scheduled_date"),
  actualDate: timestamp("actual_date"),
  status: text("status").notNull().default("planned"), // planned, ordered, delivered, installed
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, overdue
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cashFlowProjections = pgTable("cash_flow_projections", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  projectedInflow: decimal("projected_inflow", { precision: 12, scale: 2 }).notNull(),
  projectedOutflow: decimal("projected_outflow", { precision: 12, scale: 2 }).notNull(),
  actualInflow: decimal("actual_inflow", { precision: 12, scale: 2 }),
  actualOutflow: decimal("actual_outflow", { precision: 12, scale: 2 }),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  actualIRR: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertCashFlowProjectionSchema = createInsertSchema(cashFlowProjections).omit({
  id: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export const insertCostComponentSchema = createInsertSchema(costComponents).omit({
  id: true,
  createdAt: true,
});

export const insertSupplierComponentSchema = createInsertSchema(supplierComponents).omit({
  id: true,
  createdAt: true,
});

export const insertProjectComponentSchema = createInsertSchema(projectComponents).omit({
  id: true,
  createdAt: true,
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type CashFlowProjection = typeof cashFlowProjections.$inferSelect;
export type InsertCashFlowProjection = z.infer<typeof insertCashFlowProjectionSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type CostComponent = typeof costComponents.$inferSelect;
export type InsertCostComponent = z.infer<typeof insertCostComponentSchema>;
export type SupplierComponent = typeof supplierComponents.$inferSelect;
export type InsertSupplierComponent = z.infer<typeof insertSupplierComponentSchema>;
export type ProjectComponent = typeof projectComponents.$inferSelect;
export type InsertProjectComponent = z.infer<typeof insertProjectComponentSchema>;
