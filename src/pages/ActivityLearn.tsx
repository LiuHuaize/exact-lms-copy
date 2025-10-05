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
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Logo />
        <Button 
          variant="ghost" 
          className="font-semibold"
          onClick={() => navigate(`/activities/${id}`)}
        >
          EXIT ACTIVITY
          <X className="ml-2 w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-primary text-primary-foreground flex flex-col">
          {/* Activity Title & Progress */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold mb-4">Think Like an Entrepreneur</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">100% COMPLETE</span>
              </div>
              <Progress value={100} className="bg-white/20" />
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="p-4">
            <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-white/10 mb-2">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-white/10">
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            {lessons.map((lesson, index) => (
              <button
                key={index}
                className="w-full text-left p-4 rounded-lg transition-colors bg-white/5 hover:bg-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <List className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{lesson.title}</div>
                  </div>
                  {lesson.completed && (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-clover-green" />
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
            <section className="min-h-screen flex items-center justify-center bg-primary text-white px-8 py-16">
              <div className="max-w-6xl w-full text-center">
                <h1 className="text-7xl font-bold mb-8">Getting Started</h1>
                <p className="text-xl mb-16 tracking-wider">LESSON 1 OF 4</p>
              </div>
            </section>

            {/* Section 2: Audio Player */}
            <section className="min-h-[60vh] flex items-center justify-center bg-primary text-white px-8 py-16">
              <div className="max-w-6xl w-full">
                <p className="text-center text-xl mb-8">
                  Select the play button to hear the audio.
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <Button size="icon" className="bg-white text-primary hover:bg-white/90">
                    <Play className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 max-w-md h-1 bg-white/30 rounded-full">
                    <div className="h-full w-1/3 bg-white rounded-full" />
                  </div>
                  <span className="text-sm">1:02</span>
                  <span className="text-sm">1x</span>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Section 3: Image Left, Text Right */}
            <section className="min-h-screen flex items-center bg-primary text-white px-8 py-16">
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                  <div className="rounded-full overflow-hidden aspect-square w-full max-w-md">
                    <img 
                      src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&h=500&fit=crop"
                      alt="Entrepreneur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-2xl leading-relaxed">
                    Thanks for joining us here on CLOVER today! We're glad you're here to learn how to think like an entrepreneur.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: The Entrepreneurial Mindset - Text Left, Image Right */}
            <section className="min-h-screen flex items-center bg-white text-foreground px-8 py-16">
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-xl leading-relaxed mb-8">
                    By the end of this activity, you will be able to:
                  </p>
                  <ul className="space-y-6 text-xl">
                    <li className="flex items-start gap-4">
                      <span className="text-clover-yellow text-2xl">•</span>
                      <span>Identify your talents, interests, and hobbies</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-clover-yellow text-2xl">•</span>
                      <span>Determine which entrepreneurial skills you already have to offer a potential business idea</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-clover-yellow text-2xl">•</span>
                      <span>Write an elevator pitch about a business idea</span>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <div className="rounded-3xl overflow-hidden w-full aspect-[4/3]">
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
            <section className="min-h-screen flex items-center bg-white text-foreground px-8 py-16">
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                  <div className="rounded-3xl overflow-hidden w-full aspect-[3/4]">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop"
                      alt="Young woman presenting"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xl leading-relaxed mb-6">
                    Once you've identified a problem that your business idea can solve, and you've determined that you really want to solve it, it's time to take it a step further.
                  </p>
                  <p className="text-xl leading-relaxed mb-6">
                    As you begin to develop your idea, you'll need a way to explain it clearly and quickly to others.
                  </p>
                  <p className="text-xl leading-relaxed font-semibold">
                    That's where the elevator pitch comes in.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Elevator Pitch Definition - Text Left, Image Right */}
            <section className="min-h-screen flex items-center bg-primary text-white px-8 py-16">
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                <div className="bg-white text-foreground rounded-3xl p-10">
                  <p className="text-xl leading-relaxed">
                    An <span className="font-bold">elevator pitch</span> is a brief, engaging way to present your business idea in just a few seconds—think of it as the time you'd have if you were in an elevator with someone influential, like an investor or potential customer. You want to grab their attention quickly and make them want to learn more.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="rounded-3xl overflow-hidden w-full aspect-[4/3]">
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
                <p className="text-3xl mb-16 leading-relaxed">
                  Continue your entrepreneurial journey with additional resources and challenges!
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-xl px-12 py-6 h-auto"
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
