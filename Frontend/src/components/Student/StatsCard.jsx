const StatsCard = ({ title, value, icon: Icon, gradient }) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <h2 className="text-3xl font-bold mt-1">{value}</h2>
        </div>

        <div className="bg-white/20 p-3 rounded-xl">
          {Icon && <Icon size={28} />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
