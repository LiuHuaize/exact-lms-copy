import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  GraduationCap,
  CheckCircle,
  Clipboard,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ActivityDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#f4f8f5]">
      <Header />

      <div className="relative">
        {/* Hero Image Section */}
        <section className="relative h-[260px] md:h-[320px] lg:h-[360px]">
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 78%, 0 100%)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=600&fit=crop"
              alt="Activity"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f4f8f5] to-transparent" />
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-10 -mt-10 md:-mt-16 lg:-mt-20 pb-20 relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
            {/* Main Content */}
            <section className="bg-white rounded-[32px] shadow-xl p-8 md:p-10 lg:p-12">
              <Badge className="bg-clover-green/10 text-clover-green border border-clover-green/20 px-3 py-1 text-xs uppercase tracking-[0.35em]">
                职业探索
              </Badge>
              <h1 className="mt-6 text-3xl md:text-4xl lg:text-[42px] font-bold text-foreground">
                像企业家一样思考
              </h1>
              <p className="mt-4 text-sm md:text-base text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-clover-green" />
                作者：Claudia Mincemoyer 博士（宾夕法尼亚州立大学名誉教授）
              </p>

              <div className="mt-6 space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  你具备创业思维吗？本活动将帮助你了解自己的才能、兴趣与爱好如何与商业创意相结合。
                </p>
                <p>
                  每个人都有擅长的事情，但不一定擅长相同的领域。有人善于歌唱、绘画或编程，也有人擅长带领团队、组织活动或解决技术问题。
                </p>
                <p>
                  我们将一起梳理你的优势，发现机会，并想象如何把你的热情转化为现实世界的解决方案。
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  className="bg-clover-green text-white hover:bg-clover-green/90 px-8 md:px-10"
                  onClick={() => navigate(`/activities/${id}/learn`)}
                >
                  继续活动
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-clover-green text-clover-green hover:bg-clover-green/10 px-8 md:px-9"
                >
                  <Clipboard className="w-5 h-5 mr-2" />
                  需要的材料
                </Button>
              </div>
            </section>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-[28px] bg-white shadow-xl p-6 border border-white/80">
                <h3 className="font-semibold text-lg text-foreground mb-4">概览</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-2xl bg-clover-green/10 text-clover-green flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">适合 7–12 年级</p>
                      <p>为充满好奇的改变者设计。</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-2xl bg-clover-green/10 text-clover-green flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">30 分钟</p>
                      <p>课堂或社团时间的理想选择。</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-gradient-to-br from-white to-[#eaf5ee] shadow-xl p-6 border border-white/60">
                <h3 className="font-semibold text-lg text-foreground mb-4">主题</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-clover-green text-white hover:bg-clover-green">
                    职业探索
                  </Badge>
                  <Badge className="bg-white text-clover-green border border-clover-green/50">
                    创造力
                  </Badge>
                </div>
              </div>

              <div className="rounded-[28px] bg-white shadow-xl p-6 border border-white">
                <h3 className="font-semibold text-lg text-foreground mb-4">状态</h3>
                <div className="flex items-center gap-3 text-clover-green">
                  <span className="h-10 w-10 rounded-full bg-clover-green/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">已完成</p>
                    <p className="text-sm text-muted-foreground">做得很好！继续保持动力。</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
