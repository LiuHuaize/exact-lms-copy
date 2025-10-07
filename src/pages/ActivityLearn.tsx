import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { X, Play, Volume2, List, CheckCircle } from "lucide-react";
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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
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

      {/* Main container with fixed layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-full h-full">
          {/* Left Sidebar - Fixed with independent scroll */}
          <div className="w-[360px] bg-primary text-primary-foreground flex-shrink-0 h-full overflow-y-auto shadow-xl border-r border-white/10">
            {/* Activity Title & Progress */}
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-semibold mb-6">Entrepreneurial Skills</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-bold tracking-wider">
                  <span>0% COMPLETE</span>
                </div>
                <Progress value={0} className="h-3 bg-white/20" />
              </div>
            </div>

            {/* Lesson List */}
            <div className="px-3 py-3 space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={index}
                  className={`w-full text-left px-5 py-4 rounded-lg transition-all ${
                    index === 0 ? 'bg-white text-foreground shadow-md' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <List className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium">{lesson.title}</div>
                    </div>
                    {lesson.completed && (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 text-clover-green" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area - Independent scroll */}
          <div className="flex-1 bg-primary h-full overflow-y-auto">
            <div className="w-full">
            {/* Section 1: Getting Started - Centered Title */}
            <section className="flex flex-col bg-primary text-white px-8 py-8 min-h-[60vh]">
              <div className="flex justify-end mb-6">
                <p className="text-sm tracking-widest font-normal">LESSON 1 OF 4</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-7xl lg:text-8xl font-bold">Getting Started</h1>
              </div>
            </section>

            {/* Section 2: Audio Player */}
            <section className="flex items-center justify-center bg-primary text-white px-8 py-10">
              <div className="max-w-5xl w-full">
                <p className="text-center text-sm mb-8">
                  Select the play button to hear the audio.
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 h-9 w-9">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" className="bg-white text-primary hover:bg-white/90 h-11 w-11 rounded-full">
                    <Play className="w-5 h-5 ml-0.5" />
                  </Button>
                  <div className="flex-1 max-w-xl h-1 bg-white/40 rounded-full">
                    <div className="h-full w-0 bg-white rounded-full" />
                  </div>
                  <span className="text-sm font-normal min-w-[35px]">0:47</span>
                  <span className="text-sm font-normal">1x</span>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 h-9 w-9">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 h-9 w-9">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Section 3: Image Left, Text Right */}
            <section className="flex items-center bg-primary text-white px-8 py-12">
              <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10 items-center">
                <div className="flex justify-center lg:justify-end">
                  <div className="rounded-full overflow-hidden aspect-square w-full max-w-[380px]">
                    <img 
                      src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&h=500&fit=crop"
                      alt="Entrepreneur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-lg leading-relaxed font-normal">
                    Thanks for joining us here on CLOVER today! We're glad you're here to learn how to think like an entrepreneur.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: The Entrepreneurial Mindset - Text Left, Image Right */}
            <section className="flex items-center bg-white text-foreground px-8 py-12">
              <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-base leading-relaxed mb-6 font-normal">
                    By the end of this activity, you will be able to:
                  </p>
                  <ul className="space-y-4 text-base">
                    <li className="flex items-start gap-3">
                      <span className="text-clover-yellow text-2xl leading-none">•</span>
                      <span className="font-normal">Identify your talents, interests, and hobbies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-clover-yellow text-2xl leading-none">•</span>
                      <span className="font-normal">Determine which entrepreneurial skills you already have to offer a potential business idea</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-clover-yellow text-2xl leading-none">•</span>
                      <span className="font-normal">Write an elevator pitch about a business idea</span>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <div className="rounded-2xl overflow-hidden w-full aspect-[4/3] max-w-[450px]">
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
            <section className="flex items-center justify-center bg-primary text-white px-8 py-12 min-h-[40vh]">
              <div className="max-w-6xl w-full text-center">
                <h2 className="text-6xl lg:text-7xl font-bold uppercase tracking-wider">
                  GATHER SUPPLIES
                </h2>
              </div>
            </section>

            {/* Section 6: The Elevator Pitch - Image Left, Text Right */}
            <section className="flex items-center bg-white text-foreground px-8 py-12">
              <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[350px_1fr] gap-10 items-center">
                <div className="flex justify-center lg:justify-start">
                  <div className="rounded-2xl overflow-hidden w-full aspect-[3/4] max-w-[350px]">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop"
                      alt="Young woman presenting"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-base leading-relaxed mb-4 font-normal">
                    Once you've identified a problem that your business idea can solve, and you've determined that you really want to solve it, it's time to take it a step further.
                  </p>
                  <p className="text-base leading-relaxed mb-4 font-normal">
                    As you begin to develop your idea, you'll need a way to explain it clearly and quickly to others.
                  </p>
                  <p className="text-base leading-relaxed font-semibold">
                    That's where the elevator pitch comes in.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Elevator Pitch Definition - Text Left, Image Right */}
            <section className="flex items-center bg-primary text-white px-8 py-12">
              <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10 items-center">
                <div className="bg-white text-foreground rounded-2xl p-8">
                  <p className="text-base leading-relaxed font-normal">
                    An <span className="font-bold">elevator pitch</span> is a brief, engaging way to present your business idea in just a few seconds—think of it as the time you'd have if you were in an elevator with someone influential, like an investor or potential customer. You want to grab their attention quickly and make them want to learn more.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="rounded-2xl overflow-hidden w-full aspect-[4/3] max-w-[450px]">
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
            <section className="flex items-center justify-center bg-primary text-white px-8 py-12 min-h-[50vh]">
              <div className="max-w-4xl text-center">
                <h1 className="text-6xl lg:text-7xl font-bold mb-8">Go Beyond</h1>
                <p className="text-lg mb-10 leading-relaxed font-normal">
                  Continue your entrepreneurial journey with additional resources and challenges!
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-base px-8 py-5 h-auto font-semibold"
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
    </div>
  );
};

export default ActivityLearn;
