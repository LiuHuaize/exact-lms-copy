import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Play,
  Volume2,
  List,
  ArrowUp,
  Search,
  Menu,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ActivityLearn = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const lessons = [
    { title: "准备开始", completed: true },
    { title: "成为企业家需要具备什么？", completed: true },
    { title: "你的创业特质", completed: true },
    { title: "更进一步", completed: false },
  ];

  return (
    <div className="h-screen bg-muted flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="bg-white/95 backdrop-blur border-b border-border flex flex-col flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <button className="hidden lg:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-4 h-4" />
              搜索
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <ArrowUp className="w-4 h-4" />
              <span>返回主页</span>
            </div>
            <Button
              variant="ghost"
              className="font-bold text-base hover:bg-transparent"
              onClick={() => navigate(`/activities/${id}`)}
            >
              退出活动
              <X className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main container with fixed layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-full h-full">
          {/* Left Sidebar - Fixed with independent scroll */}
          <aside className="w-[340px] bg-gradient-to-b from-[#0a514f] to-[#063330] text-white flex-shrink-0 h-full overflow-y-auto shadow-2xl border-r border-white/10">
            {/* Activity Title & Progress */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">创业技能</h2>
                <Menu className="w-5 h-5 text-white/60" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold tracking-wider">
                  <span>完成 75%</span>
                  <span className="text-white/80">3 / 4</span>
                </div>
                <Progress value={75} className="h-2 bg-white/10" />
              </div>
            </div>

            {/* Lesson List */}
            <div className="px-4 py-6 space-y-3">
              {lessons.map((lesson, index) => {
                const isActive = index === 0;
                const Icon = lesson.completed ? CheckCircle2 : Circle;

                return (
                  <button
                    key={index}
                    className={`group w-full text-left px-4 py-4 rounded-[18px] transition-all border ${
                      isActive
                        ? "bg-white text-foreground shadow-lg border-white"
                        : "bg-white/5 border-white/10 text-white/90 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                        isActive ? "border-clover-green/30 bg-clover-green/10 text-clover-green" : "border-white/20 bg-white/5 text-white"
                      }`}>
                        <List className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${
                          isActive ? "text-foreground" : "text-white"
                        }`}>{lesson.title}</div>
                        <p className={`text-xs mt-1 ${
                          isActive ? "text-muted-foreground" : "text-white/60"
                        }`}>
                          {isActive ? "第 1 课，共 4 课" : lesson.completed ? "已完成" : "进行中"}
                        </p>
                      </div>
                      <Icon className={`w-4 h-4 ${lesson.completed ? "text-clover-green" : "text-white/50"}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-6 pb-8">
              <div className="mt-10 rounded-full bg-white/10 border border-white/20 w-20 h-20 flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl">🍀</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area - Scrollable */}
          <main className="flex-1 h-full overflow-y-auto bg-muted flex flex-col">
            {/* Hero section */}
            <div className="relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
                  alt="Hero background"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0a514f]/80" />
              </div>
              <div className="relative px-10 pt-14 pb-24 text-white">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex flex-col gap-4">
                    <span className="text-sm font-semibold tracking-[0.3em] uppercase text-white/70">
                      第 1 课，共 4 课
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">准备开始</h1>
                    <p className="text-base max-w-xl text-white/70">
                      点击播放按钮收听音频，投入创业思维的世界。
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center gap-3 text-sm font-medium text-white/80">
                    <ArrowUp className="w-4 h-4" />
                    <span>返回模块</span>
                  </div>
                </div>
              </div>
              <div
                className="h-16 bg-white"
                style={{ clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0% 100%)" }}
              />
            </div>

            {/* Scrollable content */}
            <section className="px-10 py-12">
              <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm text-muted-foreground">
                        选择播放按钮即可收听音频。
                      </p>
                      <span className="text-xs font-semibold tracking-[0.3em] text-clover-green uppercase">
                        音频课程
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-5">
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-10 w-10 rounded-full">
                        <Volume2 className="w-5 h-5" />
                      </Button>
                      <Button size="icon" className="bg-clover-green text-white hover:bg-clover-green/90 h-14 w-14 rounded-full shadow">
                        <Play className="w-6 h-6 ml-0.5" />
                      </Button>
                      <div className="flex-1 min-w-[200px] h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[45%] bg-clover-green" />
                      </div>
                    <span className="text-sm font-medium text-muted-foreground min-w-[40px] text-right">
                      0:47
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">1x</span>
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-10 w-10 rounded-full">
                        <Volume2 className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-10 w-10 rounded-full">
                        <List className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="px-10 pb-12">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-[360px_1fr] gap-10 items-center">
                  <div className="rounded-[30px] overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                      alt="Entrepreneur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                    <p>
                      感谢你今天加入 CLOVER！我们很高兴与你一起学习如何像企业家一样思考。
                    </p>
                    <p>
                      本课围绕好奇心、创造力以及在日常生活中发现机会的能力展开。
                    </p>
                  </div>
                </div>
              </section>

              <section className="px-10 pb-12">
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 grid lg:grid-cols-[1fr_320px] gap-12 items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-6">
                      完成本活动后，你将能够：
                    </h2>
                    <ul className="space-y-4 text-base text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
                        <span>识别自己的才能、兴趣与爱好。</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
                        <span>明确自己已经具备哪些创业技能以启动创意。</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
                        <span>打造一段激发好奇心的电梯演讲。</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=900&q=80"
                      alt="Students collaborating"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </section>

              <section className="px-10 pb-12">
                <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0c5d52] via-[#0a514f] to-[#083d3b] rounded-[40px] text-white overflow-hidden shadow-2xl">
                  <div className="px-10 py-16 text-center">
                    <p className="text-sm uppercase tracking-[0.4em] text-white/70 mb-6">
                      准备材料
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">成为企业家需要具备什么？</h2>
                    <p className="text-base max-w-3xl mx-auto text-white/80">
                      一旦确认值得解决的问题，就该收集灵感与资源，让你的创意成真。
                    </p>
                  </div>
                </div>
              </section>

              <section className="px-10 pb-16">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-[340px_1fr] gap-10 items-center">
                  <div className="rounded-[32px] overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80"
                      alt="Young woman presenting"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
                    <p>
                      当你拥有一个商业创意时，需要用令人难忘的方式向潜在客户和支持者介绍它。
                    </p>
                    <p>
                      你的电梯演讲应突出要解决的问题、灵感来源以及能够创造的价值。
                    </p>
                    <p className="font-semibold text-foreground">
                      保持内容简洁、自然并充满自信。
                    </p>
                  </div>
                </div>
              </section>

              <section className="px-10 pb-20">
                <div className="max-w-4xl mx-auto bg-white rounded-[36px] shadow-xl p-12 text-center space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-bold text-foreground">更进一步</h3>
                  <p className="text-lg text-muted-foreground">
                    通过额外挑战、自我反思提示以及与你一样的青年创新者案例，继续你的创业之旅。
                  </p>
                  <Button
                    size="lg"
                    className="px-10 py-6 text-base font-semibold rounded-full"
                    onClick={() => navigate(`/activities/${id}`)}
                  >
                    完成活动
                  </Button>
                </div>
              </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ActivityLearn;
