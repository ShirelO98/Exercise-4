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

function findOverlappingDateRange(dateRanges) {
  if (!dateRanges.length) return null;

  let maxStartDate = new Date(
    Math.max(...dateRanges.map((range) => new Date(range.start).getTime()))
  );
  let minEndDate = new Date(
    Math.min(...dateRanges.map((range) => new Date(range.end).getTime()))
  );

  if (maxStartDate <= minEndDate) {
    return { start: maxStartDate, end: minEndDate };
  } else {
    return null;
  }
}

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

const getPreferences = async (req, res) => {
  try {
    const preferences = await getAllPreferences();
    res.status(200).json(preferences);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

const updatePreferences = async (req, res) => {
  const { id } = req.params;
  const { destination, start_date, end_date, type, access_code } = req.body;

  try {
    if (!destination || !start_date || !end_date || !type) {
      throw new Error("Missing fields");
    }

    validateVacationKey(type);
    validateDestination(destination);

    const user = await findUserByAccessCode(access_code);
    if (!user) {
      throw new Error("Invalid access code");
    }

    const preferences = (
      await query("SELECT * FROM tbl_62_preferences WHERE id = ?", [id])
    )[0];

    if (!preferences) {
      throw new Error("Preference not found");
    }

    await query(
      "UPDATE tbl_62_preferences SET destination = ?, start_date = ?, end_date = ?, type = ? WHERE id = ?",
      [destination, start_date, end_date, type, id]
    );

    const updatedPreferences = (
      await query("SELECT * FROM tbl_62_preferences WHERE id = ?", [id])
    )[0];

    res.status(200).json(updatedPreferences);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const calculatePreferences = async (req, res) => {
  const preferences = await getAllPreferences();

  if (preferences.length === 0) {
    res.status(400).json({ message: "No preferences found" });
    return;
  }

  if (preferences.length < 5) {
    res
      .status(400)
      .json({ message: "Not enough preferences to calculate (need 5)" });
    return;
  }

  const destinationCount = preferences.reduce((acc, preference) => {
    acc[preference.destination] = (acc[preference.destination] || 0) + 1;
    return acc;
  }, {});

  const maxDestination = Object.keys(destinationCount).reduce((a, b) =>
    destinationCount[a] > destinationCount[b] ? a : b
  );

  const vacationTypeCount = preferences.reduce((acc, preference) => {
    acc[preference.type] = (acc[preference.type] || 0) + 1;
    return acc;
  }, {});

  const maxVacationType = Object.keys(vacationTypeCount).reduce((a, b) =>
    vacationTypeCount[a] > vacationTypeCount[b] ? a : b
  );

  const overlappingDateRange = findOverlappingDateRange(
    preferences.map((preference) => ({
      start: preference.start_date,
      end: preference.end_date,
    }))
  );

  if (!overlappingDateRange) {
    const firstPreference = preferences[0];
    res.status(400).json({
      selected_destination: firstPreference.destination,
      selected_vacationType: firstPreference.type,
      start_date: firstPreference.start_date,
      end_date: firstPreference.end_date,
      message: "No overlapping date range found (first preference selected)",
    });
    return;
  }

  res.status(200).json({
    selected_destination: maxDestination,
    selected_vacationType:
      VACATION_TYPE[maxVacationType] + " (id: " + maxVacationType + ")",
    end_date: overlappingDateRange.end.toISOString(),
    start_date: overlappingDateRange.start.toISOString(),
  });
};


module.exports = {
  preferencesController: {
    getPreferences,
    createPreferences,
    updatePreferences,
    calculatePreferences
  }
};