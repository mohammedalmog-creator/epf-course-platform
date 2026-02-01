import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, Award, Clock, TrendingUp, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: modules } = trpc.course.getModules.useQuery();
  const { data: progress, isLoading: progressLoading } = trpc.progress.getUserProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: quizAttempts } = trpc.quiz.getUserAttempts.useQuery({}, {
    enabled: isAuthenticated,
  });
  const { data: certificates } = trpc.certificate.getUserCertificates.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading || progressLoading) {
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

  // Calculate statistics
  const totalModules = modules?.length || 0;
  const completedModules = progress?.modules.filter(m => m.completed).length || 0;
  const totalLessons = progress?.lessons.length || 0;
  const completedLessons = progress?.lessons.filter(l => l.completed).length || 0;
  const totalTimeSpent = (progress?.modules.reduce((sum, m) => sum + (m.timeSpentMinutes || 0), 0) || 0) + 
                         (progress?.lessons.reduce((sum, l) => sum + (l.timeSpentMinutes || 0), 0) || 0);
  const totalCertificates = certificates?.length || 0;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Get module-specific progress
  const getModuleProgress = (moduleId: number) => {
    return progress?.modules.find(m => m.moduleId === moduleId);
  };

  const getModuleQuizScore = (moduleId: number) => {
    const attempts = quizAttempts?.filter(a => a.moduleId === moduleId) || [];
    if (attempts.length === 0) return null;
    const latestAttempt = attempts[0];
    return Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer">
              <img src="/almog-logo.gif" alt="ALMOG" className="h-10" />
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">منصة دورة EPF</h1>
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

      {/* Main Content */}
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">لوحة التحكم</h2>
          <p className="text-muted-foreground">
            مرحباً {user?.name}، تابع تقدمك في الدورة
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">التقدم الإجمالي</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overallProgress}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedModules} من {totalModules} وحدات
              </p>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الدروس المكتملة</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedLessons}</div>
              <p className="text-xs text-muted-foreground mt-1">
                من إجمالي {totalLessons} درس
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الوقت المستغرق</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.floor(totalTimeSpent / 60)}
                <span className="text-lg text-muted-foreground">س</span>
                {" "}
                {totalTimeSpent % 60}
                <span className="text-lg text-muted-foreground">د</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                إجمالي وقت التعلم
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الشهادات</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCertificates}</div>
              <p className="text-xs text-muted-foreground mt-1">
                شهادات محصلة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Module Progress */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">التقدم في الوحدات</h3>
          <div className="space-y-4">
            {modules?.map((module) => {
              const moduleProgress = getModuleProgress(module.id);
              const quizScore = getModuleQuizScore(module.id);
              const completionPercentage = moduleProgress?.completionPercentage || 0;
              const timeSpent = moduleProgress?.timeSpentMinutes || 0;
              const isCompleted = moduleProgress?.completed || false;

              return (
                <Card
                  key={module.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/module/${module.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          {module.moduleNumber}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{module.titleAr}</CardTitle>
                          <CardDescription className="mt-1">
                            {module.duration}
                          </CardDescription>
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">التقدم</span>
                          <span className="font-medium">{completionPercentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{timeSpent} دقيقة</span>
                        </div>
                        {quizScore !== null && (
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-primary" />
                            <span className="font-medium">نتيجة الاختبار: {quizScore}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Certificates Section */}
        {certificates && certificates.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-4">شهاداتي</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => {
                const module = modules?.find(m => m.id === cert.moduleId);
                return (
                  <Card key={cert.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-6 w-6 text-primary" />
                        <CardTitle className="text-base">شهادة إتمام</CardTitle>
                      </div>
                      <CardDescription>
                        {module?.titleAr}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-3">
                        تاريخ الإصدار: {new Date(cert.issuedAt).toLocaleDateString('ar-EG')}
                      </p>
                      <a href={cert.certificateUrl} download>
                        <Button size="sm" className="w-full">
                          تحميل الشهادة
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
