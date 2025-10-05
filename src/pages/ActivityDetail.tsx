import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, GraduationCap, CheckCircle, Clipboard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ActivityDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative">
        {/* Hero Image Section */}
        <div className="h-48 bg-gradient-to-r from-primary to-clover-green-light relative">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop"
            alt="Activity"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold mb-4">Thinking Like an Entrepreneur</h1>
              
              <p className="text-muted-foreground italic mb-6">
                Authored by Claudia Mincemoyer, PhD., Professor Emeritus, Penn State University.
              </p>

              <p className="text-lg mb-4">
                Do you have an entrepreneurial mindset? This activity will help you explore your 
                talents, interests, and hobbies as they relate to a business idea.
              </p>

              <p className="text-base text-foreground mb-6">
                Everyone is good at something but not all people are good at the same things. Some of 
                your friends may be good at singing; others are good at sports, art, or schoolwork. What 
                are you good at? Let's begin by identifying your talents, interests, and hobbies and 
                determine what entrepreneurial skills you have to offer your business.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => navigate(`/activities/${id}/learn`)}
                >
                  DO ACTIVITY AGAIN
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-clover-green text-clover-green hover:bg-clover-green/10"
                >
                  <Clipboard className="w-5 h-5 mr-2" />
                  MATERIALS NEEDED
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Grades 7-12</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-foreground">30 min</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Topics</h3>
                <Badge className="bg-primary text-primary-foreground">
                  Career Exploration
                </Badge>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Status</h3>
                <div className="flex items-center gap-2 text-clover-green">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
