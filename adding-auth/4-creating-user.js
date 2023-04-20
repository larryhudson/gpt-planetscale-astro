// function for creating a new user. should take username, email, and password
// should hash the password using a salt with a secret stored in an env variable

async function createUser({ username, email, password }) {
  // check that username, email and password are all set
  if (!username || !email || !password) {
    throw new Error("You must provide a username, email and password");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  //
  // write SQL for creating new user in users table
  const createUserSql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?) RETURNING *`;

  const dbResponse = await db.execute(createUserSql, [
    username,
    email,
    hashedPassword,
  ]);

  const user = dbResponse[0];
}
