import { pgTable, uuid, varchar, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { warehouses } from './warehouses';
import { users } from './users';
import { products } from './products';

export const transferStatusEnum = pgEnum('transfer_status', ['PENDING', 'APPROVED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED']);

export const stockTransfers = pgTable('stock_transfers', {
  id: uuid('id').defaultRandom().primaryKey(),
  transferNumber: varchar('transfer_number', { length: 50 }).notNull().unique(),
  fromWarehouseId: uuid('from_warehouse_id').notNull().references(() => warehouses.id),
  toWarehouseId: uuid('to_warehouse_id').notNull().references(() => warehouses.id),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  status: transferStatusEnum('status').notNull().default('PENDING'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transferItems = pgTable('transfer_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  transferId: uuid('transfer_id').notNull().references(() => stockTransfers.id),
  productId: uuid('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
});
