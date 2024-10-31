const fs = require("fs");
const path = require("path");

const filePath = path.resolve(process.cwd(), "data", "lastTicketData.json");

class FileService {
  async saveData(data) {
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(data), "utf8");
      console.log("Data saved successfully.");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  async loadData() {
    try {
      if (fs.existsSync(filePath)) {
        const data = await fs.promises.readFile(filePath, "utf8");
        return JSON.parse(data);
      }
      return {};
    } catch (error) {
      console.error("Error loading data:", error);
      return null;
    }
  }
}

module.exports = new FileService();
