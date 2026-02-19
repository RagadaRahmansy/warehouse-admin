import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DrizzleService } from '../../database/drizzle.service';
import { warehouses } from '../../database/schema/warehouses';
import { eq, ilike, asc } from 'drizzle-orm';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto/warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private drizzleService: DrizzleService) {}

  async create(dto: CreateWarehouseDto) {
    const db = this.drizzleService.getDb();
    
    const existingCode = await db.select().from(warehouses).where(eq(warehouses.code, dto.code));
    if (existingCode.length > 0) {
      throw new ConflictException('Warehouse code already exists');
    }

    const [warehouse] = await db.insert(warehouses).values({
      name: dto.name,
      code: dto.code,
      address: dto.address,
      city: dto.city,
      phone: dto.phone,
    }).returning();

    return warehouse;
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const db = this.drizzleService.getDb();
    const offset = (page - 1) * limit;

    let query = db.select().from(warehouses);
    
    if (search) {
      query = query.where(ilike(warehouses.name, `%${search}%`));
    }

    const allWarehouses = await query.orderBy(asc(warehouses.createdAt));
    const total = allWarehouses.length;
    const data = allWarehouses.slice(offset, offset + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const db = this.drizzleService.getDb();
    const [warehouse] = await db.select().from(warehouses).where(eq(warehouses.id, id));

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async update(id: string, dto: UpdateWarehouseDto) {
    const db = this.drizzleService.getDb();
    
    const [existing] = await db.select().from(warehouses).where(eq(warehouses.id, id));
    if (!existing) {
      throw new NotFoundException('Warehouse not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const codeExists = await db.select().from(warehouses).where(eq(warehouses.code, dto.code));
      if (codeExists.length > 0) {
        throw new ConflictException('Warehouse code already exists');
      }
    }

    const [warehouse] = await db.update(warehouses).set(dto).where(eq(warehouses.id, id)).returning();

    return warehouse;
  }

  async remove(id: string) {
    const db = this.drizzleService.getDb();
    
    const [warehouse] = await db.select().from(warehouses).where(eq(warehouses.id, id));
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    await db.delete(warehouses).where(eq(warehouses.id, id));
    
    return { message: 'Warehouse deleted successfully' };
  }

  async activate(id: string) {
    const db = this.drizzleService.getDb();
    const [warehouse] = await db.update(warehouses).set({ isActive: true }).where(eq(warehouses.id, id)).returning();
    
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    
    return warehouse;
  }

  async deactivate(id: string) {
    const db = this.drizzleService.getDb();
    const [warehouse] = await db.update(warehouses).set({ isActive: false }).where(eq(warehouses.id, id)).returning();
    
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    
    return warehouse;
  }
}
