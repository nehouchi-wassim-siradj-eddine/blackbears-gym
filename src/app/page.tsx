import React from "react";
import { readCachedDB } from "../lib/db";
import HomeClient from "./HomeClient";

// Server Component for Instant Loading
export const revalidate = 3600;

export default async function Home() {
  // Fetch from database on the server using cached layout fetcher
  const dbData = await readCachedDB();

  return <HomeClient initialDbData={dbData} />;
}
