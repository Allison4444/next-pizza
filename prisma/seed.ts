import { Prisma } from '@prisma/client';
import { categories, _ingredients, products } from './constants';
import { prisma } from './prisma-client';
import { hashSync } from 'bcrypt';

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateProductItem = ({
  productId,
  pizzaType,
  size,
}: {
  productId: number;
  pizzaType?: 1 | 2;
  size?: 20 | 30 | 40;
}) => {
  return {
    productId,
    price: randomInt(190, 600),
    pizzaType,
    size,
  } as Prisma.ProductItemUncheckedCreateInput;
};

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'User Test',
        email: 'user@test.ru',
        password: hashSync('111111', 10),
        verified: new Date(),
        role: 'USER',
      },
      {
        fullName: 'Admin Admin',
        email: 'admin@test.ru',
        password: hashSync('111111', 10),
        verified: new Date(),
        role: 'ADMIN',
      },
    ],
  });

  await prisma.category.createMany({
    data: categories,
  });

  const createdCategories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
  const idxToRealCategoryId = new Map(createdCategories.map((c, i) => [i + 1, c.id]));

  await prisma.ingredient.createMany({
    data: _ingredients,
  });

  await prisma.product.createMany({
    data: products.map((p) => ({
      ...p,
      categoryId: idxToRealCategoryId.get(p.categoryId)!,
    })),
  });

  const firstCategory = await prisma.category.findFirstOrThrow({ orderBy: { id: 'asc' } });
  const ingredientsAll = await prisma.ingredient.findMany({ orderBy: { id: 'asc' } });

  const pick = (from: number, to: number) =>
    ingredientsAll.slice(from, to).map((i) => ({ id: i.id }));

  const pizza1 = await prisma.product.create({
    data: {
      name: 'Пепперони фреш',
      imageUrl:
        'https://media.dodostatic.net/image/r:233x233/11EE7D61304FAF5A98A6958F2BB2D260.webp',
      categoryId: firstCategory.id,
      ingredients: {
        connect: pick(0, 5),
      },
    },
  });

  const pizza2 = await prisma.product.create({
    data: {
      name: 'Сырная',
      imageUrl:
        'https://media.dodostatic.net/image/r:233x233/11EE7D610CF7E265B7C72BE5AE757CA7.webp',
      categoryId: firstCategory.id,
      ingredients: {
        connect: pick(5, 10),
      },
    },
  });

  const pizza3 = await prisma.product.create({
    data: {
      name: 'Чоризо фреш',
      imageUrl:
        'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp',
      categoryId: firstCategory.id,
      ingredients: {
        connect: pick(10, 40),
      },
    },
  });

  await prisma.productItem.createMany({
    data: [
      // Пицца "Пепперони фреш"
      generateProductItem({ productId: pizza1.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 40 }),

      // Пицца "Сырная"
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 30 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 40 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 20 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 40 }),

      // Пицца "Чоризо фреш"
      generateProductItem({ productId: pizza3.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 40 }),
    ],
  });

  const pizzaIds = new Set([pizza1.id, pizza2.id, pizza3.id]);
  const otherProducts = await prisma.product.findMany({
    where: { id: { notIn: Array.from(pizzaIds) } },
    orderBy: { id: 'asc' },
  });
  if (otherProducts.length) {
    await prisma.productItem.createMany({
      data: otherProducts.map((p) => generateProductItem({ productId: p.id })),
    });
  }

  const user1 = await prisma.user.findUniqueOrThrow({ where: { email: 'user@test.ru' } });
  const user2 = await prisma.user.findUniqueOrThrow({ where: { email: 'admin@test.ru' } });

  await prisma.cart.createMany({
    data: [
      {
        userId: user1.id,
        totalAmount: 0,
        token: '11111',
      },
      {
        userId: user2.id,
        totalAmount: 0,
        token: '222222',
      },
    ],
  });

  const firstCart = await prisma.cart.findFirstOrThrow({ orderBy: { id: 'asc' } });
  const firstProductItem = await prisma.productItem.findFirstOrThrow({ orderBy: { id: 'asc' } });

  await prisma.cartItem.create({
    data: {
      productItemId: firstProductItem.id,
      cartId: firstCart.id,
      quantity: 2,
      ingredients: {
        connect: ingredientsAll.slice(0, 3).map((i) => ({ id: i.id })),
      },
    },
  });
}

async function down() {
  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany();
    await tx.cart.deleteMany();
    await tx.productItem.deleteMany();
    await tx.product.deleteMany();
    await tx.ingredient.deleteMany();
    await tx.category.deleteMany();
    await tx.user.deleteMany();
  });
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
