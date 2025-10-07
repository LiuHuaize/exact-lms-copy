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
      title: "动物大学：职业探索",
      subtitle: "动物大学职业课程",
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "创业：潜在风险是什么？",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "创业技能",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "像企业家一样思考",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "领导力发展",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "社区服务项目",
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
                placeholder="按标题搜索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white shadow-sm h-12"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-bold text-sm uppercase text-foreground">筛选条件</span>
              
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="主题" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部主题</SelectItem>
                  <SelectItem value="career">职业探索</SelectItem>
                  <SelectItem value="leadership">领导力</SelectItem>
                  <SelectItem value="stem">STEM</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="年级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部年级</SelectItem>
                  <SelectItem value="k-3">K-3</SelectItem>
                  <SelectItem value="4-6">4-6</SelectItem>
                  <SelectItem value="7-12">7-12</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="activity">活动</SelectItem>
                  <SelectItem value="lesson">课程</SelectItem>
                  <SelectItem value="project">项目</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="时长" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部时长</SelectItem>
                  <SelectItem value="short">15 分钟以内</SelectItem>
                  <SelectItem value="medium">15-30 分钟</SelectItem>
                  <SelectItem value="long">30 分钟以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold uppercase text-foreground">
              共找到 {activities.length} 个结果
            </h2>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[140px] border-2 border-primary text-primary font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新</SelectItem>
                <SelectItem value="oldest">最早</SelectItem>
                <SelectItem value="popular">最热门</SelectItem>
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
