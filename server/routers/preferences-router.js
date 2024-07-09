const { Router } = require("express");
const {
  preferencesController,
} = require("../controllers/preferencesController");

const preferencesRouter = Router();

// preferencesRouter.get("/", preferencesController.//add);
preferencesRouter.post("/", preferencesController.createPreferences);
preferencesRouter.put("/:id", preferencesController.updatePreferences);
// preferencesRouter.get("/calculate", preferencesController.//add);

module.exports = { preferencesRouter };
