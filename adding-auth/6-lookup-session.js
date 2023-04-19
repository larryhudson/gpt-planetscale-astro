async function lookupSession({ sessionId }) {
  // write SQL for getting session from sessions table
  const getSessionSql = `SELECT * FROM sessions WHERE session_id = ?`;

  const dbResponse = await db.execute(getSessionSql, [sessionId]);

  const session = dbResponse[0];

  // check that session exists
  if (!session) {
    throw new Error("Session not found");
  }

  // check that the session is less than a week old
  const oneWeekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

  if (session.created_at < oneWeekAgo) {
    throw new Error("Session expired");
  }

  // return session
  return session;
}
