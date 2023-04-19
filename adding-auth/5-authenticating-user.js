async function authenticateUser({ username, password }) {
  // check that username and password are set
  if (!username || !password) {
    throw new Error("You must provide a username and password");
  }

  // write SQL for getting user from users table
  const getUserSql = `SELECT * FROM users WHERE username = ?`;

  const dbResponse = await db.execute(getUserSql, [username]);

  const user = dbResponse[0];

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
  const sessionId = uuidv4();

  const createSessionSql = `INSERT INTO sessions (session_id, user_id) VALUES (?, ?)`;

  await db.execute(createSessionSql, [sessionId, user.id]);

  return sessionId;
}
