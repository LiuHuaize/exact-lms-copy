import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  X,
  Play,
  Volume2,
  List,
  ArrowUp,
  Menu,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BlockNode, Section } from "@/content/types";
import { BlockRenderer } from "@/renderers/BlockRenderer";
import { validateLessonDocument } from "@/content/schema";

const ActivityLearn = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const lessons = [
    { title: "准备开始", completed: true },
    { title: "成为企业家需要具备什么？", completed: true },
    { title: "你的创业特质", completed: true },
    { title: "更进一步", completed: false },
  ];

  const flipCards = [
    {
      prompt: "什么是创业机会？",
      insight: "当你关注社区中的真实需求，并思考如何用自己的技能解决它时，机会便出现了。",
    },
    {
      prompt: "如何验证你的想法？",
      insight: "与潜在用户进行访谈，快速制作原型并收集反馈，持续迭代。",
    },
    {
      prompt: "什么让故事更有说服力？",
      insight: "讲述受益者的真实经历，强调你带来的改变与价值。",
    },
  ];

  const [flippedState, setFlippedState] = useState<Record<number, boolean>>({});

  const toggleFlip = (index: number) => {
    setFlippedState((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const quizTargets = [
    {
      id: "problem",
      title: "识别问题",
      description: "把正确的行动拖到这里",
      answer: "采访身边的人，了解真正的痛点",
    },
    {
      id: "solution",
      title: "设计解决方案",
      description: "把正确的行动拖到这里",
      answer: "画出一页式原型并演示你的想法",
    },
    {
      id: "story",
      title: "讲述故事",
      description: "把正确的行动拖到这里",
      answer: "分享如何帮助第一位用户的真实片段",
    },
  ];

  const quizOptions = [
    {
      id: "interview",
      label: "采访身边的人，了解真正的痛点",
      target: "problem",
    },
    {
      id: "prototype",
      label: "画出一页式原型并演示你的想法",
      target: "solution",
    },
    {
      id: "storytelling",
      label: "分享如何帮助第一位用户的真实片段",
      target: "story",
    },
  ];

  const [placedOptions, setPlacedOptions] = useState<Record<string, string | null>>(
    quizTargets.reduce((acc, target) => {
      acc[target.id] = null;
      return acc;
    }, {} as Record<string, string | null>)
  );

  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[] | null>(null);

  useEffect(() => {
    fetch("/content/lesson-001.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: unknown) => {
        const validation = validateLessonDocument(json);
        if (!validation.success) {
          console.group("[ActivityLearn] Lesson JSON validation issues");
          validation.issues.forEach((i) => console.warn(`${i.level.toUpperCase()}: ${i.message}`, i.path));
          console.groupEnd();
        }
        type MaybeLesson = { id?: string; sections?: unknown }
        const maybe = json as MaybeLesson
        const okSections = validation.data?.sections ?? (Array.isArray(maybe.sections) ? (maybe.sections as Section[]) : null);
        if (okSections) {
          console.info("[ActivityLearn] JSON lesson loaded", {
            lessonId: validation.data?.id ?? maybe.id,
            sections: okSections.length,
          });
          setSections(okSections);
        } else {
          console.warn("[ActivityLearn] Lesson JSON missing sections", json);
          setSections(null);
        }
      })
      .catch((error) => {
        console.error("[ActivityLearn] Failed to load lesson JSON", error);
        setSections(null);
      });
  }, []);

  const findBlock = (id: string): BlockNode | undefined => {
    if (!sections) return undefined;
    for (const s of sections) {
      const n = s.blocks.find((b) => b.id === id);
      if (n) return n as BlockNode;
    }
    return undefined;
  };

  const heroBlock = findBlock("b-hero");
  const audioBlock = findBlock("b-audio");
  const imageBlockOne = findBlock("b-image-1");
  const imageBlockTwo = findBlock("b-image-2");
  const videoBlock = findBlock("b-video");
  const outcomesBlock = findBlock("b-outcomes");
  const brandCardBlock = findBlock("b-brand");
  const flipCardsBlock = findBlock("b-flip");
  const dragMatchBlock = findBlock("b-drag");
  const tipsBlock = findBlock("b-tips");
  const ctaBlock = findBlock("b-cta");

  const handleDragStart = (id: string) => {
    setActiveDrag(id);
    setFeedback(null);
  };

  const handleDrop = (targetId: string) => {
    if (!activeDrag) return;

    const option = quizOptions.find((opt) => opt.id === activeDrag);
    if (!option) return;

    if (option.target === targetId) {
      setPlacedOptions((prev) => ({
        ...prev,
        [targetId]: option.label,
      }));
      setFeedback("太棒了！你正确完成了匹配。");
    } else {
      setFeedback("再试一次，思考一下这个行动更适合哪个阶段。");
    }

    setActiveDrag(null);
  };

  return (
    <div className="h-screen bg-muted flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="bg-white/95 backdrop-blur border-b border-border flex flex-col flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
          </div>
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              className="font-bold text-base hover:bg-transparent"
              onClick={() => navigate(`/activities/${id}`)}
            >
              退出活动
              <X className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main container with fixed layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-full h-full">
          {/* Left Sidebar - Fixed with independent scroll */}
          <aside className="w-[340px] bg-gradient-to-b from-[#0a514f] to-[#063330] text-white flex-shrink-0 h-full overflow-y-auto shadow-2xl border-r border-white/10">
            {/* Activity Title & Progress */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">创业技能</h2>
                <Menu className="w-5 h-5 text-white/60" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold tracking-wider">
                  <span>完成 75%</span>
                  <span className="text-white/80">3 / 4</span>
                </div>
                <Progress value={75} className="h-2 bg-white/10" />
              </div>
            </div>

            {/* Lesson List */}
            <div className="px-4 py-6 space-y-3">
              {lessons.map((lesson, index) => {
                const isActive = index === 0;
                const Icon = lesson.completed ? CheckCircle2 : Circle;

                return (
                  <button
                    key={index}
                    className={`group w-full text-left px-4 py-4 rounded-[18px] transition-all border ${
                      isActive
                        ? "bg-white text-foreground shadow-lg border-white"
                        : "bg-white/5 border-white/10 text-white/90 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                        isActive ? "border-clover-green/30 bg-clover-green/10 text-clover-green" : "border-white/20 bg-white/5 text-white"
                      }`}>
                        <List className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${
                          isActive ? "text-foreground" : "text-white"
                        }`}>{lesson.title}</div>
                        <p className={`text-xs mt-1 ${
                          isActive ? "text-muted-foreground" : "text-white/60"
                        }`}>
                          {isActive ? "第 1 课，共 4 课" : lesson.completed ? "已完成" : "进行中"}
                        </p>
                      </div>
                      <Icon className={`w-4 h-4 ${lesson.completed ? "text-clover-green" : "text-white/50"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content Area - Scrollable */}
          <main className="flex-1 h-full overflow-y-auto bg-muted flex flex-col">
            {/* Hero section (JSON-driven if available) */}
            {heroBlock ? (
              <BlockRenderer block={heroBlock} />
            ) : (
              <div className="relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
                    alt="Hero background"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#0a514f]/80" />
                </div>
                <div className="relative px-10 pt-14 pb-24 text-white">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col gap-4">
                      <span className="text-sm font-semibold tracking-[0.3em] uppercase text-white/70">
                        第 1 课，共 4 课
                      </span>
                      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">准备开始</h1>
                      <p className="text-base max-w-xl text-white/70">播放音频，投入创业思维。</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-3 text-sm font-medium text-white/80">
                      <ArrowUp className="w-4 h-4" />
                      <span>返回模块</span>
                    </div>
                  </div>
                </div>
                <div className="h-16 bg-white" style={{ clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0% 100%)" }} />
              </div>
            )}

            {/* Scrollable content */}
            <section className="px-10 py-12">
              <div className="max-w-5xl mx-auto">
                {audioBlock ? (
                  <BlockRenderer block={audioBlock} />
                ) : (
                  <div className="bg-white rounded-[32px] shadow-xl border border-muted-foreground/10 px-8 py-7 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-5">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
                          音频课程
                        </span>
                        <h2 className="text-2xl font-semibold text-foreground">准备开始 · 沉浸式引导</h2>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        播放导师的引导语，代入创业者角色。
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-[#f5f9f7] border border-[#d7ebe0] px-5 py-4 flex flex-wrap items-center gap-4">
                      <Button
                        size="icon"
                        className="h-12 w-12 rounded-full bg-[#0f6a60] text-white hover:bg-[#0c564d]"
                      >
                        <Play className="w-5 h-5 ml-0.5" />
                      </Button>
                      <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                        <Volume2 className="w-5 h-5 text-[#0f6a60]" />
                        <div className="flex-1 h-1 rounded-full bg-white shadow-inner">
                          <div className="h-full w-[46%] rounded-full bg-[#0f6a60]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                        <span>0:47</span>
                        <span>1x</span>
                        <List className="w-5 h-5 text-[#5c6f66]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="px-10 pb-12">
              {imageBlockOne ? (
                <BlockRenderer block={imageBlockOne} />
              ) : (
                <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(280px,320px)_1fr] gap-10 items-center">
                  <figure className="space-y-6">
                    <div className="rounded-[30px] overflow-hidden shadow-xl">
                      <div className="aspect-square">
                        <img
                          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                          alt="Entrepreneur"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <figcaption className="text-base leading-relaxed text-muted-foreground border-l-2 border-clover-green pl-5">
                      用全新视角观察身边的故事，寻找待解决的问题。
                    </figcaption>
                  </figure>
                  <div className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:self-center">
                    <p>
                      感谢你今天加入 CLOVER！我们很高兴与你一起学习如何像企业家一样思考。
                    </p>
                    <p>
                      本课围绕好奇心、创造力以及在日常生活中发现机会的能力展开。
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="px-10 pb-14">
              <div className="max-w-6xl mx-auto">
                {videoBlock ? (
                  <BlockRenderer block={videoBlock} />
                ) : (
                  <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-muted-foreground/10">
                    <div className="px-10 pt-12 pb-6 space-y-5">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-clover-green uppercase tracking-[0.2em]">
                        <Sparkles className="w-4 h-4" />
                        视频课堂
                      </div>
                      <div className="flex flex-col gap-3 max-w-3xl">
                        <h2 className="text-3xl leading-tight font-bold text-foreground">
                          灵感工作坊：观察 → 创造
                        </h2>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          观看短片，了解两位同龄人如何从校园生活的烦恼中，找到值得尝试的创意。
                          记录下你听到的关键故事片段与灵感闪光点。
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="inline-flex items-center gap-2 rounded-full bg-clover-green/12 text-clover-green px-4 py-2 font-medium">
                          真实案例
                        </span>
                        <span className="text-muted-foreground">时长 2 分钟 · 伴随字幕</span>
                      </div>
                    </div>
                    <div className="px-6 pb-12">
                      <AspectRatio ratio={16 / 9} className="rounded-[32px] overflow-hidden bg-[#0f3f3d]">
                        <video
                          controls
                          poster="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80"
                          className="h-full w-full object-cover"
                        >
                          <source
                            src="https://cdn.coverr.co/videos/coverr-young-innovators-discussing-ideas-4087/1080p.mp4"
                            type="video/mp4"
                          />
                          你的浏览器暂不支持视频播放。
                        </video>
                      </AspectRatio>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="px-10 pb-12">
              <div className="max-w-5xl mx-auto">
                {outcomesBlock ? (
                  <BlockRenderer block={outcomesBlock} />
                ) : (
                  <div className="bg-white rounded-3xl shadow-lg p-10 grid lg:grid-cols-[1fr_minmax(280px,320px)] gap-12 items-center">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-6">
                        完成本活动后，你将能够：
                      </h2>
                      <ul className="space-y-4 text-base text-muted-foreground">
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
                          <span>识别自己的才能、兴趣与爱好。</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
                          <span>明确自己已经具备哪些创业技能以启动创意。</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
                          <span>打造一段激发好奇心的电梯演讲。</span>
                        </li>
                      </ul>
                    </div>
                    <figure className="space-y-6">
                      <div className="rounded-3xl overflow-hidden shadow-lg">
                        <div className="aspect-square">
                          <img
                            src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=900&q=80"
                            alt="Students collaborating"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <figcaption className="text-base leading-relaxed text-muted-foreground border-l-2 border-clover-green/70 pl-5">
                        与团队共创时，随手记录能够推动创意的亮点。
                      </figcaption>
                    </figure>
                  </div>
                )}
              </div>
            </section>

              <section className="px-10 pb-12">
                {brandCardBlock ? (
                  <BlockRenderer block={brandCardBlock} />
                ) : (
                  <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0c5d52] via-[#0a514f] to-[#083d3b] rounded-[40px] text-white overflow-hidden shadow-2xl">
                    <div className="px-10 py-16 text-center">
                      <p className="text-sm uppercase tracking-[0.4em] text-white/70 mb-6">准备材料</p>
                      <h2 className="text-4xl lg:text-5xl font-bold mb-6">成为企业家需要具备什么？</h2>
                      <p className="text-base max-w-3xl mx-auto text-white/80">
                        一旦确认值得解决的问题，就该收集灵感与资源，让你的创意成真。
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <section className="px-10 pb-16">
                {imageBlockTwo ? (
                  <BlockRenderer block={imageBlockTwo} />
                ) : (
                  <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(280px,320px)_1fr] gap-12 items-center">
                    <figure className="space-y-6">
                      <div className="rounded-[32px] overflow-hidden shadow-xl">
                        <div className="aspect-square">
                          <img
                            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80"
                            alt="Young woman presenting"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <figcaption className="text-base leading-relaxed text-muted-foreground border-l-2 border-clover-green/70 pl-5">
                        让视觉素材保持呼吸感，更好地聚焦关键信息。
                      </figcaption>
                    </figure>
                    <div className="space-y-5 text-base leading-relaxed text-muted-foreground lg:self-center">
                      <p>
                        当你拥有一个商业创意时，需要用令人难忘的方式向潜在客户和支持者介绍它。
                      </p>
                      <p>
                        你的电梯演讲应突出要解决的问题、灵感来源以及能够创造的价值。
                      </p>
                      <p className="font-semibold text-foreground">
                        保持内容简洁、自然并充满自信。
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <section className="px-10 pb-16">
                <div className="max-w-6xl mx-auto space-y-8">
                  {flipCardsBlock ? (
                    <BlockRenderer block={flipCardsBlock} />
                  ) : (
                    <div className="bg-white rounded-[36px] shadow-xl p-10">
                      <div className="space-y-2 mb-10">
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
                          互动卡片
                        </span>
                        <h3 className="text-2xl font-semibold text-foreground">
                          翻转卡片掌握核心问题
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xl">
                          每张卡片都是创业故事中的关键节点。先思考，再翻转，看看实战经验给出的提示。
                        </p>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {flipCards.map((card, index) => {
                          const flipped = Boolean(flippedState[index]);
                          return (
                            <button
                              key={card.prompt}
                              onClick={() => toggleFlip(index)}
                              className="group h-60 [perspective:1200px]"
                            >
                              <div
                                className={`relative h-full w-full rounded-[28px] border border-muted-foreground/12 bg-gradient-to-br from-white to-white shadow-lg transition-transform duration-500 [transform-style:preserve-3d] ${
                                  flipped ? "[transform:rotateY(180deg)]" : ""
                                }`}
                              >
                                <div className="absolute inset-0 flex flex-col justify-between p-6 [backface-visibility:hidden]">
                                  <span className="text-sm font-semibold text-clover-green">点击翻转</span>
                                  <p className="text-lg font-semibold text-foreground leading-snug">{card.prompt}</p>
                                  <span className="text-sm text-muted-foreground">思考 30 秒后再翻转查看提示</span>
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-between rounded-[28px] bg-[#0a514f] p-6 text-white shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                                    灵感提示
                                  </span>
                                  <p className="text-lg leading-relaxed">{card.insight}</p>
                                  <span className="text-xs text-white/60">再次点击可回到问题面</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {dragMatchBlock ? (
                    <BlockRenderer block={dragMatchBlock} />
                  ) : (
                    <div className="bg-white rounded-[36px] shadow-xl p-10 space-y-8">
                    <div className="space-y-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
                        拖拽练习
                      </span>
                      <h3 className="text-2xl font-semibold text-foreground">
                        匹配创意打磨的 3 个步骤
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-2xl">
                        将下方选项拖拽到对应环节。完成匹配后，用一两句话总结创意的下一步行动。
                      </p>
                    </div>
                    <div className="space-y-10">
                      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 lg:justify-items-center">
                        {quizOptions.map((option) => {
                          const isUsed = Object.values(placedOptions).includes(option.label);
                          return (
                            <div
                              key={option.id}
                              draggable={!isUsed}
                              onDragStart={() => handleDragStart(option.id)}
                              className={`w-full lg:w-auto lg:justify-self-center rounded-full px-6 py-3 text-sm font-medium text-center transition ${
                                isUsed
                                  ? "bg-muted text-muted-foreground border border-dashed border-muted-foreground/30 cursor-not-allowed"
                                  : "bg-white border border-muted-foreground/20 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
                              }`}
                            >
                              {option.label}
                            </div>
                          );
                        })}
                      </div>
                      <div className="grid gap-6 lg:grid-cols-3">
                        {quizTargets.map((target, index) => (
                          <div
                            key={target.id}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={() => handleDrop(target.id)}
                            className="rounded-[28px] border-2 border-dashed border-[#0f6a60]/40 bg-[#f6fbf9] px-6 py-8 flex flex-col items-center text-center gap-4 transition hover:border-[#0f6a60]/80"
                          >
                            <div className="inline-flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#0f6a60]/40 text-sm font-semibold text-[#0f6a60]">
                                {index + 1}
                              </span>
                              <h4 className="text-base font-semibold text-foreground">{target.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed min-h-[72px] flex items-center justify-center">
                              {placedOptions[target.id] ?? target.description}
                            </p>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0f6a60]">
                              拖到这里
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      {feedback && (
                        <div
                          className={`rounded-3xl px-5 py-3 text-sm font-semibold ${
                            feedback.includes("太棒了")
                              ? "bg-clover-green/12 text-clover-green"
                              : "bg-[#fef3c7] text-[#92400e]"
                          }`}
                        >
                          {feedback}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        完成匹配后，记录你的行动力想法。
                      </p>
                    </div>
                  </div>
                  )}
                </div>
              </section>

            <section className="px-10 pb-16">
                <div className="max-w-5xl mx-auto">
                  {tipsBlock ? (
                    <BlockRenderer block={tipsBlock} />
                  ) : (
                    <div className="bg-white rounded-[36px] shadow-xl p-10 space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
                            深入思考
                          </span>
                          <h3 className="mt-2 text-2xl font-semibold text-foreground">展开小贴士，继续自我挑战</h3>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          根据你的节奏逐条阅读，每完成一条就写下一个具体行动。
                        </p>
                      </div>
                      <Accordion type="multiple" className="space-y-4">
                        <AccordionItem value="tip-1" className="border border-muted-foreground/10 rounded-2xl px-4">
                          <AccordionTrigger className="text-base font-semibold text-foreground">
                            将你的故事浓缩成 30 秒演讲
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            先用一句话说明你解决的问题，再用一句话强调你带来的独特价值，最后邀请听众采取行动。
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tip-2" className="border border-muted-foreground/10 rounded-2xl px-4">
                          <AccordionTrigger className="text-base font-semibold text-foreground">
                            设计一张“下一步行动”便利贴
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            写下你需要联系的人、准备的材料或要进行的测试，贴在显眼位置提醒自己持续推进。
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tip-3" className="border border-muted-foreground/10 rounded-2xl px-4">
                          <AccordionTrigger className="text-base font-semibold text-foreground">
                            邀请同伴给予即时反馈
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            分享你今天最大的收获，请对方提出一个问题或建议，并与你一起寻找可能的优化方向。
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>
              </section>

              <section className="px-10 pb-20">
                {ctaBlock ? (
                  <BlockRenderer block={ctaBlock} />
                ) : (
                  <div className="max-w-4xl mx-auto bg-white rounded-[36px] shadow-xl p-12 text-center space-y-6">
                    <h3 className="text-3xl lg:text-4xl font-bold text-foreground">更进一步</h3>
                    <p className="text-lg text-muted-foreground">
                      通过额外挑战、自我反思提示以及与你一样的青年创新者案例，继续你的创业之旅。
                    </p>
                    <Button
                      size="lg"
                      className="px-10 py-6 text-base font-semibold rounded-full"
                      onClick={() => navigate(`/activities/${id}`)}
                    >
                      完成活动
                    </Button>
                  </div>
                )}
              </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ActivityLearn;
