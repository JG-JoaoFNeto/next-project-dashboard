import { db } from "../lib/db-script";
import { UserStatus } from "@prisma/client";

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
        role: "admin",
        avatar: "https://i.pravatar.cc/150?u=joao",
      },
      {
        name: "Maria Santos",
        email: "maria@example.com",
        status: UserStatus.ACTIVE,
        role: "user",
        avatar: "https://i.pravatar.cc/150?u=maria",
      },
      {
        name: "Pedro Oliveira",
        email: "pedro@example.com",
        status: UserStatus.PENDING,
        role: "user",
        avatar: "https://i.pravatar.cc/150?u=pedro",
      },
      {
        name: "Ana Costa",
        email: "ana@example.com",
        status: UserStatus.INACTIVE,
        role: "moderator",
        avatar: "https://i.pravatar.cc/150?u=ana",
      },
      {
        name: "Carlos Mendes",
        email: "carlos@example.com",
        status: UserStatus.ACTIVE,
        role: "user",
        avatar: "https://i.pravatar.cc/150?u=carlos",
      },
      {
        name: "Lucia Ferreira",
        email: "lucia@example.com",
        status: UserStatus.ACTIVE,
        role: "user",
        avatar: "https://i.pravatar.cc/150?u=lucia",
      },
      {
        name: "Roberto Dias",
        email: "roberto@example.com",
        status: UserStatus.PENDING,
        role: "user",
        avatar: "https://i.pravatar.cc/150?u=roberto",
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