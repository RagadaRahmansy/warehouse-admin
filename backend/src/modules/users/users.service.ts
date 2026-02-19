import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DrizzleService } from '../../database/drizzle.service';
import { users } from '../../database/schema/users';
import { eq, ilike, asc } from 'drizzle-orm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private drizzleService: DrizzleService) {}

  async create(dto: CreateUserDto) {
    const db = this.drizzleService.getDb();
    
    const existingUser = await db.select().from(users).where(eq(users.email, dto.email));
    if (existingUser.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    
    const [user] = await db.insert(users).values({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      isActive: dto.isActive ?? true,
    }).returning();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const db = this.drizzleService.getDb();
    const offset = (page - 1) * limit;

    let query = db.select().from(users);
    
    if (search) {
      query = query.where(ilike(users.name, `%${search}%`));
    }

    const allUsers = await query.orderBy(asc(users.createdAt));
    const total = allUsers.length;
    const data = allUsers.slice(offset, offset + limit).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
    }));

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
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    const db = this.drizzleService.getDb();
    
    const [existingUser] = await db.select().from(users).where(eq(users.id, id));
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await db.select().from(users).where(eq(users.email, dto.email));
      if (emailExists.length > 0) {
        throw new ConflictException('Email already exists');
      }
    }

    const updateData: any = { ...dto };
    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
      delete updateData.password;
    }
    updateData.updatedAt = new Date();

    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      updatedAt: user.updatedAt,
    };
  }

  async remove(id: string) {
    const db = this.drizzleService.getDb();
    
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await db.delete(users).where(eq(users.id, id));
    
    return { message: 'User deleted successfully' };
  }
}
