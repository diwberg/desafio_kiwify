import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@casafacil.com.br';
  const password = 'admin123321';
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: hashed },
    create: {
      email,
      name: 'Administrador',
      password: hashed,
      cpf: '00000000000',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      role: 'ADMIN',
      emailVerified: true,
      banned: false,
    },
  });
  console.log('✅ Admin seeded!');
}

main().finally(() => prisma.$disconnect());
