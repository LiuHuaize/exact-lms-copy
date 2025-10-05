import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { X, Menu, Search, Play, Volume2, List, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ActivityLearn = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentLesson, setCurrentLesson] = useState(0);

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
                onClick={() => setCurrentLesson(index)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  currentLesson === index
                    ? "bg-white/20"
                    : "bg-white/5 hover:bg-white/10"
                }`}
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

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {currentLesson === 0 && (
            <div className="h-full bg-primary text-white">
              <div className="container mx-auto px-8 py-12 max-w-5xl">
                <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
                  <div>
                    <h1 className="text-5xl font-bold mb-6">Getting Started</h1>
                    <p className="text-lg mb-2">LESSON 1 OF 4</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                      alt="Student learning"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="bg-primary/80 backdrop-blur-sm rounded-xl p-8 mb-8">
                  <p className="text-center text-lg mb-6">
                    Select the play button to hear the audio.
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 mb-8">
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

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div className="rounded-full overflow-hidden aspect-square max-w-sm mx-auto">
                    <img 
                      src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&h=500&fit=crop"
                      alt="Entrepreneur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-lg leading-relaxed">
                      Thanks for joining us here on CLOVER today! We're glad you're here to learn how to think like an entrepreneur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentLesson === 1 && (
            <div className="h-full bg-primary text-white">
              <div className="container mx-auto px-8 py-12 max-w-5xl">
                <div className="mb-8">
                  <h1 className="text-5xl font-bold mb-4">The Entrepreneurial Mindset</h1>
                  <p className="text-lg">LESSON 2 OF 4</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop"
                      alt="Business concept"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-lg leading-relaxed mb-6">
                      By the end of this activity, you will be able to:
                    </p>
                    <ul className="space-y-4 text-lg">
                      <li className="flex items-start gap-3">
                        <span className="text-clover-yellow mt-1">•</span>
                        <span>Identify your talents, interests, and hobbies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-clover-yellow mt-1">•</span>
                        <span>Determine which entrepreneurial skills you already have to offer a potential business idea</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-clover-yellow mt-1">•</span>
                        <span>Write an elevator pitch about a business idea</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-16 bg-primary/60 backdrop-blur-sm rounded-2xl p-12 text-center">
                  <h2 className="text-6xl font-bold uppercase tracking-wider">
                    GATHER SUPPLIES
                  </h2>
                </div>
              </div>
            </div>
          )}

          {currentLesson === 2 && (
            <div className="h-full bg-primary text-white">
              <div className="container mx-auto px-8 py-12 max-w-5xl">
                <div className="mb-8">
                  <h1 className="text-5xl font-bold mb-4">The Elevator Pitch</h1>
                  <p className="text-lg">LESSON 3 OF 4</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div className="rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=400&fit=crop"
                      alt="Presenting"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-lg leading-relaxed mb-6">
                      Once you've identified a problem that your business idea can solve, and you've determined that you really want to solve it, it's time to take it a step further.
                    </p>
                    <p className="text-lg leading-relaxed mb-6">
                      As you begin to develop your idea, you'll need a way to explain it clearly and quickly to others.
                    </p>
                    <p className="text-lg leading-relaxed font-semibold">
                      That's where the elevator pitch comes in.
                    </p>
                  </div>
                </div>

                <div className="mt-12 grid lg:grid-cols-2 gap-8 items-center">
                  <div className="bg-white text-foreground rounded-2xl p-8">
                    <p className="text-lg leading-relaxed">
                      An <span className="font-bold">elevator pitch</span> is a brief, engaging way to present your business idea in just a few seconds—think of it as the time you'd have if you were in an elevator with someone influential, like an investor or potential customer. You want to grab their attention quickly and make them want to learn more.
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1552581234-26160f608093?w=600&h=400&fit=crop"
                      alt="Team discussion"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentLesson === 3 && (
            <div className="h-full bg-primary text-white flex items-center justify-center">
              <div className="container mx-auto px-8 py-12 max-w-3xl text-center">
                <h1 className="text-6xl font-bold mb-8">Go Beyond</h1>
                <p className="text-2xl mb-12">
                  Continue your entrepreneurial journey with additional resources and challenges!
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate(`/activities/${id}`)}
                >
                  Complete Activity
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLearn;
