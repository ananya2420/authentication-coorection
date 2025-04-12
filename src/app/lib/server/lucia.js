import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db"; // ✅ Correct path to database

// Initialize Lucia authentication
const adapter = new BetterSqlite3Adapter(db, {
  user: "users", // Table name in the database
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "auth_session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    },
  },
});
