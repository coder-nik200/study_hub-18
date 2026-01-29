const replies = require("../data/fallBackReplies.json");

const getFallBackReply = (message) => {
  const userMessage = message.toLowerCase();

  // 🔥 sort keywords by length (longest first)
  const sortedReplies = [...replies].sort(
    (a, b) => b.keyword.length - a.keyword.length,
  );

  for (const item of sortedReplies) {
    if (item.keyword && userMessage.includes(item.keyword.toLowerCase())) {
      return item.reply;
    }
  }

  // Date & time handled dynamically
  if (userMessage.includes("today") || userMessage.includes("date")) {
    return `Today's date is ${new Date().toDateString()} 📅`;
  }
  if (userMessage.includes("time")) {
    return `Current time is ${new Date().toLocaleTimeString()} ⏰`;
  }
  if (userMessage.includes("day")) {
    return `Today is ${new Date().toLocaleString("en-US", { weekday: "long" })} 😊`;
  }
  if (userMessage.includes("month")) {
    return `Current month is ${new Date().toLocaleString("en-US", { month: "long" })} 🗓️`;
  }
  if (userMessage.includes("year")) {
    return `The current year is ${new Date().getFullYear()} 🎉`;
  }
  if (userMessage.includes("leap year")) {
    return "A leap year occurs every 4 years and has 366 days 📆";
  }

  return "I'm still learning 😅 Try asking about StudyHub, BCA subjects, coding, exams, or today's date!";
};

module.exports = { getFallBackReply };
