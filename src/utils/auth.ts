import { getDbConnection } from "./db";
import bcrypt from "bcrypt";
import { uuid } from "uuidv4";

export async function authenticateUser({ username, password }) {
  // check that username and password are set
  if (!username || !password) {
    throw new Error("You must provide a username and password");
  }

  const db = getDbConnection();

  // write SQL for getting user from users table
  const getUserSql = `SELECT * FROM users WHERE username = ?`;

  const rows = await db
    .execute(getUserSql, [username])
    .then((result) => result.rows);

  const user = rows[0];

  // check that user exists
  if (!user) {
    throw new Error("User not found");
  }

  // check that password is correct
  const passwordCorrect = await bcrypt.compare(password, user.password);

  if (!passwordCorrect) {
    throw new Error("Password incorrect");
  }

  // create a new session for the user
  const sessionId = uuid();

  const createSessionSql = `INSERT INTO sessions (session_id, user_id) VALUES (?, ?)`;

  const result = await db.execute(createSessionSql, [sessionId, user.id]);

  // return session id that will be saved in a cookie
  return sessionId;
}

export async function createUserAndLogin({ username, email, password }) {
  // check that username, email and password are all set
  if (!username || !email || !password) {
    throw new Error("You must provide a username, email and password");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const db = getDbConnection();

  // write SQL for creating new user in users table, returning the ID
  const createUserSql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

  const newUserId = await db
    .execute(createUserSql, [username, email, hashedPassword])
    .then((result) => result.insertId);

  // create a new session for the user
  const sessionId = uuidv4();

  const createSessionSql = `INSERT INTO sessions (session_id, user_id) VALUES (?, ?)`;

  const result = await db.execute(createSessionSql, [sessionId, newUserId]);

  // return session id that will be saved in a cookie
  return sessionId;
}

export async function getUserFromSession(sessionId) {
  const db = getDbConnection();

  if (typeof sessionId !== "string") {
    throw new Error("Session not found");
  }

  // write SQL for getting user from sessions table
  const getSessionSql = `SELECT * FROM sessions WHERE session_id = ?`;

  const rows = await db
    .execute(getSessionSql, [sessionId])
    .then((result) => result.rows);

  const session = rows[0];

  // check that user exists
  if (!session) {
    throw new Error("Session not found");
  }

  // check that the session is not more than a week old
  const sessionAge = Date.now() - session.created_at;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  if (sessionAge > oneWeek) {
    throw new Error("Session expired");
  }

  // lookup the user in the users table
  const getUserSql = `SELECT * FROM users WHERE id = ?`;

  const user = await db
    .execute(getUserSql, [session.user_id])
    .then((result) => result.rows[0]);

  return user;
}

export type User = {
  id: number;
  username: string;
  email: string;
  superuser: boolean;
  approved_at: string;
};

export async function redirectUserIfNotApproved(Astro) {
  try {
    const user = await getUserFromSession(Astro.cookies.get("session").value);

    // if no user, redirect to login
    if (!user) {
      return {
        redirect: "/auth/login",
        user: null,
      };
    }

    if (!user.approved_at) {
      return {
        redirect: "/auth/not-approved",
        user: null,
      };
    }

    return {
      redirect: null,
      user: user,
    };
  } catch (error) {
    return {
      redirect: "/auth/login",
      user: null,
      error: error,
    };
  }
}

export async function redirectUserIfNotSuperuser(Astro) {
  const user = await getUserFromSession(Astro.cookies.get("session").value);

  if (!user.superuser) {
    return Astro.redirect("/?reason=not-superuser");
  }
}

export async function getUnapprovedUsers() {
  const db = getDbConnection();

  const getUnapprovedUsersSql = `SELECT * FROM users WHERE approved_at IS NULL`;

  return await db.execute(getUnapprovedUsersSql).then((result) => result.rows);
}

export async function approveUser({ userId }) {
  const db = getDbConnection();
  // write SQL for approving user
  const approveUserSql = `UPDATE users SET approved_at = CURRENT_TIMESTAMP WHERE id = ?`;
  // execute SQL
  const response = await db.execute(approveUserSql, [userId]);

  return response;
}
