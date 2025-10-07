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
              欢迎来到 <span className="text-clover-green">CLOVER</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              由 4-H 驱动的学习管理系统
            </p>
            <p className="text-lg mb-12 max-w-2xl mx-auto">
              通过参与创业与职业发展课程，探索动手活动、培养新技能，并成长为领导者。
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-lg px-8"
                onClick={() => navigate("/activities")}
              >
                浏览课程活动
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8"
              >
                查看学习进度
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
                <h3 className="font-bold text-lg mb-2">互动学习</h3>
                <p className="text-muted-foreground">
                  通过多媒体内容与动手实践保持投入
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h3 className="font-bold text-lg mb-2">追踪进度</h3>
                <p className="text-muted-foreground">
                  记录你的成果，庆祝每一个里程碑
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🏆</span>
                </div>
                <h3 className="font-bold text-lg mb-2">赢得认可</h3>
                <p className="text-muted-foreground">
                  提升等级，在排行榜上争夺荣誉
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
