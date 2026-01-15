const { PrismaClient } = require('@prisma/client');
const { hashSync } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = hashSync('admin123', 8);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@strongfitness.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@strongfitness.com',
      password_hash: passwordHash,
      role: 'ADMIN',
    },
  });

  const categoriesData = [
    { name: 'Suplementos' },
    { name: 'Acessorios' },
    { name: 'Vestuário' },
  ];

  const categories = [];

  for (const data of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });

    categories.push(category);
  }

  const supplementsCategory = categories[0];

  await prisma.product.createMany({
    data: [
      {
        name: 'Whey Protein Isolate',
        description: 'Whey protein de alta qualidade',
        price: 49.99,
        stock: 100,
        status: 'ACTIVE',
        image_url: 'https://placehold.co/600x400',
        category_id: supplementsCategory.id,
      },
      {
        name: 'Creatina Monohidratada',
        description: 'Creatina pura para ganho de força e massa',
        price: 29.99,
        stock: 150,
        status: 'ACTIVE',
        image_url: 'https://placehold.co/600x400',
        category_id: supplementsCategory.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed concluído com sucesso. Admin e dados iniciais criados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

