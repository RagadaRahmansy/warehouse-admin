import { pgTable, uuid, integer, varchar, timestamp, unique } from 'drizzle-orm/pg-core';
import { warehouses } from './warehouses';
import { products } from './products';

export const inventory = pgTable('inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id),
  productId: uuid('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull().default(0),
  locationCode: varchar('location_code', { length: 50 }),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
}, (table) => ({
  warehouseProductUnique: unique('warehouse_product_unique').on(table.warehouseId, table.productId),
}));
