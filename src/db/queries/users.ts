import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

type CreateUser = {
  username: string;
  email: string;
  password: string;
  image: string;
};

type UserByUsername = {
  password: string;
};

export async function createUser(user: CreateUser) {
  const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
  return result;
}

export async function deleteUser(id: string) {
  const [result] = await db.delete(users).where(eq(users.id, id)).returning();
  return result;
}

// export async function updateUser(user: NewUser) {
//   const [result] = await db.update(users).set({username: user.username, email: });
// }

// export async function getUser(id: string) {
//   const [result] = await db.select().from(users).where(eq(users.id, id));
//   return;
// }

export async function getListUser() {
  const [result] = await db.select().from(users);
  return result;
}

export async function getUserByUsername(username: string) {
  const [result] = await db.execute<UserByUsername>(
    sql`SELECT password FROM ${users} WHERE ${users.username} = ${username}`
  );
  return result;
}
