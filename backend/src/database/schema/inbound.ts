import { pgTable, uuid, varchar, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { warehouses } from './warehouses';
import { suppliers } from './suppliers';
import { users } from './users';
import { products } from './products';

export const inboundStatusEnum = pgEnum('inbound_status', ['DRAFT', 'APPROVED', 'RECEIVING', 'COMPLETED', 'CANCELLED']);

export const inboundOrders = pgTable('inbound_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id),
  supplierId: uuid('supplier_id').notNull().references(() => suppliers.id),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  status: inboundStatusEnum('status').notNull().default('DRAFT'),
  notes: text('notes'),
  expectedDate: timestamp('expected_date'),
  receivedDate: timestamp('received_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const inboundItems = pgTable('inbound_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  inboundOrderId: uuid('inbound_order_id').notNull().references(() => inboundOrders.id),
  productId: uuid('product_id').notNull().references(() => products.id),
  expectedQty: integer('expected_qty').notNull(),
  receivedQty: integer('received_qty').notNull().default(0),
  notes: text('notes'),
});
