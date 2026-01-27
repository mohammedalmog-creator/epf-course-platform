import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, CheckCircle2, Clock, ArrowRight, ArrowLeft, FileText } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { getLoginUrl } from "@/const";

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const moduleId = parseInt(id || "0");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: module, isLoading: moduleLoading } = trpc.course.getModule.useQuery({ moduleId });
  const { data: lessons, isLoading: lessonsLoading } = trpc.course.getLessons.useQuery({ moduleId });
  const { data: progress } = trpc.progress.getUserProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading || moduleLoading || lessonsLoading) {
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

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">الوحدة غير موجودة</p>
          <Link href="/modules">
            <Button className="mt-4">العودة إلى الوحدات</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getLessonProgress = (lessonId: number) => {
    return progress?.lessons.find(l => l.lessonId === lessonId);
  };

  const completedLessons = lessons?.filter(lesson => 
    getLessonProgress(lesson.id)?.completed
  ).length || 0;

  const totalLessons = lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">منصة دورة EPF</h1>
            </div>
          </Link>
          <Link href="/modules">
            <Button variant="outline">
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة إلى الوحدات
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl">
              {module.moduleNumber}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{module.titleAr}</h2>
              {module.titleEn && (
                <p className="text-muted-foreground mt-1">{module.titleEn}</p>
              )}
            </div>
          </div>

          {module.descriptionAr && (
            <p className="text-lg text-muted-foreground mb-4">
              {module.descriptionAr}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>المدة: {module.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{totalLessons} دروس</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span>مكتمل: {completedLessons}/{totalLessons}</span>
            </div>
          </div>

          {progressPercentage > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">التقدم الإجمالي</span>
                <span className="text-muted-foreground">{progressPercentage}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold mb-4">الدروس</h3>
          {lessons?.map((lesson, index) => {
            const lessonProgress = getLessonProgress(lesson.id);
            const isCompleted = lessonProgress?.completed || false;

            return (
              <Card
                key={lesson.id}
                className="hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setLocation(`/lesson/${lesson.id}`)}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {lesson.lessonNumber}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {lesson.titleAr}
                      </CardTitle>
                      {lesson.estimatedMinutes && (
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{lesson.estimatedMinutes} دقيقة</span>
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCompleted && (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    )}
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Quiz Button */}
        {totalLessons > 0 && (
          <div className="mt-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>اختبار الوحدة</CardTitle>
                <CardDescription>
                  اختبر معرفتك بعد إكمال جميع الدروس
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setLocation(`/quiz/${moduleId}`)}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  بدء الاختبار
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
