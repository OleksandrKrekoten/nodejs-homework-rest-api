const app = require("./app");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const { PORT } = process.env;
const { HOST_URI } = process.env;
async function main() {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.error("error mongodb", error.message);
    process.exit(1);
  }
}
main();
