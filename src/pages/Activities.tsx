import { useState } from "react";
import { Header } from "@/components/Header";
import { ActivityCard } from "@/components/ActivityCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Activities = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const activities = [
    {
      id: 1,
      title: "Animal U: Careers",
      subtitle: "Animal U Careers",
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Entrepreneurship: What Are the Risks?",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Entrepreneurial Skills",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Thinking Like an Entrepreneur",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Leadership Development",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Community Service Projects",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative">
        {/* Decorative green angle */}
        <div className="absolute left-0 top-0 w-64 h-80 bg-primary" 
             style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} 
        />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white shadow-sm h-12"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-bold text-sm uppercase text-foreground">Filter By</span>
              
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="TOPICS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="career">Career Exploration</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="stem">STEM</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="GRADE" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="k-3">K-3</SelectItem>
                  <SelectItem value="4-6">4-6</SelectItem>
                  <SelectItem value="7-12">7-12</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="TYPE" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="DURATION" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="short">Under 15 min</SelectItem>
                  <SelectItem value="medium">15-30 min</SelectItem>
                  <SelectItem value="long">30+ min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold uppercase text-foreground">
              {activities.length} Results Found
            </h2>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[140px] border-2 border-primary text-primary font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">NEWEST</SelectItem>
                <SelectItem value="oldest">OLDEST</SelectItem>
                <SelectItem value="popular">POPULAR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                subtitle={activity.subtitle}
                image={activity.image}
                onClick={() => navigate(`/activities/${activity.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
