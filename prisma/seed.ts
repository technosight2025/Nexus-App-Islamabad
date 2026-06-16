import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: {
      slug: "nexus-pakistan",
    },
    update: {},
    create: {
      name: "Nexus Pakistan",
      slug: "nexus-pakistan",
    },
  });

  await prisma.user.upsert({
    where: {
      clerkId: "seed_admin",
    },
    update: {
      tenantId: tenant.id,
      role: UserRole.ADMIN,
    },
    create: {
      tenantId: tenant.id,
      clerkId: "seed_admin",
      name: "Nexus Admin",
      email: "admin@nexus.local",
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      clerkId: "seed_professional",
    },
    update: {
      tenantId: tenant.id,
      role: UserRole.PROFESSIONAL,
    },
    create: {
      tenantId: tenant.id,
      clerkId: "seed_professional",
      name: "Nexus Professional",
      email: "professional@nexus.local",
      role: UserRole.PROFESSIONAL,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
