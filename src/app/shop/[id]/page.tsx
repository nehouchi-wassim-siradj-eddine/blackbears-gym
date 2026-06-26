import React from "react";
import { readProduct, readCachedDB } from "../../../lib/db";
import ProductClient from "./ProductClient";

// Server Component for Instant Loading
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // Fetch from database on the server using fully decoupled fetching architecture
  const product = await readProduct(id);
  const dbData = await readCachedDB();

  if (!product) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-bold">Product not found.</div>;
  }

  // Pass full resolved data to Client Wrapper for interactivity
  return <ProductClient product={product} dbData={dbData} />;
}
