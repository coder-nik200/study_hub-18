const Subscriber = require("../models/subscriber");

const postSubscriber = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("Subscribe error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { postSubscriber };
