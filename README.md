# 📊 Dashboard de Usuários - Next.js App Router

Um sistema moderno de gerenciamento de usuários construído com **Next.js 15**, **App Router**, **Prisma ORM** e **TypeScript**.

## 🚀 Funcionalidades Implementadas

- ✅ **Listagem de usuários** com interface moderna
- ✅ **Exclusão de usuários** com confirmação
- ✅ **Estatísticas em tempo real** (total de usuários, ativos, inativos)
- ✅ **Sistema de filtros** (estrutura preparada)
- ✅ **Banco de dados SQLite** com Prisma ORM
- ✅ **Seeding automático** com dados de exemplo
- ✅ **Componentes reutilizáveis** e bem estruturados
- ✅ **Tipagem TypeScript** completa

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Object-Relational Mapping
- **SQLite** - Banco de dados local
- **Tailwind CSS** - Estilização moderna
- **Lucide React** - Ícones modernos

## 📁 Estrutura do Projeto

```
├── app/
│   ├── users/              # Páginas de usuários
│   │   ├── [id]/          # Página individual do usuário
│   │   └── components/    # Componentes específicos
│   ├── layout.tsx         # Layout principal
│   └── page.tsx          # Página inicial
├── lib/
│   ├── actions/          # Server Actions
│   ├── db.ts            # Configuração do Prisma
│   └── db-script.ts     # Scripts do banco
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── dev.db          # Banco SQLite
├── scripts/
│   └── seed.ts         # Script de seeding
└── types/
    └── *.ts           # Definições de tipos
```

## 🔧 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/JG-JoaoFNeto/next-project-dashboard.git
cd next-project-dashboard
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Gerar o cliente Prisma
npx prisma generate

# Aplicar as migrações
npx prisma db push

# Popular com dados de exemplo
npm run seed
```

### 4. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o resultado.

## 📋 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Cria build de produção
npm run start        # Executa build de produção
npm run lint         # Executa linter
npm run seed         # Popula banco com dados exemplo
```

## 🎯 Próximas Funcionalidades (TODO)

- [ ] **Criar usuário** - Formulário de cadastro
- [ ] **Editar usuário** - Formulário de edição
- [ ] **Sistema de busca** - Buscar por nome, email, etc.
- [ ] **Filtros avançados** - Por status, data, etc.
- [ ] **Paginação** - Para grandes volumes de dados
- [ ] **Validação de formulários** - Com React Hook Form + Zod
- [ ] **Upload de avatar** - Imagens de perfil

## 📊 Status do Projeto

🚧 **Em Desenvolvimento** - Funcionalidades básicas implementadas, CRUD completo em progresso.

Veja mais detalhes técnicos no arquivo [PROJETO-RESUMO.md](./PROJETO-RESUMO.md).

## 👨‍💻 Autor

**João Neto** - [GitHub](https://github.com/JG-JoaoFNeto)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
