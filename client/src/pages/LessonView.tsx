import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  BookOpen, ArrowLeft, ArrowRight, CheckCircle2, Clock, ChevronRight,
  FileText, PlayCircle, Award, List, X
} from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || "0");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [startTime] = useState(Date.now());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: lesson, isLoading: lessonLoading } = trpc.course.getLesson.useQuery({ lessonId });
  const { data: module } = trpc.course.getModule.useQuery(
    { moduleId: lesson?.moduleId || 0 },
    { enabled: !!lesson }
  );
  const { data: lessons } = trpc.course.getLessons.useQuery(
    { moduleId: lesson?.moduleId || 0 },
    { enabled: !!lesson }
  );
  const { data: progress, refetch: refetchProgress } = trpc.progress.getUserProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateLessonProgress = trpc.progress.updateLessonProgress.useMutation({
    onSuccess: () => refetchProgress(),
  });

  useEffect(() => {
    return () => {
      if (lesson && isAuthenticated) {
        const timeSpent = Math.round((Date.now() - startTime) / 60000);
        if (timeSpent > 0) {
          updateLessonProgress.mutate({ lessonId: lesson.id, timeSpentMinutes: timeSpent });
        }
      }
    };
  }, [lesson, isAuthenticated, startTime]);

  if (authLoading || lessonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">الدرس غير موجود</p>
          <Link href="/modules">
            <Button className="mt-4">العودة إلى الوحدات</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getLessonProgress = (lId: number) => progress?.lessons.find(l => l.lessonId === lId);
  const lessonProgress = getLessonProgress(lessonId);
  const isCompleted = lessonProgress?.completed || false;

  const currentIndex = lessons?.findIndex(l => l.id === lessonId) ?? 0;
  const previousLesson = currentIndex > 0 ? lessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex < (lessons?.length || 0) - 1 ? lessons?.[currentIndex + 1] : null;
  const completedCount = lessons?.filter(l => getLessonProgress(l.id)?.completed).length || 0;
  const totalLessons = lessons?.length || 0;

  const handleMarkComplete = async () => {
    try {
      await updateLessonProgress.mutateAsync({ lessonId: lesson.id, completed: true });
      toast.success("تم تحديد الدرس كمكتمل!");
    } catch {
      toast.error("حدث خطأ أثناء حفظ التقدم");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-40 items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png" alt="ALMOG" className="h-36" />
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground leading-none">شركة المُق للخدمات النفطية</p>
                <p className="text-sm font-bold leading-tight">منصة التدريب التقني</p>
              </div>
            </div>
          </Link>

          {/* Module progress indicator */}
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{module?.titleAr}</span>
              <span>{completedCount}/{totalLessons}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: totalLessons > 0 ? `${(completedCount / totalLessons) * 100}%` : '0%' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lesson list toggle */}
            <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <List className="h-4 w-4 ml-1" />
              <span className="hidden sm:inline">قائمة الدروس</span>
            </Button>
            <Link href={`/module/${lesson.moduleId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 ml-1" />
                <span className="hidden sm:inline">الوحدة</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Slide-in Lesson Sidebar */}
        {sidebarOpen && (
          <aside className="fixed inset-y-0 right-0 z-40 w-72 bg-background border-l shadow-xl flex flex-col pt-16">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-sm">دروس الوحدة</h3>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {lessons?.map((l, idx) => {
                const lp = getLessonProgress(l.id);
                const done = lp?.completed || false;
                const isCurrent = l.id === lessonId;
                return (
                  <button
                    key={l.id}
                    onClick={() => { setLocation(`/lesson/${l.id}`); setSidebarOpen(false); }}
                    className={`w-full text-right px-4 py-3 flex items-center gap-3 text-sm hover:bg-muted transition-colors ${isCurrent ? 'bg-primary/10 border-r-2 border-primary' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      done ? 'bg-green-500 text-white' : isCurrent ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span className={`flex-1 leading-tight ${isCurrent ? 'font-semibold' : ''}`}>{l.titleAr}</span>
                    {l.estimatedMinutes && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">{l.estimatedMinutes}د</span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Quiz button at bottom of sidebar */}
            <div className="p-4 border-t">
              <Button
                onClick={() => { setLocation(`/quiz/${lesson.moduleId}`); setSidebarOpen(false); }}
                size="sm"
                className="w-full"
                variant="outline"
              >
                <Award className="ml-2 h-4 w-4" />
                اختبار الوحدة
              </Button>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 container py-6 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
            <Link href="/modules">
              <span className="hover:text-foreground cursor-pointer">الوحدات</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/module/${lesson.moduleId}`}>
              <span className="hover:text-foreground cursor-pointer">{module?.titleAr}</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">الدرس {lesson.lessonNumber}</span>
          </nav>

          {/* Lesson header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    الدرس {lesson.lessonNumber} من {totalLessons}
                  </Badge>
                  {isCompleted && (
                    <Badge className="text-xs bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      مكتمل
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-snug">{lesson.titleAr}</h1>
                {lesson.titleEn && (
                  <p className="text-muted-foreground text-sm mt-1">{lesson.titleEn}</p>
                )}
              </div>
            </div>

            {lesson.estimatedMinutes && (
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>الزمن التقديري: {lesson.estimatedMinutes} دقيقة</span>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Image */}
          {lesson.imageUrl && (
            <div className="mb-6 rounded-xl overflow-hidden shadow-md">
              <img
                src={lesson.imageUrl}
                alt={lesson.titleAr || lesson.titleEn || 'Lesson illustration'}
                className="w-full object-cover max-h-72"
              />
            </div>
          )}

          {/* Video */}
          {lesson.videoUrl && (
            <div className="mb-6">
              <Card>
                <CardContent className="p-0">
                  <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">فيديو الدرس</span>
                  </div>
                  <video controls className="w-full rounded-b-lg" src={lesson.videoUrl}>
                    متصفحك لا يدعم تشغيل الفيديو
                  </video>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lesson Content */}
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="markdown-content prose prose-lg max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-foreground prose-p:leading-relaxed
                prose-strong:text-foreground
                prose-li:text-foreground
                prose-table:text-sm
                prose-th:bg-muted prose-th:p-2
                prose-td:p-2 prose-td:border prose-td:border-border
                prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
              ">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {lesson.contentMarkdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Complete + Navigation */}
          <div className="space-y-4">
            {/* Mark complete button */}
            {!isCompleted && (
              <div className="flex justify-center">
                <Button
                  onClick={handleMarkComplete}
                  disabled={updateLessonProgress.isPending}
                  size="lg"
                  className="gap-2 px-8"
                >
                  {updateLessonProgress.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                  تحديد الدرس كمكتمل
                </Button>
              </div>
            )}

            {isCompleted && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-6 py-3">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">تم إكمال هذا الدرس</span>
                </div>
              </div>
            )}

            {/* Prev / Next navigation */}
            <div className="flex items-center justify-between gap-4 pt-2">
              {previousLesson ? (
                <Button
                  variant="outline"
                  onClick={() => setLocation(`/lesson/${previousLesson.id}`)}
                  className="flex-1 max-w-[200px]"
                >
                  <ArrowLeft className="ml-2 h-4 w-4" />
                  الدرس السابق
                </Button>
              ) : (
                <Link href={`/module/${lesson.moduleId}`}>
                  <Button variant="ghost" className="flex-1 max-w-[200px]">
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    الوحدة
                  </Button>
                </Link>
              )}

              {nextLesson ? (
                <Button
                  onClick={() => setLocation(`/lesson/${nextLesson.id}`)}
                  className="flex-1 max-w-[200px]"
                >
                  الدرس التالي
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setLocation(`/quiz/${lesson.moduleId}`)}
                  className="flex-1 max-w-[200px] bg-amber-600 hover:bg-amber-700"
                >
                  <Award className="ml-2 h-4 w-4" />
                  اختبار الوحدة
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
