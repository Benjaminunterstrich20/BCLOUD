const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000; // Render nutzt process.env.PORT
const ACCESS_CODE = "1234"; // Einfacher Zugangscode

// Middleware
app.use(express.static("public"));
app.use(fileUpload());

// Upload Ordner auf Render (lokal im Container)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Upload Endpoint
app.post("/upload", (req, res) => {
    const code = req.body.code;
    if(code !== ACCESS_CODE) return res.status(401).send("Falscher Code");

    if(!req.files || !req.files.file) return res.status(400).send("Keine Datei hochgeladen");

    const file = req.files.file;
    const savePath = path.join(uploadDir, file.name);

    file.mv(savePath, err => {
        if(err) return res.status(500).send(err);
        res.send("Datei hochgeladen!");
    });
});

// Dateien auflisten
app.get("/files", (req, res) => {
    const code = req.query.code;
    if(code !== ACCESS_CODE) return res.status(401).send("Falscher Code");

    fs.readdir(uploadDir, (err, files) => {
        if(err) return res.status(500).send(err);
        res.json(files);
    });
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
