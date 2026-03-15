import { useState } from "react";

export default function GradeInput({
  assignmentId,
  currentScore,
  currentFeedback,
  onGradeUpdate,
}) {
  const [score, setScore] = useState(currentScore || "");
  const [feedback, setFeedback] = useState(currentFeedback || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    if (score !== "" && score >= 0 && score <= 100) {
      onGradeUpdate(assignmentId, parseInt(score), feedback);
      setIsEditing(false);
    }
  };

  if (!isEditing && currentScore !== undefined) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
      >
        Edit Grade
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="number"
        min="0"
        max="100"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        placeholder="Score"
      />

      <input
        type="text"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        placeholder="Feedback"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition"
      >
        Save
      </button>

      <button
        onClick={() => {
          setIsEditing(false);
          setScore(currentScore || "");
          setFeedback(currentFeedback || "");
        }}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
      >
        Cancel
      </button>
    </div>
  );
}
