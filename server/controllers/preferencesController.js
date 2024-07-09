const { query } = require("../dbConnection");

const VACATION_TYPE = {
  1: "Beach",
  2: "City",
  3: "Mountain",
  4: "Countryside",
  5: "Adventure",
};

const VACATION_KEYS = Object.keys(VACATION_TYPE).map((key) => parseInt(key));

const DESTINATIONS = [
  "Bali",
  "Paris",
  "Swiss Alps",
  "Tuscany",
  "New Zealand",
  "Iceland",
  "Machu Picchu",
  "Santorini",
  "Kyoto",
  "Dubai",
];

const findUserByAccessCode = async (accessCode) => {
  return (
    await query("SELECT * FROM tbl_62_users WHERE access_code = ?", [
      accessCode,
    ])
  )[0];
};

const validateDestination = (destination) => {
    if (!DESTINATIONS.includes(destination)) {
      throw new Error(
        `Invalid destination. Please choose from the following: ${DESTINATIONS.join(
          ", "
        )}`
      );
    }
  };
  
  const validateVacationKey = (type) => {
    if (!VACATION_KEYS.includes(type)) {
      throw new Error(
        `Invalid vacation type. Please choose from the following: ${VACATION_KEYS.join(
          ", "
        )}`
      );
    }
  };
  
const createPreferences = async (req, res) => {
    const { destination, start_date, end_date, access_code, type } = req.body;
  
    try {
      if (!destination || !start_date || !end_date || !type || !access_code) {
        throw new Error("Missing fields");
      }
  
      validateVacationKey(type);
  
      validateDestination(destination);
  
      const user = await findUserByAccessCode(access_code);
      if (!user) {
        throw new Error("Invalid access code");
      }
  
      const result = await query(
        "INSERT INTO tbl_62_preferences (destination, start_date, end_date, user_id, type) VALUES (?, ?, ?, ?, ?)",
        [destination, start_date, end_date, user.id, type]
      );
  
      const preferences = (
        await query("SELECT * FROM tbl_62_preferences WHERE id = ?", [
          result.insertId,
        ])
      )[0];
  
      res.status(200).json(preferences);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };





  module.exports = {
    preferencesController: {
      createPreferences

    },
  };