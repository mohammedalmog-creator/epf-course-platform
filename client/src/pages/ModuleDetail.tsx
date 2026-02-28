import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  BookOpen, CheckCircle2, Clock, ArrowRight, ArrowLeft, FileText,
  PlayCircle, Award, ChevronRight, Layers, Timer, BarChart3, Lock
} from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { getLoginUrl } from "@/const";

// Map lesson number to an icon for visual variety
function getLessonIcon(lessonNumber: number) {
  const icons = [BookOpen, FileText, PlayCircle, Layers, Timer, BarChart3, Award, ChevronRight];
  const Icon = icons[(lessonNumber - 1) % icons.length];
  return Icon;
}

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
  const { data: quizAttempts } = trpc.quiz.getUserAttempts.useQuery({ moduleId }, {
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
  const allLessonsCompleted = completedLessons === totalLessons && totalLessons > 0;

  const latestQuizAttempt = quizAttempts?.[0];
  const quizPassed = latestQuizAttempt && (latestQuizAttempt.score / latestQuizAttempt.totalQuestions) >= 0.7;
  const quizScore = latestQuizAttempt
    ? Math.round((latestQuizAttempt.score / latestQuizAttempt.totalQuestions) * 100)
    : null;
  const totalQuizAttempts = quizAttempts?.length || 0;

  // Estimate total time
  const totalMinutes = lessons?.reduce((sum, l) => sum + (l.estimatedMinutes || 10), 0) || 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const durationText = totalHours > 0
    ? `${totalHours} ساعة${remainingMinutes > 0 ? ` و${remainingMinutes} دقيقة` : ''}`
    : `${totalMinutes} دقيقة`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-40 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png" alt="ALMOG" className="h-36" />
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground leading-none">شركة المُق للخدمات النفطية</p>
                <p className="text-sm font-bold leading-tight">منصة التدريب التقني</p>
              </div>
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

      {/* Module Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container py-8">
          <div className="flex items-start gap-5">
            {/* Module number badge */}
            <div className="flex-shrink-0 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white font-bold text-3xl shadow-lg">
              {module.moduleNumber}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {(module as any).courseId === 2 ? 'صيانة رأس البئر' : 'دورة EPF'}
                </Badge>
                {allLessonsCompleted && (
                  <Badge className="text-xs bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    مكتملة
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">{module.titleAr}</h2>
              {module.titleEn && (
                <p className="text-muted-foreground mt-1 text-sm">{module.titleEn}</p>
              )}
              {module.descriptionAr && (
                <p className="text-muted-foreground mt-2 max-w-2xl">{module.descriptionAr}</p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{durationText}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{totalLessons} دروس</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>مكتمل: {completedLessons}/{totalLessons}</span>
                </div>
                {quizScore !== null && (
                  <div className={`flex items-center gap-1.5 ${quizPassed ? 'text-green-600' : 'text-yellow-600'}`}>
                    <Award className="h-4 w-4" />
                    <span>الاختبار: {quizScore}% ({totalQuizAttempts} {totalQuizAttempts === 1 ? 'محاولة' : 'محاولات'})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {progressPercentage > 0 && (
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">التقدم في الوحدة</span>
                <span className="text-muted-foreground">{progressPercentage}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons List — takes 2/3 */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              محتوى الوحدة
            </h3>
            {lessons?.map((lesson, index) => {
              const lessonProgress = getLessonProgress(lesson.id);
              const isCompleted = lessonProgress?.completed || false;
              const LessonIcon = getLessonIcon(lesson.lessonNumber);

              return (
                <Card
                  key={lesson.id}
                  className={`hover:shadow-md transition-all cursor-pointer group border-l-4 ${
                    isCompleted ? 'border-l-green-500 bg-green-50/30' : 'border-l-transparent hover:border-l-primary'
                  }`}
                  onClick={() => setLocation(`/lesson/${lesson.id}`)}
                >
                  <CardHeader className="py-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Lesson icon */}
                      <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <LessonIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">الدرس {lesson.lessonNumber}</span>
                          {isCompleted && (
                            <Badge variant="outline" className="text-[10px] text-green-600 border-green-300 py-0">
                              مكتمل
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base mt-0.5 group-hover:text-primary transition-colors leading-snug">
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
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Sidebar — takes 1/3 */}
          <div className="space-y-4">
            {/* Quiz card */}
            <Card className={`${quizPassed ? 'border-green-400 bg-green-50/50' : 'border-primary/20 bg-primary/5'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Award className={`h-5 w-5 ${quizPassed ? 'text-green-600' : 'text-primary'}`} />
                  <CardTitle className="text-base">اختبار الوحدة</CardTitle>
                </div>
                <CardDescription>
                  {quizPassed
                    ? `اجتزت الاختبار بنجاح — ${quizScore}%`
                    : 'اختبر معرفتك بعد إكمال الدروس'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quizScore !== null && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>آخر نتيجة</span>
                      <span>{quizScore}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${quizPassed ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${quizScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      عدد المحاولات: {totalQuizAttempts}
                    </p>
                  </div>
                )}
                <Button
                  onClick={() => setLocation(`/quiz/${moduleId}`)}
                  size="sm"
                  className="w-full"
                  variant={quizPassed ? 'outline' : 'default'}
                >
                  {quizPassed ? 'إعادة الاختبار' : 'بدء الاختبار'}
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
                {quizPassed && (
                  <Button
                    onClick={() => setLocation(`/certificate/${moduleId}`)}
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Award className="ml-2 h-4 w-4" />
                    عرض الشهادة
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Module info card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  معلومات الوحدة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">عدد الدروس</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المدة التقديرية</span>
                  <span className="font-medium">{durationText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الدروس المكتملة</span>
                  <span className="font-medium text-green-600">{completedLessons}/{totalLessons}</span>
                </div>
                {module.duration && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مدة الوحدة</span>
                    <span className="font-medium">{module.duration}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certificate lock card */}
            {!quizPassed && (
              <Card className="border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="pt-5 pb-4 text-center">
                  <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    أكمل الاختبار بنجاح (70%+) للحصول على شهادة الوحدة
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
