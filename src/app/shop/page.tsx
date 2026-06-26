import React from "react";
import { readDB } from "../../lib/db";
import ShopClient from "./ShopClient";

// Server Component for Instant Loading
export default async function ShopPage() {
  // Fetch from database on the server
  const dbData = await readDB();

  return <ShopClient dbData={dbData} />;
}
