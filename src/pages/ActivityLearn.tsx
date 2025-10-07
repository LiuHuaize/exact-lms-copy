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
    { title: "Getting Started", completed: true },
    { title: "What Does it Take to Be an Entrepreneur?", completed: true },
    { title: "Your Entrepreneurial Characteristics", completed: true },
    { title: "Go Beyond", completed: false },
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
              Search
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <ArrowUp className="w-4 h-4" />
              <span>Home</span>
            </div>
            <Button
              variant="ghost"
              className="font-bold text-base hover:bg-transparent"
              onClick={() => navigate(`/activities/${id}`)}
            >
              EXIT ACTIVITY
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
                <h2 className="text-lg font-semibold">Entrepreneurial Skills</h2>
                <Menu className="w-5 h-5 text-white/60" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold tracking-wider">
                  <span>75% COMPLETE</span>
                  <span className="text-white/80">3 of 4</span>
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
                        ? "bg-white text-gray-900 shadow-lg border-white"
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
                          {isActive ? "Lesson 1 of 4" : lesson.completed ? "Completed" : "In progress"}
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

          {/* Main Content Area - Independent scroll */}
          <main className="flex-1 h-full flex flex-col">
            {/* Hero section */}
            <div className="relative overflow-hidden">
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
                      Lesson 1 of 4
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Getting Started</h1>
                    <p className="text-base max-w-xl text-white/70">
                      Select the play button to hear the audio and dive into entrepreneurial thinking.
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center gap-3 text-sm font-medium text-white/80">
                    <ArrowUp className="w-4 h-4" />
                    <span>Back to modules</span>
                  </div>
                </div>
              </div>
              <div
                className="h-16 bg-white"
                style={{ clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0% 100%)" }}
              />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto bg-muted">
              <section className="px-10 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm text-muted-foreground">
                        Select the play button to hear the audio.
                      </p>
                      <span className="text-xs font-semibold tracking-[0.3em] text-clover-green uppercase">
                        Audio Lesson
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
                      Thanks for joining us here on CLOVER today! We are excited you are here to learn how to think like an entrepreneur.
                    </p>
                    <p>
                      This lesson is all about curiosity, creativity, and spotting opportunities in the everyday moments around you.
                    </p>
                  </div>
                </div>
              </section>

              <section className="px-10 pb-12">
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 grid lg:grid-cols-[1fr_320px] gap-12 items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-6">
                      By the end of this activity, you will be able to:
                    </h2>
                    <ul className="space-y-4 text-base text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
                        <span>Identify your talents, interests, and hobbies.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
                        <span>Determine the entrepreneurial skills you already have to launch an idea.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
                        <span>Craft an elevator pitch that sparks curiosity.</span>
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
                      Gather Supplies
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">What Does it Take to Be an Entrepreneur?</h2>
                    <p className="text-base max-w-3xl mx-auto text-white/80">
                      Once you have identified a problem worth solving, it is time to gather inspiration and resources that bring your idea to life.
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
                      Once you have a business idea, you will need a memorable way to describe it to future customers and supporters.
                    </p>
                    <p>
                      Your elevator pitch should highlight the problem you are solving, the spark behind your solution, and the value it delivers.
                    </p>
                    <p className="font-semibold text-foreground">
                      Keep it concise, conversational, and confident.
                    </p>
                  </div>
                </div>
              </section>

              <section className="px-10 pb-20">
                <div className="max-w-4xl mx-auto bg-white rounded-[36px] shadow-xl p-12 text-center space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-bold text-foreground">Go Beyond</h3>
                  <p className="text-lg text-muted-foreground">
                    Continue your entrepreneurial journey with bonus challenges, reflection prompts, and real-world examples from young innovators like you.
                  </p>
                  <Button
                    size="lg"
                    className="px-10 py-6 text-base font-semibold rounded-full"
                    onClick={() => navigate(`/activities/${id}`)}
                  >
                    Complete Activity
                  </Button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ActivityLearn;
