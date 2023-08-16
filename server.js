const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3010;
const { sendEmail } = require("./mailer");
app.use(cors());
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Run /send-email to send test email");
});

const SENDER_EMAIL_ID = process.env.EMAIL_TO;

app.post("/send-email", async (req, res) => {
  try {
     console.log("Received form data:", req.body);
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      throw new Error("Missing required fields");
    }

    const emailContent = `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `;

    const info = await sendEmail(SENDER_EMAIL_ID, subject, emailContent);
    res.send(info);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
