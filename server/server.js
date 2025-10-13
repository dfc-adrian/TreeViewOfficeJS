const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.get("/get-file", (req, res) => {
  const filePath = path.join(__dirname, "storage", "TestFileOffice.xlsx");
  res.sendFile(filePath);
});

app.use("/files", express.static(path.join(__dirname, "storage")));

const PORT = 8088;
app.listen(PORT, () => console.log(`File server: http://localhost:${PORT}/files`));
