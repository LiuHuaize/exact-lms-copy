export type LessonNavMeta = {
  id: string;
  title: string;
  order: number;
  completed: boolean;
  assetUrl: string;
};

const lessonAsset = (file: string) => new URL(`../../content/lessons/${file}`, import.meta.url).href;

export const lessonManifest: LessonNavMeta[] = [
  {
    id: "lesson-001",
    title: "准备开始",
    order: 1,
    completed: true,
    assetUrl: lessonAsset("lesson-001.json"),
  },
  {
    id: "lesson-002",
    title: "成为企业家需要具备什么？",
    order: 2,
    completed: true,
    assetUrl: lessonAsset("lesson-002.json"),
  },
  {
    id: "lesson-003",
    title: "你的创业特质",
    order: 3,
    completed: true,
    assetUrl: lessonAsset("lesson-003.json"),
  },
  {
    id: "lesson-004",
    title: "更进一步",
    order: 4,
    completed: false,
    assetUrl: lessonAsset("lesson-004.json"),
  },
];

export const lessonManifestById = lessonManifest.reduce<Record<string, LessonNavMeta>>((map, lesson) => {
  map[lesson.id] = lesson;
  return map;
}, {});

export const resolveLessonAsset = (lessonId: string): string | undefined => {
  return lessonManifestById[lessonId]?.assetUrl;
};
