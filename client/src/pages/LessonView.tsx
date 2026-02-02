import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle2, Clock } from "lucide-react";
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

  const { data: lesson, isLoading: lessonLoading } = trpc.course.getLesson.useQuery({ lessonId });
  const { data: module } = trpc.course.getModule.useQuery(
    { moduleId: lesson?.moduleId || 0 },
    { enabled: !!lesson }
  );
  const { data: lessons } = trpc.course.getLessons.useQuery(
    { moduleId: lesson?.moduleId || 0 },
    { enabled: !!lesson }
  );
  const { data: progress } = trpc.progress.getUserProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateLessonProgress = trpc.progress.updateLessonProgress.useMutation();

  useEffect(() => {
    // Track time spent on lesson
    return () => {
      if (lesson && isAuthenticated) {
        const timeSpent = Math.round((Date.now() - startTime) / 60000); // Convert to minutes
        if (timeSpent > 0) {
          // Don't send completed field to avoid overwriting user's completion status
          updateLessonProgress.mutate({
            lessonId: lesson.id,
            timeSpentMinutes: timeSpent,
          });
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

  const lessonProgress = progress?.lessons.find(l => l.lessonId === lessonId);
  const isCompleted = lessonProgress?.completed || false;

  const currentIndex = lessons?.findIndex(l => l.id === lessonId) || 0;
  const previousLesson = currentIndex > 0 ? lessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex < (lessons?.length || 0) - 1 ? lessons?.[currentIndex + 1] : null;

  const handleMarkComplete = async () => {
    try {
      await updateLessonProgress.mutateAsync({
        lessonId: lesson.id,
        completed: true,
      });
      toast.success("تم تحديد الدرس كمكتمل!");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ التقدم");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer">
              <img src="/almog-logo.gif" alt="ALMOG" className="h-16" />
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">منصة دورة EPF</h1>
              </div>
            </div>
          </Link>
          <Link href={`/module/${lesson.moduleId}`}>
            <Button variant="outline">
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة إلى الوحدة
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-4xl">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{module?.titleAr}</span>
            <span>•</span>
            <span>الدرس {lesson.lessonNumber}</span>
          </div>
          
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold flex-1">{lesson.titleAr}</h1>
            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-sm font-medium">مكتمل</span>
              </div>
            )}
          </div>

          {lesson.estimatedMinutes && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>الزمن التقديري: {lesson.estimatedMinutes} دقيقة</span>
            </div>
          )}
        </div>

        {/* Video (if available) */}
        {lesson.videoUrl && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-0">
                <video
                  controls
                  className="w-full rounded-lg"
                  src={lesson.videoUrl}
                >
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lesson Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="markdown-content prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {lesson.contentMarkdown}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {!isCompleted && (
            <Button
              onClick={handleMarkComplete}
              disabled={updateLessonProgress.isPending}
              className="flex-1 sm:flex-none"
            >
              <CheckCircle2 className="ml-2 h-4 w-4" />
              تحديد كمكتمل
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {previousLesson ? (
            <Button
              variant="outline"
              onClick={() => setLocation(`/lesson/${previousLesson.id}`)}
              className="flex-1"
            >
              <ArrowLeft className="ml-2 h-4 w-4" />
              الدرس السابق
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          {nextLesson ? (
            <Button
              onClick={() => setLocation(`/lesson/${nextLesson.id}`)}
              className="flex-1"
            >
              الدرس التالي
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          ) : (
            <Link href={`/quiz/${lesson.moduleId}`}>
              <Button className="flex-1">
                اختبار الوحدة
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
