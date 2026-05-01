import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.users.findUnique({ where: { email: createUserDto.email } });
    if (existing) throw new ConflictException('Email já existe');

    const hash = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.users.create({
      data: {
        ...createUserDto,
        password: hash,
      },
      select: { id: true, name: true, email: true, role: true, created_at: true },
    });
  }

  async findAll() {
    return this.prisma.users.findMany({
      select: { id: true, name: true, email: true, role: true, created_at: true },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilizador não encontrado');
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // verifica existência
    const data: any = { ...updateUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.users.update({ where: { id }, data, select: { id: true, name: true, email: true, role: true, created_at: true } });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.users.delete({ where: { id } });
    return { message: 'Utilizador removido' };
  }
}
