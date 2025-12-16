require("dotenv").config();
const http = require("http");

const PORT = process.env.PORT || 7000;

const emojis = ["😄", "🚀", "✨", "😎", "🔥", "🌍", "🎉"];

const server = http.createServer((req, res) => {
  const now = new Date().toLocaleString();
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8"
  });

  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Simple Node Server</title>
      </head>
      <body>
        <h1>Hello from my server ${emoji}</h1>
        <p><strong>Name:</strong> Nunsi Shiaki</p>
        <p><strong>Date & Time:</strong> ${now}</p>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
