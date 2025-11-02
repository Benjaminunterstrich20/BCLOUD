const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const CODE = "1234"; // Einfacher Zugangscode

// Middleware
app.use(express.static("public"));
app.use(fileUpload());

// Upload Ordner erstellen, falls nicht existiert
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Datei hochladen
app.post("/upload", (req, res) => {
    const code = req.body.code;
    if (code !== CODE) return res.status(401).send("Falscher Code");

    if (!req.files || !req.files.file) return res.status(400).send("Keine Datei hochgeladen");

    const file = req.files.file;
    const savePath = path.join(uploadDir, file.name);

    file.mv(savePath, (err) => {
        if (err) return res.status(500).send(err);
        res.send("Datei hochgeladen!");
    });
});

// Liste der Dateien abrufen
app.get("/files", (req, res) => {
    const code = req.query.code;
    if (code !== CODE) return res.status(401).send("Falscher Code");

    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).send(err);
        res.json(files);
    });
});

app.listen(PORT, () => console.log(`Cloud App läuft auf http://localhost:${PORT}`));
