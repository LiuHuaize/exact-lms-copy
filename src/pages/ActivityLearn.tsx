import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Menu, CheckCircle2, Circle, List } from "lucide-react";
import type { Section } from "@/content/types";
import { validateLessonDocument } from "@/content/schema";
import { LessonRenderer } from "@/renderers/LessonRenderer";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { lessonManifest, resolveLessonAsset, type LessonNavMeta } from "@/content/lessonManifest";

const ActivityLearn = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sections, setSections] = useState<Section[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lessonTitles, setLessonTitles] = useState<Record<string, string>>({});
  const fallbackLesson = lessonManifest[0];
  const resolvedFromParams = useMemo(() => {
    if (typeof id === "string") {
      const trimmed = id.trim();
      if (trimmed && resolveLessonAsset(trimmed)) {
        return trimmed;
      }
    }
    return fallbackLesson?.id ?? "lesson-001";
  }, [id, fallbackLesson?.id]);

  const [activeLessonId, setActiveLessonId] = useState<string>(resolvedFromParams);

  useEffect(() => {
    setActiveLessonId((current) => (current === resolvedFromParams ? current : resolvedFromParams));
  }, [resolvedFromParams]);

  const activeLessonMeta = useMemo<LessonNavMeta | undefined>(
    () => lessonManifest.find((item) => item.id === activeLessonId) ?? fallbackLesson,
    [activeLessonId, fallbackLesson],
  );

  const navLessons = useMemo(
    () =>
      lessonManifest.map((lesson) => ({
        ...lesson,
        title: lessonTitles[lesson.id] ?? lesson.title,
      })),
    [lessonTitles],
  );

  const totalLessons = lessonManifest.length;
  const completedLessons = lessonManifest.filter((lesson) => lesson.completed).length;
  const completionPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const fetchCandidates = useMemo(() => {
    const candidates: { lessonId: string; url: string }[] = [];
    if (activeLessonMeta?.assetUrl) {
      candidates.push({ lessonId: activeLessonMeta.id, url: activeLessonMeta.assetUrl });
    }

    if (typeof id === "string") {
      const normalized = id.trim();
      if (normalized) {
        const assetFromParam = resolveLessonAsset(normalized);
        if (assetFromParam && !candidates.some((item) => item.lessonId === normalized)) {
          candidates.push({ lessonId: normalized, url: assetFromParam });
        }
      }
    }

    if (fallbackLesson?.assetUrl && !candidates.some((item) => item.lessonId === fallbackLesson.id)) {
      candidates.push({ lessonId: fallbackLesson.id, url: fallbackLesson.assetUrl });
    }

    return candidates;
  }, [activeLessonMeta, fallbackLesson, id]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setLoadError(null);
    setSections(null);

    const load = async () => {
      let lastError: Error | null = null;

      for (const candidate of fetchCandidates) {
        try {
          const res = await fetch(candidate.url);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          const json = await res.json();
          const validation = validateLessonDocument(json);
          if (!validation.success) {
            console.group("[ActivityLearn] Lesson JSON validation issues");
            validation.issues.forEach((issue) =>
              console.warn(`${issue.level.toUpperCase()}: ${issue.message}`, issue.path),
            );
            console.groupEnd();
          }

          if (!mounted) return;

          type MaybeLesson = { id?: string; title?: string; sections?: unknown };
          const doc = json as MaybeLesson;
          const okSections =
            validation.data?.sections ?? (Array.isArray(doc.sections) ? (doc.sections as Section[]) : null);

          if (!okSections) {
            console.warn("[ActivityLearn] Lesson JSON missing sections", { path: candidate.url, payload: json });
            lastError = new Error("Lesson JSON missing sections");
            continue;
          }

          const resolvedTitle = validation.data?.title ?? doc.title;
          if (resolvedTitle) {
            setLessonTitles((prev) => {
              if (prev[candidate.lessonId] === resolvedTitle) return prev;
              return { ...prev, [candidate.lessonId]: resolvedTitle };
            });
          }

          console.info("[ActivityLearn] Lesson JSON loaded", {
            source: candidate.url,
            lessonId: validation.data?.id ?? doc.id,
            sections: okSections.length,
          });

          setSections(okSections);
          setLoadError(null);
          setIsLoading(false);
          if (candidate.lessonId !== activeLessonId) {
            setActiveLessonId(candidate.lessonId);
          }
          return;
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          lastError = err;
          console.warn("[ActivityLearn] Failed to load lesson JSON candidate", {
            candidate,
            error: err,
          });
        }
      }

      if (!mounted) return;

      if (lastError) {
        console.error("[ActivityLearn] Failed to load lesson JSON", lastError);
      }
      setLoadError("加载课程内容失败");
      setIsLoading(false);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [activeLessonId, fetchCandidates]);

  return (
    <div className="h-screen bg-muted flex flex-col overflow-hidden">
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

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-full h-full">
          <aside className="w-[340px] bg-gradient-to-b from-[#0a514f] to-[#063330] text-white flex-shrink-0 h-full overflow-y-auto shadow-2xl border-r border-white/10">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">创业技能</h2>
                <Menu className="w-5 h-5 text-white/60" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold tracking-wider">
                  <span>完成 {completionPercent}%</span>
                  <span className="text-white/80">
                    {completedLessons} / {totalLessons}
                  </span>
                </div>
                <Progress value={completionPercent} className="h-2 bg-white/10" />
              </div>
            </div>

            <div className="px-4 py-6 space-y-3">
              {navLessons.map((lesson) => {
                const isActive = lesson.id === activeLessonId;
                const Icon = lesson.completed ? CheckCircle2 : Circle;
                const subtitle = isActive
                  ? `第 ${lesson.order} 课，共 ${totalLessons} 课`
                  : lesson.completed
                    ? "已完成"
                    : "进行中";
                return (
                  <button
                    type="button"
                    key={lesson.id}
                    className={`group w-full text-left px-4 py-4 rounded-[18px] transition-all border ${
                      isActive
                        ? "bg-white text-foreground shadow-lg border-white"
                        : "bg-white/5 border-white/10 text-white/90 hover:bg-white/10"
                    }`}
                    onClick={() => {
                      if (!isActive) {
                        setActiveLessonId(lesson.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                          isActive
                            ? "border-clover-green/30 bg-clover-green/10 text-clover-green"
                            : "border-white/20 bg-white/5 text-white"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-white"}`}>
                          {lesson.title}
                        </div>
                        <p className={`text-xs mt-1 ${isActive ? "text-muted-foreground" : "text-white/60"}`}>
                          {subtitle}
                        </p>
                      </div>
                      <Icon className={`w-4 h-4 ${lesson.completed ? "text-clover-green" : "text-white/50"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="flex-1 h-full overflow-y-auto bg-muted flex flex-col">
            {isLoading && (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                正在加载课程内容...
              </div>
            )}
            {!isLoading && loadError && (
              <div className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-md rounded-3xl border border-border bg-white p-6 text-center shadow">
                  <p className="text-sm text-muted-foreground">{loadError}</p>
                  <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
                    刷新重试
                  </Button>
                </div>
              </div>
            )}
            {!isLoading && !loadError && Array.isArray(sections) && (
              <div className="flex-1">
                <LessonRenderer sections={sections} />
              </div>
            )}
            {!isLoading && !loadError && !sections && (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                暂无课程内容。
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ActivityLearn;
