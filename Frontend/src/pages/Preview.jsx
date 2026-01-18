import { Smartphone, Monitor } from "lucide-react";
import "./Home.css";

const Preview = () => {
  return (
    <>
      <section className="py-[100px] bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Title */}
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-4">
            See StudyHub in Action
          </h2>

          <p className="text-center text-lg text-gray-500 mb-16">
            Experience our intuitive dashboard on any device
          </p>

          {/* Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 items-center">
            {/* Desktop Preview */}
            <div className="flex flex-col items-center gap-5">
              <div className="relative rounded-2xl bg-neutral-900 p-5 pb-10 shadow-2xl max-w-[600px] w-full">
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="p-5">
                    {/* Header */}
                    <div className="border-b pb-4 mb-5 flex gap-5">
                      <div className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium">
                        Dashboard
                      </div>
                      <div className="px-4 py-2 text-gray-500 font-medium">
                        Calendar
                      </div>
                      <div className="px-4 py-2 text-gray-500 font-medium">
                        Progress
                      </div>
                    </div>

                    {/* Body */}
                    <div className="grid grid-cols-[2fr_1fr] gap-5">
                      {/* Tasks */}
                      <div className="space-y-3">
                        <div className="flex gap-3 p-7 border border-slate-200 shadow rounded-lg bg-slate-50 hover:bg-slate-100 transition">
                          <div className="w-4 h-4 border-2 rounded"></div>
                          <div>
                            <div className="font-medium text-gray-900">
                              Complete Math Assignment
                            </div>
                            <div className="text-xs text-gray-500">
                              Due: Today • High Priority
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 p-7 shadow-xl border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 opacity-60">
                          <div className="w-4 h-4 bg-green-500 border-green-500 border-2 rounded relative">
                            <span className="absolute text-white text-xs left-[2px] top-[-2px]">
                              ✓
                            </span>
                          </div>
                          <div>
                            <div className="font-medium line-through">
                              Read Chapter 5
                            </div>
                            <div className="text-xs text-gray-500">
                              Completed • Medium Priority
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 p-7 border border-slate-200 shadow rounded-lg bg-slate-50 hover:bg-slate-100 transition">
                          <div className="w-4 h-4 border-2 rounded"></div>
                          <div>
                            <div className="font-medium text-gray-900">
                              Prepare for Quiz
                            </div>
                            <div className="text-xs text-gray-500">
                              Due: Tomorrow • Low Priority
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 h-25 text-center shadow-sm transition hover:shadow-xl">
                          <span className="text-5xl p-2 font-bold bg-gradient-to-b from-indigo-600 to-indigo-600/40 bg-clip-text text-transparent">
                            12
                          </span>
                          <p className="text-md text-slate-500">Total Tasks</p>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 h-25 text-center shadow-sm transition hover:shadow-xl">
                          <span className="text-5xl p-2 font-bold bg-gradient-to-b from-indigo-600 to-indigo-600/40 bg-clip-text text-transparent">
                            8
                          </span>
                          <p className="text-md text-slate-500">Completed</p>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 h-25 text-center shadow-sm transition hover:shadow-xl">
                          <span className="text-5xl p-2 font-bold bg-gradient-to-b from-indigo-600 to-indigo-600/40 bg-clip-text text-transparent">
                            17%
                          </span>
                          <p className="text-md text-slate-500">Progress</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Monitor size={20} />
                <span>Desktop Experience</span>
              </div>
            </div>

            {/* Mobile Preview */}
            <div className="flex flex-col items-center gap-5">
              <div className="rounded-[30px] bg-neutral-900 px-3 pt-5 pb-8 shadow-2xl w-[280px]">
                <div className="rounded-xl overflow-hidden">
                  <div className="p-4 min-h-[400px] text-white bg-gradient-to-br from-indigo-500 to-purple-600">
                    <div className="flex justify-between items-center mb-5">
                      <div className="font-bold text-lg">StudyHub</div>
                      <div className="text-lg">☰</div>
                    </div>

                    <div className="text-xl font-semibold mb-1">
                      Good Morning, Nitish
                    </div>
                    <div className="opacity-80 mb-6">Mon, 10 Sept</div>

                    <div className="space-y-3">
                      {[
                        { label: "BIOLOGY", color: "bg-red-500" },
                        { label: "WORLD HISTORY", color: "bg-yellow-400" },
                        {
                          label: "Basketball away game",
                          color: "bg-green-400",
                        },
                      ].map((task) => (
                        <div
                          key={task.label}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${task.color}`}
                          />
                          <span className="text-sm">{task.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Smartphone size={20} />
                <span>Mobile Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Preview;
