import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export async function readDB() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return null;
  }
}

export async function writeDB(data: any) {
  try {
    // Merge existing data with new data
    const existingData = await readDB() || {};
    const newData = { ...existingData, ...data };
    await fs.writeFile(dbPath, JSON.stringify(newData, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
}
