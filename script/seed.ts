import { db } from "../lib/db";
import { wines, foods, sourceDomains, adminUsers } from "../lib/schema";
import { readFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index] || "";
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

  const wineCSVPath = join(process.cwd(), "delbarcsv", "wine_list.csv");
  const wineContent = readFileSync(wineCSVPath, "utf-8");
  const wineData = parseCSV(wineContent);

  console.log(`Found ${wineData.length} wines to seed`);

  await db.delete(wines);
  for (const wine of wineData) {
    await db.insert(wines).values({
      name: wine.name,
      grape: wine.grape,
      category: wine.category,
      origin: wine.origin,
      price: parseInt(wine.price) || 0,
      notes: wine.notes || "",
    });
  }
  console.log(`Seeded ${wineData.length} wines`);

  const foodCSVPath = join(process.cwd(), "delbarcsv", "food_menu.csv");
  const foodContent = readFileSync(foodCSVPath, "utf-8");
  const foodData = parseCSV(foodContent);

  console.log(`Found ${foodData.length} foods to seed`);

  await db.delete(foods);
  for (const food of foodData) {
    await db.insert(foods).values({
      name: food.name,
      category: food.category,
      price: parseInt(food.price) || 0,
    });
  }
  console.log(`Seeded ${foodData.length} foods`);

  const domains = [
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

  await db.delete(sourceDomains);
  for (const source of domains) {
    await db.insert(sourceDomains).values(source);
  }
  console.log(`Seeded ${domains.length} source domains`);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@winewizard.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await db.delete(adminUsers);
  await db.insert(adminUsers).values({
    email: adminEmail,
    passwordHash,
  });
  console.log(`Seeded admin user: ${adminEmail}`);

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
