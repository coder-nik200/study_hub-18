import { BookOpen, Clock, Heart, Lightbulb, Target } from "lucide-react";

const TipsFeatures = () => {
  const features = [
    {
      icon: Clock,
      title: "Use the Pomodoro Technique",
      description:
        "Break your study sessions into 25-minute focused intervals followed by 5-minute breaks.",
    },
    {
      icon: Target,
      title: "Prioritize High-Impact Tasks",
      description:
        "Focus on tasks that will have the greatest impact on your academic goals first.",
    },
    {
      icon: BookOpen,
      title: "Create a Consistent Schedule",
      description:
        "Establish regular study times to build productive habits and maintain momentum.",
    },
    {
      icon: Lightbulb,
      title: "Review and Reflect",
      description:
        "Regularly review your progress and adjust your study plan based on what's working.",
    },
    {
      icon: Heart,
      title: "Take Care of Yourself",
      description:
        "Maintain a healthy balance with proper sleep, nutrition, and exercise for optimal learning.",
    },
  ];

  return (
    <div className="mx-auto mb-24 grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, i) => {
        const Icon = feature.icon;

        return (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-10 shadow-xl
              transition-transform duration-300 ease-out

              lg:hover:-translate-y-3 lg:hover:scale-[1.02]
              lg:hover:shadow-2xl

              before:absolute before:top-0 before:left-1/2
              before:h-1 before:w-full
              before:-translate-x-1/2
              before:scale-x-0 before:origin-center
              before:bg-gradient-to-r before:from-indigo-500 before:to-purple-600
              before:transition-transform before:duration-300

              lg:hover:before:scale-x-100
              active:before:scale-x-100" // mobile tap effect
          >
            {/* ICON */}
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl
                        bg-gradient-to-br from-blue-600 to-purple-600 text-white
                        transition-transform duration-300
                        lg:group-hover:scale-110 lg:group-hover:rotate-6" // icon only scales on desktop
            >
              <Icon size={32} />
            </div>

            {/* TITLE */}
            <h3 className="mb-4 text-2xl font-semibold text-slate-800">
              {feature.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="leading-relaxed text-slate-600">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TipsFeatures;
