document.getElementById('generate-btn').addEventListener('click', function() {
    const text = document.getElementById('text-input').value;
    if (text.trim() === "") {
        alert("Please enter some text to generate a QR code.");
        return;
    }
    const qrCodeContainer = document.getElementById('qrcode');
    qrCodeContainer.innerHTML = ""; // Clear previous QR code
    new QRCode(qrCodeContainer, {
        text: text,
        width: 256,
        height: 256,
        colorDark : "#0f0",
        colorLight : "#000",
    });
});
