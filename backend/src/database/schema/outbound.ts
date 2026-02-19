import { pgTable, uuid, varchar, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { warehouses } from './warehouses';
import { users } from './users';
import { products } from './products';

export const outboundStatusEnum = pgEnum('outbound_status', ['DRAFT', 'APPROVED', 'PICKING', 'SHIPPED', 'CANCELLED']);

export const outboundOrders = pgTable('outbound_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  status: outboundStatusEnum('status').notNull().default('DRAFT'),
  destination: varchar('destination', { length: 255 }).notNull(),
  notes: text('notes'),
  expectedDate: timestamp('expected_date'),
  shippedDate: timestamp('shipped_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const outboundItems = pgTable('outbound_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  outboundOrderId: uuid('outbound_order_id').notNull().references(() => outboundOrders.id),
  productId: uuid('product_id').notNull().references(() => products.id),
  requestedQty: integer('requested_qty').notNull(),
  shippedQty: integer('shipped_qty').notNull().default(0),
  notes: text('notes'),
});
