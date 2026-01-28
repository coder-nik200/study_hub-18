const getMessage = async (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let reply = "";

  if (userMessage.includes("dbms")) {
    reply = "DBMS stands for Database Management System.";
  } else if (userMessage.includes("os")) {
    reply = "Operating System manages computer hardware and software.";
  } else if (userMessage.includes("hello")) {
    reply = "Hello 👋 How can I help you study today?";
  } else {
    reply = "Sorry, I don't understand yet 😅";
  }

  res.json({ reply });
};

module.exports = { getMessage };
