const createConnection = async () => {
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    return connection;
  };
  
  const query = async (sql, params) => {
    const connection = await createConnection();
    const [results] = await connection.execute(sql, params);
    connection.end();
    return results;
  };
  
  module.exports = {
    createConnection,
    query,
  };
  