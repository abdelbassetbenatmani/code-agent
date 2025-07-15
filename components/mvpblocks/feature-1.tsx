import { Code, Sparkles, Zap, RotateCcw, Shield, Cpu } from "lucide-react";

const features = [
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "AI-Powered Assistance",
    desc: "Advanced AI models analyze your code and provide intelligent suggestions, completions, and improvements in real-time.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Smart Code Completion",
    desc: "Context-aware code suggestions that understand your project structure, coding style, and development patterns.",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Automated Refactoring",
    desc: "Identify and fix code smells, improve performance, and enhance readability with AI-suggested refactoring options.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Performance Optimization",
    desc: "Detect performance bottlenecks and receive optimization suggestions to make your code run faster and more efficiently.",
  },
  {
    icon: <RotateCcw className="h-6 w-6" />,
    title: "Continuous Learning",
    desc: "Our AI adapts to your coding style and preferences over time, becoming more personalized and helpful with every use.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Security Analysis",
    desc: "Automatically scan for potential security vulnerabilities and receive guidance on best practices to protect your code.",
  },
];
export default function Feature1() {
  return (
    <section id="features" className="relative py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
              Powerful AI Features for Developers
            </h3>
            <p className="font-geist mt-3 text-foreground/60">
              Our AI code agent comes packed with intelligent tools that help
              you write cleaner, faster, and more secure code while enhancing
              your development workflow.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(192, 15, 102, 0.2) 4.54%, rgba(192, 11, 109, 0.26) 34.2%, rgba(192, 15, 102, 0.1) 77.55%)",
            }}
          ></div>
        </div>
        <hr className="mx-auto mt-5 h-px w-1/2 bg-foreground/30" />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa42f_inset]"
              >
                <div className="w-fit transform-gpu rounded-full border p-4 text-primary [box-shadow:0_-20px_80px_-20px_#ff7aa43f_inset] dark:[box-shadow:0_-20px_80px_-20px_#ff7aa40f_inset]">
                  {item.icon}
                </div>
                <h4 className="font-geist text-lg font-bold tracking-tighter">
                  {item.title}
                </h4>
                <p className="text-gray-500">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
