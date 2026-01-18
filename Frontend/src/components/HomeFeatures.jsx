import { Calendar, CheckSquare, TrendingUp, Target } from "lucide-react";
import contentData from "../data/content.json";

const Features1 = () => {
  const { homepage } = contentData;

  return (
    <>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 text-center">
        {[CheckSquare, Calendar, TrendingUp, Target].map((Icon, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-10 shadow-xl hover:shadow-2xl
             transition-transform duration-300 ease-out
             hover:-translate-y-3 hover:scale-[1.02]
             before:absolute before:top-0 before:left-1/2
             before:h-1 before:w-full
             before:-translate-x-1/2
             before:scale-x-0 before:origin-center
             before:bg-gradient-to-r before:from-indigo-500 before:to-purple-600
             before:transition-transform before:duration-300
             hover:before:scale-x-100"
          >
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full
                          bg-gradient-to-br from-indigo-500 to-purple-600 text-white 
                          transition-transform duration-300
                          group-hover:scale-110 group-hover:rotate-6"
            >
              <Icon size={32} />
            </div>

            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
              {homepage.features[i].title}
            </h3>

            <p className="text-slate-600 leading-relaxed">
              {homepage.features[i].description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Features1;
