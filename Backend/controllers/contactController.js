const Contact = require("../models/contact");

const postContact = async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const newMessage = await Contact.create({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    res
      .status(200)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { postContact };
