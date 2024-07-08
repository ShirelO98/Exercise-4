const { query } = require("../dbConnection");

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

async function register(req, res) {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw new Error("Missing username or password");
    }

    let accessCode;
    let isAccessCodeAvailable = false;

    while (!isAccessCodeAvailable) {
      accessCode = random(10000, 99999);
      const results = await query(
        "SELECT * FROM tbl_62_users WHERE access_code = ?",
        [accessCode]
      );
      isAccessCodeAvailable = results.length === 0;
    }

    const result = await query(
      "INSERT INTO tbl_62_users (username, password,access_code) VALUES (?, ?, ?)",
      [username, password, accessCode]
    );

    const user = (
      await query("SELECT * FROM tbl_62_users WHERE id = ?", [result.insertId])
    )[0];

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

  
  module.exports = {
    usersController: { register, login },
  };
  