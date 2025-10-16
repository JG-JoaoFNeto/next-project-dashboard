import { db } from "../lib/db-script";

/**
 * Script de migração para converter roles de string para ENUM
 * Mapeia valores antigos para novos valores padronizados
 */

async function migrateRoles() {
  console.log("🔄 Iniciando migração de roles...");

  try {
    // Mapeamento de migração
    const roleMapping: Record<string, "ADMIN" | "USER" | "MODERATOR"> = {
      "admin": "ADMIN",
      "user": "USER", 
      "moderator": "MODERATOR",
      "administrator": "ADMIN",
      "mod": "MODERATOR",
      // Adicione outros casos conforme necessário
    };

    // Buscar todos os usuários
    const users = await db.user.findMany();
    console.log(`📊 Encontrados ${users.length} usuários para migrar`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        const currentRole = user.role as string;
        const newRole = roleMapping[currentRole.toLowerCase()] || "USER";
        
        await db.user.update({
          where: { id: user.id },
          data: { role: newRole }
        });

        console.log(`✅ ${user.name}: "${currentRole}" → "${newRole}"`);
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ Erro ao migrar usuário ${user.name}:`, error);
        errorCount++;
      }
    }

    console.log(`\n📈 Migração concluída:`);
    console.log(`   ✅ Migrados: ${migratedCount}`);
    console.log(`   ❌ Erros: ${errorCount}`);

  } catch (error) {
    console.error("💥 Erro durante a migração:", error);
  } finally {
    await db.$disconnect();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  migrateRoles();
}

export { migrateRoles };