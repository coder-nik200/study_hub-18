const OverallStats = ({
  title,
  value,
  icon: Icon,
  gradient = "from-indigo-500 to-purple-600",
  progress,
}) => {
  return (
    <div
      className={`relative bg-gradient-to-br ${gradient}
      rounded-2xl p-6 text-white
      shadow-xl hover:shadow-2xl
      hover:-translate-y-2 transition-all duration-300 overflow-hidden`}
    >
      {/* Glow Circle */}
      <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/20 rounded-full blur-2xl"></div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
          <Icon size={28} />
        </div>
      </div>

      {/* Optional Progress */}
      {progress !== undefined && (
        <div className="mt-4 relative z-10">
          <div className="w-full bg-white/30 h-2 rounded-full">
            <div
              className="h-2 rounded-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OverallStats;
