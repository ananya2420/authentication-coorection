"use server";

import { createAuthSession, destroySession } from "@/app/lib/server/auth";
import { hashUserPassword, verifyPassword } from "@/app/lib/hash"; // Ensure verifyPassword is imported
import { createUser, getUserByEmail } from "@/app/lib/server/user"; 
import { redirect } from "next/navigation";

export async function signUp(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }
  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);

  try {
    const id = await createUser(email, hashedPassword);
    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "An account with this email already exists.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  // Validate input
  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }
  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    // Fetch the user by email
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return {
        errors: {
          email: "No account found for this email.",
        },
      };
    }

    // Verify password
    const isValidPassword = verifyPassword(password, existingUser.hashedPassword);

    if (!isValidPassword) {
      return {
        errors: {
          password: "Incorrect password.",
        },
      };
    }

    // Create authentication session
    await createAuthSession(existingUser.id);
    redirect("/training");

} catch (error) {
    console.error(error);
    return {
      errors: {
        general: "Something went wrong, please try again later.",
      },
    };
  }
}


    export async function auth(mode,prevState,formData){
        if(mode==='login'){
            return login(prevState,formData)
        }
        return signUp(prevState,formData);
    }
 
export async function logout(){
  await destroySession();
  redirect('/')
}