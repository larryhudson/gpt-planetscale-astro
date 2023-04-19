async function getUnapprovedUsers() {
  // write SQL for getting unapproved users. approved_at should be null
  const getUnapprovedUsersSql = `SELECT * FROM users WHERE approved_at IS NULL`;
  // execute SQL
  const dbResponse = await db.execute(getUnapprovedUsersSql);
  // return users
  return dbResponse[0];
}

async function approveUser({ userId }) {
  // write SQL for approving user
  const approveUserSql = `UPDATE users SET approved_at = CURRENT_TIMESTAMP WHERE id = ?`;
  // execute SQL
  const response = await db.execute(approveUserSql, [userId]);

  console.log(response);

  return response;
}
