async function lookupUserConversations({ userId }) {
  // lookup conversations for user
  // write SQL for getting conversations for user
  const getConversationsSql = `SELECT * FROM conversations WHERE user_id = ?`;
  // execute SQL
  const dbResponse = await db.execute(getConversationsSql, [userId]);
  // return conversations
  return dbResponse[0];
}
