import { db } from "../lib/db-script";
import { UserStatus } from "@prisma/client";

// Temporary UserRole type until Prisma regenerates
type UserRole = "ADMIN" | "USER" | "MODERATOR";

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.user.deleteMany();

  // Create sample users
  const users = await db.user.createMany({
    data: [
      {
        name: "João Silva",
        email: "joao@example.com",
        status: UserStatus.ACTIVE,
        role: "ADMIN" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=joao",
      },
      {
        name: "Maria Santos",
        email: "maria@example.com",
        status: UserStatus.ACTIVE,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=maria",
      },
      {
        name: "Pedro Oliveira",
        email: "pedro@example.com",
        status: UserStatus.PENDING,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=pedro",
      },
      {
        name: "Ana Costa",
        email: "ana@example.com",
        status: UserStatus.INACTIVE,
        role: "MODERATOR" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=ana",
      },
      {
        name: "Carlos Mendes",
        email: "carlos@example.com",
        status: UserStatus.ACTIVE,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=carlos",
      },
      {
        name: "Lucia Ferreira",
        email: "lucia@example.com",
        status: UserStatus.ACTIVE,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=lucia",
      },
      {
        name: "Roberto Ferreira",
        email: "roberto@example.com",
        status: UserStatus.PENDING,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=roberto",
      },
      {
        name: "Lucia Almeida",
        email: "lucia.almeida@example.com",
        status: UserStatus.ACTIVE,
        role: "MODERATOR" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=lucia.almeida",
      },
      {
        name: "Fernando Costa",
        email: "fernando@example.com",
        status: UserStatus.INACTIVE,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=fernando",
      },
      {
        name: "Patricia Silva",
        email: "patricia@example.com",
        status: UserStatus.ACTIVE,
        role: "ADMIN" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=patricia",
      },
      {
        name: "Ricardo Santos",
        email: "ricardo@example.com",
        status: UserStatus.PENDING,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=ricardo",
      },
      {
        name: "Amanda Oliveira",
        email: "amanda@example.com",
        status: UserStatus.ACTIVE,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=amanda",
      },
      {
        name: "Bruno Mendes",
        email: "bruno@example.com",
        status: UserStatus.INACTIVE,
        role: "MODERATOR" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=bruno",
      },
      {
        name: "Camila Lima",
        email: "camila@example.com",
        status: UserStatus.ACTIVE,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=camila",
      },
      {
        name: "Diego Rocha",
        email: "diego@example.com",
        status: UserStatus.PENDING,
        role: "USER" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=diego",
      },
      {
        name: "Eduarda Pinto",
        email: "eduarda@example.com",
        status: UserStatus.ACTIVE,
        role: "ADMIN" as UserRole,
        avatar: "https://i.pravatar.cc/150?u=eduarda",
      },
    ],
  });

  console.log(`✅ Created ${users.count} users`);
  console.log("🎉 Database seeded successfully!");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await db.$disconnect();
    process.exit(1);
  });