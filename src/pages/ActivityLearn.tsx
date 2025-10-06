import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { X, Menu, Search, Play, Volume2, List, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ActivityLearn = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const lessons = [
    { title: "Getting Started", completed: true },
    { title: "The Entrepreneurial Mindset", completed: true },
    { title: "The Elevator Pitch", completed: true },
    { title: "Go Beyond", completed: true },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <Logo />
        <Button 
          variant="ghost" 
          className="font-bold text-base hover:bg-transparent"
          onClick={() => navigate(`/activities/${id}`)}
        >
          EXIT ACTIVITY
          <X className="ml-2 w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[300px] bg-primary text-primary-foreground flex flex-col">
          {/* Activity Title & Progress */}
          <div className="p-6 border-b border-white/20">
            <h2 className="text-lg font-normal mb-6">Entrepreneurial Skills</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold tracking-wider">
                <span>0% COMPLETE</span>
              </div>
              <Progress value={0} className="h-2 bg-white/20" />
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="p-4 border-b border-white/10">
            <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-white/10 mb-2 h-10">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-white/10 h-10">
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {lessons.map((lesson, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-3 rounded transition-colors ${
                  index === 0 ? 'bg-white text-foreground' : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <List className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-normal">{lesson.title}</div>
                  </div>
                  {lesson.completed && (
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-clover-green" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area - Long Scrolling Page */}
        <div className="flex-1 overflow-y-auto bg-primary">
          <div className="w-full">
            {/* Section 1: Getting Started - Centered Title */}
            <section className="min-h-screen flex flex-col bg-primary text-white px-8 py-12">
              <div className="flex justify-end mb-8">
                <p className="text-sm tracking-widest font-normal">LESSON 1 OF 4</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-8xl font-bold">Getting Started</h1>
              </div>
            </section>

            {/* Section 2: Audio Player */}
            <section className="min-h-[70vh] flex items-center justify-center bg-primary text-white px-8 py-16">
              <div className="max-w-5xl w-full">
                <p className="text-center text-base mb-12">
                  Select the play button to hear the audio.
                </p>
                
                <div className="flex items-center justify-center gap-6">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 h-10 w-10">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <Button size="icon" className="bg-white text-primary hover:bg-white/90 h-12 w-12 rounded-full">
                    <Play className="w-5 h-5 ml-0.5" />
                  </Button>
                  <div className="flex-1 max-w-xl h-1 bg-white/40 rounded-full">
                    <div className="h-full w-0 bg-white rounded-full" />
                  </div>
                  <span className="text-sm font-normal min-w-[35px]">0:47</span>
                  <span className="text-sm font-normal">1x</span>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 h-10 w-10">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 h-10 w-10">
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Section 3: Image Left, Text Right */}
            <section className="min-h-screen flex items-center bg-primary text-white px-12 py-16">
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                <div className="flex justify-center lg:justify-end">
                  <div className="rounded-full overflow-hidden aspect-square w-full max-w-[420px]">
                    <img 
                      src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&h=500&fit=crop"
                      alt="Entrepreneur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-xl leading-relaxed font-normal">
                    Thanks for joining us here on CLOVER today! We're glad you're here to learn how to think like an entrepreneur.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: The Entrepreneurial Mindset - Text Left, Image Right */}
            <section className="min-h-screen flex items-center bg-white text-foreground px-12 py-16">
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-lg leading-relaxed mb-10 font-normal">
                    By the end of this activity, you will be able to:
                  </p>
                  <ul className="space-y-6 text-lg">
                    <li className="flex items-start gap-4">
                      <span className="text-clover-yellow text-3xl leading-none">•</span>
                      <span className="font-normal">Identify your talents, interests, and hobbies</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-clover-yellow text-3xl leading-none">•</span>
                      <span className="font-normal">Determine which entrepreneurial skills you already have to offer a potential business idea</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-clover-yellow text-3xl leading-none">•</span>
                      <span className="font-normal">Write an elevator pitch about a business idea</span>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <div className="rounded-2xl overflow-hidden w-full aspect-[4/3] max-w-[500px]">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                      alt="Students learning together"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Gather Supplies */}
            <section className="min-h-[60vh] flex items-center justify-center bg-primary text-white px-8 py-16">
              <div className="max-w-6xl w-full text-center">
                <h2 className="text-8xl font-bold uppercase tracking-wider">
                  GATHER SUPPLIES
                </h2>
              </div>
            </section>

            {/* Section 6: The Elevator Pitch - Image Left, Text Right */}
            <section className="min-h-screen flex items-center bg-white text-foreground px-12 py-16">
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[400px_1fr] gap-16 items-center">
                <div className="flex justify-center lg:justify-start">
                  <div className="rounded-2xl overflow-hidden w-full aspect-[3/4] max-w-[400px]">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop"
                      alt="Young woman presenting"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-lg leading-relaxed mb-6 font-normal">
                    Once you've identified a problem that your business idea can solve, and you've determined that you really want to solve it, it's time to take it a step further.
                  </p>
                  <p className="text-lg leading-relaxed mb-6 font-normal">
                    As you begin to develop your idea, you'll need a way to explain it clearly and quickly to others.
                  </p>
                  <p className="text-lg leading-relaxed font-semibold">
                    That's where the elevator pitch comes in.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Elevator Pitch Definition - Text Left, Image Right */}
            <section className="min-h-screen flex items-center bg-primary text-white px-12 py-16">
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                <div className="bg-white text-foreground rounded-2xl p-10">
                  <p className="text-lg leading-relaxed font-normal">
                    An <span className="font-bold">elevator pitch</span> is a brief, engaging way to present your business idea in just a few seconds—think of it as the time you'd have if you were in an elevator with someone influential, like an investor or potential customer. You want to grab their attention quickly and make them want to learn more.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="rounded-2xl overflow-hidden w-full aspect-[4/3] max-w-[500px]">
                    <img 
                      src="https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=600&fit=crop"
                      alt="Team discussion"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8: Go Beyond */}
            <section className="min-h-screen flex items-center justify-center bg-primary text-white px-8 py-16">
              <div className="max-w-4xl text-center">
                <h1 className="text-8xl font-bold mb-12">Go Beyond</h1>
                <p className="text-2xl mb-16 leading-relaxed font-normal">
                  Continue your entrepreneurial journey with additional resources and challenges!
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-10 py-6 h-auto font-semibold"
                  onClick={() => navigate(`/activities/${id}`)}
                >
                  Complete Activity
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLearn;
