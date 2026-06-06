/**
 * Seed data and demo accounts for local development.
 *
 * This project uses Supabase (Postgres) for backend data. You can create demo
 * users via the Supabase Auth panel or seed them programmatically. The demo
 * credentials below are intended for local development only.
 */
import products from "./products.json";
import categories from "./categories.json";

export const seedCatalog = { products, categories };

export const DEMO_USERS = [
  {
    email: "user@test.com",
    password: "password123",
    profile: { name: "Demo User", phone: "555-0100", role: "user" },
  },
  {
    email: "admin@oya.com",
    password: "admin123",
    profile: { name: "Oya Admin", phone: "555-0199", role: "admin" },
  },
];
