import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-clover-green">CLOVER</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Your learning management system powered by 4-H
            </p>
            <p className="text-lg mb-12 max-w-2xl mx-auto">
              Explore hands-on activities, develop new skills, and grow as a leader through 
              engaging entrepreneurial and career development programs.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-lg px-8"
                onClick={() => navigate("/activities")}
              >
                Explore Activities
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8"
              >
                View Progress
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">📚</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Interactive Learning</h3>
                <p className="text-muted-foreground">
                  Engage with multimedia content and hands-on activities
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your achievements and celebrate milestones
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🏆</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Earn Recognition</h3>
                <p className="text-muted-foreground">
                  Level up and compete on the leaderboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
