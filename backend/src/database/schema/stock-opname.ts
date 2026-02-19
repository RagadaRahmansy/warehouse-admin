import { pgTable, uuid, varchar, text, integer, timestamp, date, pgEnum } from 'drizzle-orm/pg-core';
import { warehouses } from './warehouses';
import { users } from './users';
import { products } from './products';

export const opnameStatusEnum = pgEnum('opname_status', ['IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'CANCELLED']);

export const stockOpname = pgTable('stock_opname', {
  id: uuid('id').defaultRandom().primaryKey(),
  opnameNumber: varchar('opname_number', { length: 50 }).notNull().unique(),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  status: opnameStatusEnum('status').notNull().default('IN_PROGRESS'),
  opnameDate: date('opname_date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const stockOpnameItems = pgTable('stock_opname_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  stockOpnameId: uuid('stock_opname_id').notNull().references(() => stockOpname.id),
  productId: uuid('product_id').notNull().references(() => products.id),
  systemQty: integer('system_qty').notNull(),
  actualQty: integer('actual_qty'),
  difference: integer('difference'),
  notes: text('notes'),
});
