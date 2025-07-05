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

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type CashFlowProjection = typeof cashFlowProjections.$inferSelect;
export type InsertCashFlowProjection = z.infer<typeof insertCashFlowProjectionSchema>;
