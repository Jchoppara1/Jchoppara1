import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });
    return record;
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function main() {
  console.log("Seeding database...");

  const wineCSVPath = path.join(process.cwd(), "delbarcsv", "wine_list.csv");
  const wineContent = fs.readFileSync(wineCSVPath, "utf-8");
  const wines = parseCSV(wineContent);

  console.log(`Found ${wines.length} wines to seed`);

  for (const wine of wines) {
    await prisma.wine.upsert({
      where: { id: wine.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() },
      update: {},
      create: {
        id: wine.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(),
        name: wine.name,
        grape: wine.grape,
        category: wine.category,
        origin: wine.origin,
        price: parseInt(wine.price) || 0,
        notes: wine.notes,
      },
    });
  }
  console.log(`Seeded ${wines.length} wines`);

  const foodCSVPath = path.join(process.cwd(), "delbarcsv", "food_menu.csv");
  const foodContent = fs.readFileSync(foodCSVPath, "utf-8");
  const foods = parseCSV(foodContent);

  console.log(`Found ${foods.length} foods to seed`);

  for (const food of foods) {
    await prisma.food.upsert({
      where: { id: food.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() },
      update: {},
      create: {
        id: food.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(),
        name: food.name,
        category: food.category,
        price: parseInt(food.price) || 0,
      },
    });
  }
  console.log(`Seeded ${foods.length} foods`);

  const sourceDomains = [
    { domain: "guildsomm.com", tier: "A", weight: 1.0 },
    { domain: "jancisrobinson.com", tier: "A", weight: 1.0 },
    { domain: "winespectator.com", tier: "A", weight: 1.0 },
    { domain: "decanter.com", tier: "A", weight: 1.0 },
    { domain: "wineenthusiast.com", tier: "B", weight: 0.8 },
    { domain: "thewinesociety.com", tier: "B", weight: 0.8 },
    { domain: "masterclass.com", tier: "B", weight: 0.8 },
    { domain: "winefolly.com", tier: "C", weight: 0.6 },
    { domain: "vivino.com", tier: "C", weight: 0.4 },
  ];

  for (const source of sourceDomains) {
    await prisma.sourceDomain.upsert({
      where: { domain: source.domain },
      update: { tier: source.tier, weight: source.weight },
      create: source,
    });
  }
  console.log(`Seeded ${sourceDomains.length} source domains`);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@winewizard.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`Seeded admin user: ${adminEmail}`);

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
