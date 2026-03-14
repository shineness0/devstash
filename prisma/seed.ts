import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ============================================
// SYSTEM ITEM TYPES
// ============================================

const systemItemTypes = [
  { name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
  { name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { name: "file", icon: "File", color: "#6b7280", isSystem: true },
  { name: "image", icon: "Image", color: "#ec4899", isSystem: true },
  { name: "link", icon: "Link", color: "#10b981", isSystem: true },
];

// ============================================
// SEED
// ============================================

async function main() {
  console.log("Seeding system item types...");

  for (const type of systemItemTypes) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    });
    if (!existing) {
      await prisma.itemType.create({ data: type });
    }
  }

  // Fetch item types for reference
  const types = await prisma.itemType.findMany({ where: { userId: null } });
  const typeMap = Object.fromEntries(types.map((t) => [t.name, t.id]));

  // ============================================
  // DEMO USER
  // ============================================

  console.log("Seeding demo user...");

  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  // ============================================
  // COLLECTIONS & ITEMS
  // ============================================

  console.log("Seeding collections and items...");

  // Helper to upsert a collection
  async function upsertCollection(
    name: string,
    description: string,
    defaultTypeName: string
  ) {
    const existing = await prisma.collection.findFirst({
      where: { name, userId: user.id },
    });
    if (existing) return existing;
    return prisma.collection.create({
      data: {
        name,
        description,
        userId: user.id,
        defaultTypeId: typeMap[defaultTypeName],
      },
    });
  }

  // Helper to upsert an item and link to a collection
  async function upsertItem(
    data: {
      title: string;
      contentType: "TEXT" | "URL";
      content?: string;
      url?: string;
      description?: string;
      language?: string;
      isFavorite?: boolean;
      isPinned?: boolean;
      itemTypeName: string;
      tags?: string[];
    },
    collectionId: string
  ) {
    const existing = await prisma.item.findFirst({
      where: { title: data.title, userId: user.id },
    });

    const tags = data.tags ?? [];

    const item =
      existing ??
      (await prisma.item.create({
        data: {
          title: data.title,
          contentType: data.contentType,
          content: data.content,
          url: data.url,
          description: data.description,
          language: data.language,
          isFavorite: data.isFavorite ?? false,
          isPinned: data.isPinned ?? false,
          userId: user.id,
          itemTypeId: typeMap[data.itemTypeName],
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
      }));

    // Link to collection if not already linked
    const linked = await prisma.itemCollection.findUnique({
      where: { itemId_collectionId: { itemId: item.id, collectionId } },
    });
    if (!linked) {
      await prisma.itemCollection.create({
        data: { itemId: item.id, collectionId },
      });
    }

    return item;
  }

  // ----------------------------------------
  // React Patterns
  // ----------------------------------------

  const reactPatterns = await upsertCollection(
    "React Patterns",
    "Reusable React patterns and hooks",
    "snippet"
  );

  await upsertItem(
    {
      title: "Custom Hooks (useDebounce, useLocalStorage)",
      contentType: "TEXT",
      language: "typescript",
      itemTypeName: "snippet",
      tags: ["react", "hooks", "typescript"],
      content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}`,
    },
    reactPatterns.id
  );

  await upsertItem(
    {
      title: "Component Patterns (Context + Compound Components)",
      contentType: "TEXT",
      language: "typescript",
      itemTypeName: "snippet",
      tags: ["react", "context", "typescript"],
      content: `import { createContext, useContext, useState, ReactNode } from "react";

// ---- Context Provider Pattern ----
interface ThemeContextValue {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// ---- Compound Component Pattern ----
interface CardProps { children: ReactNode; className?: string; }

function Card({ children, className }: CardProps) {
  return <div className={\`rounded-lg border p-4 \${className}\`}>{children}</div>;
}
Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2 font-semibold">{children}</div>;
};
Card.Body = function CardBody({ children }: { children: ReactNode }) {
  return <div className="text-sm text-muted-foreground">{children}</div>;
};

export { Card };`,
    },
    reactPatterns.id
  );

  await upsertItem(
    {
      title: "Utility Functions (cn, formatDate, truncate)",
      contentType: "TEXT",
      language: "typescript",
      itemTypeName: "snippet",
      tags: ["typescript", "utilities"],
      content: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date to a readable string */
export function formatDate(date: Date | string, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/** Truncate a string to a max length with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/** Sleep for a given number of milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
    },
    reactPatterns.id
  );

  // ----------------------------------------
  // AI Workflows
  // ----------------------------------------

  const aiWorkflows = await upsertCollection(
    "AI Workflows",
    "AI prompts and workflow automations",
    "prompt"
  );

  await upsertItem(
    {
      title: "Code Review Prompt",
      contentType: "TEXT",
      itemTypeName: "prompt",
      tags: ["ai", "code-review"],
      content: `You are an expert software engineer conducting a thorough code review. Review the following code and provide feedback on:

1. **Correctness** - Are there any bugs or logic errors?
2. **Security** - Are there any security vulnerabilities (injection, XSS, auth bypass, etc.)?
3. **Performance** - Are there any inefficiencies or unnecessary operations?
4. **Readability** - Is the code clear and well-structured?
5. **Best Practices** - Does it follow language/framework conventions?

For each issue found, provide:
- The problematic line(s) or section
- Why it's an issue
- A concrete suggestion for improvement

Be direct and constructive. Prioritize issues by severity (Critical > High > Medium > Low).

\`\`\`
[PASTE CODE HERE]
\`\`\``,
    },
    aiWorkflows.id
  );

  await upsertItem(
    {
      title: "Documentation Generation Prompt",
      contentType: "TEXT",
      itemTypeName: "prompt",
      tags: ["ai", "documentation"],
      content: `Generate comprehensive documentation for the following code. Include:

1. **Overview** - What this code does in 1-2 sentences
2. **Parameters / Props** - Name, type, description, and whether required or optional
3. **Return Value** - What is returned and its type
4. **Usage Example** - A realistic, copy-paste-ready example
5. **Edge Cases / Notes** - Any gotchas, limitations, or important behaviors

Output in Markdown. Use TypeScript type annotations in examples where applicable.

\`\`\`
[PASTE CODE HERE]
\`\`\``,
    },
    aiWorkflows.id
  );

  await upsertItem(
    {
      title: "Refactoring Assistance Prompt",
      contentType: "TEXT",
      itemTypeName: "prompt",
      tags: ["ai", "refactoring"],
      content: `Refactor the following code to improve its quality. Goals:

- **Simplify** - Remove unnecessary complexity and duplication
- **Readability** - Make it easier to understand at a glance
- **Maintainability** - Structure it so future changes are easy
- **Performance** - Eliminate any obvious inefficiencies

Constraints:
- Do NOT change the external API or function signatures unless asked
- Do NOT add new features
- Preserve all existing behavior exactly

After refactoring, briefly explain the key changes you made and why.

\`\`\`
[PASTE CODE HERE]
\`\`\``,
    },
    aiWorkflows.id
  );

  // ----------------------------------------
  // DevOps
  // ----------------------------------------

  const devops = await upsertCollection(
    "DevOps",
    "Infrastructure and deployment resources",
    "snippet"
  );

  await upsertItem(
    {
      title: "Dockerfile + GitHub Actions CI",
      contentType: "TEXT",
      language: "dockerfile",
      itemTypeName: "snippet",
      tags: ["docker", "ci-cd", "github-actions"],
      content: `# ---- Dockerfile ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]

# ---- .github/workflows/ci.yml ----
# name: CI
# on: [push, pull_request]
# jobs:
#   build:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: actions/setup-node@v4
#         with:
#           node-version: 20
#           cache: npm
#       - run: npm ci
#       - run: npm run build
#       - run: npm run lint`,
    },
    devops.id
  );

  await upsertItem(
    {
      title: "Deploy to Production",
      contentType: "TEXT",
      itemTypeName: "command",
      tags: ["deployment", "production"],
      content: `# Run DB migrations then restart the app (Vercel / Railway / Fly.io)
npx prisma migrate deploy && npm start

# Fly.io deploy
fly deploy --remote-only

# Docker: build, tag, push, and redeploy
docker build -t myapp:latest . && \\
  docker tag myapp:latest registry.example.com/myapp:latest && \\
  docker push registry.example.com/myapp:latest && \\
  docker service update --image registry.example.com/myapp:latest myapp_web`,
    },
    devops.id
  );

  await upsertItem(
    {
      title: "Prisma Documentation",
      contentType: "URL",
      itemTypeName: "link",
      tags: ["prisma", "database", "docs"],
      url: "https://www.prisma.io/docs",
      description: "Official Prisma ORM documentation — schema, migrations, queries, and more.",
    },
    devops.id
  );

  await upsertItem(
    {
      title: "Docker Documentation",
      contentType: "URL",
      itemTypeName: "link",
      tags: ["docker", "containers", "docs"],
      url: "https://docs.docker.com",
      description: "Official Docker documentation covering containers, Compose, and deployment.",
    },
    devops.id
  );

  // ----------------------------------------
  // Terminal Commands
  // ----------------------------------------

  const terminalCommands = await upsertCollection(
    "Terminal Commands",
    "Useful shell commands for everyday development",
    "command"
  );

  await upsertItem(
    {
      title: "Git Operations",
      contentType: "TEXT",
      itemTypeName: "command",
      tags: ["git", "version-control"],
      isPinned: true,
      content: `# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Undo last commit (unstage changes)
git reset HEAD~1

# Discard all local changes
git checkout -- .

# Interactive rebase (last 5 commits)
git rebase -i HEAD~5

# Clean up merged branches
git branch --merged | grep -v "\\*\\|main\\|master" | xargs git branch -d

# Show pretty git log
git log --oneline --graph --decorate --all`,
    },
    terminalCommands.id
  );

  await upsertItem(
    {
      title: "Docker Commands",
      contentType: "TEXT",
      itemTypeName: "command",
      tags: ["docker", "containers"],
      content: `# List running containers
docker ps

# Remove all stopped containers
docker container prune -f

# Remove all unused images
docker image prune -a -f

# Enter a running container shell
docker exec -it <container_id> sh

# View container logs (follow)
docker logs -f <container_id>

# Stop all running containers
docker stop $(docker ps -q)`,
    },
    terminalCommands.id
  );

  await upsertItem(
    {
      title: "Process Management",
      contentType: "TEXT",
      itemTypeName: "command",
      tags: ["linux", "processes"],
      content: `# Find process using a port
lsof -i :<port>
# or on Windows:
netstat -ano | findstr :<port>

# Kill process by port
kill -9 $(lsof -t -i:<port>)

# Show top CPU/memory consumers
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10

# Run process in background, immune to hangup
nohup npm start &

# List background jobs
jobs -l`,
    },
    terminalCommands.id
  );

  await upsertItem(
    {
      title: "Package Manager Utilities",
      contentType: "TEXT",
      itemTypeName: "command",
      tags: ["npm", "package-manager"],
      content: `# Check for outdated packages
npm outdated

# Update all packages to latest
npx npm-check-updates -u && npm install

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# List globally installed packages
npm list -g --depth=0

# Clear npm cache
npm cache clean --force

# Run script defined in package.json
npm run <script>

# Install exact version
npm install <package>@<version> --save-exact`,
    },
    terminalCommands.id
  );

  // ----------------------------------------
  // Design Resources
  // ----------------------------------------

  const designResources = await upsertCollection(
    "Design Resources",
    "UI/UX resources and references",
    "link"
  );

  await upsertItem(
    {
      title: "Tailwind CSS Documentation",
      contentType: "URL",
      itemTypeName: "link",
      tags: ["tailwind", "css", "docs"],
      url: "https://tailwindcss.com/docs",
      description: "Official Tailwind CSS docs — utility classes, theme configuration, and more.",
      isFavorite: true,
    },
    designResources.id
  );

  await upsertItem(
    {
      title: "shadcn/ui Components",
      contentType: "URL",
      itemTypeName: "link",
      tags: ["shadcn", "components", "ui"],
      url: "https://ui.shadcn.com",
      description: "Beautifully designed, accessible React components built with Radix and Tailwind.",
      isFavorite: true,
    },
    designResources.id
  );

  await upsertItem(
    {
      title: "Radix UI Design System",
      contentType: "URL",
      itemTypeName: "link",
      tags: ["radix", "design-system", "accessibility"],
      url: "https://www.radix-ui.com",
      description: "Unstyled, accessible component primitives for building high-quality design systems.",
    },
    designResources.id
  );

  await upsertItem(
    {
      title: "Lucide Icons",
      contentType: "URL",
      itemTypeName: "link",
      tags: ["icons", "lucide"],
      url: "https://lucide.dev/icons",
      description: "Beautiful & consistent open-source icon library used throughout DevStash.",
    },
    designResources.id
  );

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
