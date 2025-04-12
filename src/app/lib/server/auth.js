"use server"; // ✅ Ensure this is only in the file with async functions

import { lucia } from "./lucia"; // ✅ Import lucia object
import { cookies } from "next/headers";

// Export async function for creating an auth session
export async function createAuthSession(userId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

// Export async function for verifying an auth session
export async function verifyAuth() {
  const sessionCookie = cookies().get(lucia.sessionCookieName);

  if (!sessionCookie || !sessionCookie.value) {
    return { user: null, session: null };
  }

  const sessionId = sessionCookie.value;
  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const newSessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        newSessionCookie.name,
        newSessionCookie.value,
        newSessionCookie.attributes
      );
    } else if (!result.session) {
      const blankSessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        blankSessionCookie.name,
        blankSessionCookie.value,
        blankSessionCookie.attributes
      );
    }
  } catch (error) {
    console.error("Session validation error:", error);
  }

  return result;
}
export async function destroySession(){
  const {session} = await verifyAuth();
  if(!session){
    return{
      error:'unauthorized!'
    }
  }
  await lucia.invalidateSession(session.id);
  cookies().set(
    blankSessionCookie.name,
    blankSessionCookie.value,
    blankSessionCookie.attributes
  );
}