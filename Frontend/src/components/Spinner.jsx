const Spinner = ({ size = "md", color = "indigo" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const colors = {
    indigo: "border-indigo-600 border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-500 border-t-transparent",
  };

  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 ${colors[color]}`}
    />
  );
};

export default Spinner;
