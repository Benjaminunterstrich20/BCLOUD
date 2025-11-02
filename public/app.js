function uploadFile() {
    const code = document.getElementById("code").value;
    const fileInput = document.getElementById("file");
    if (!fileInput.files[0]) return alert("Keine Datei ausgewählt");

    const formData = new FormData();
    formData.append("code", code);
    formData.append("file", fileInput.files[0]);

    fetch("/upload", { method: "POST", body: formData })
    .then(res => res.text())
    .then(alert)
    .catch(console.error);
}

function getFiles() {
    const code = document.getElementById("code").value;
    fetch(`/files?code=${code}`)
    .then(res => res.json())
    .then(files => {
        const ul = document.getElementById("fileList");
        ul.innerHTML = "";
        files.forEach(f => {
            const li = document.createElement("li");
            li.textContent = f;
            ul.appendChild(li);
        });
    })
    .catch(console.error);
}
