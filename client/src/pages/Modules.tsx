import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, CheckCircle2, Clock, ArrowRight, Wrench } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import { useMemo } from "react";

const COURSE_INFO: Record<number, { titleAr: string; titleEn: string; icon: React.ElementType; color: string }> = {
  1: { titleAr: "منشآت الإنتاج المبكر", titleEn: "Early Production Facilities (EPF)", icon: BookOpen, color: "text-blue-600" },
  2: { titleAr: "صيانة رأس البئر", titleEn: "Wellhead Maintenance", icon: Wrench, color: "text-orange-600" },
};

export default function Modules() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ courseId: string }>();
  const courseId = useMemo(() => parseInt(params.courseId || "1") || 1, [params.courseId]);
  const courseInfo = COURSE_INFO[courseId] || COURSE_INFO[1];
  const CourseIcon = courseInfo.icon;

  const { data: modules, isLoading: modulesLoading } = trpc.course.getModules.useQuery({ courseId });
  const { data: progress } = trpc.progress.getUserProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading || modulesLoading) {
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

  const getModuleProgress = (moduleId: number) => {
    const moduleProgress = progress?.modules.find(m => m.moduleId === moduleId);
    return moduleProgress?.completionPercentage || 0;
  };

  const isModuleCompleted = (moduleId: number) => {
    const moduleProgress = progress?.modules.find(m => m.moduleId === moduleId);
    return moduleProgress?.completed || false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-24 items-center justify-between">
          <Link href="/courses">
            <div className="flex items-center gap-4 cursor-pointer">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png" alt="ALMOG" className="h-36" />
              <div className="flex items-center gap-2">
                <CourseIcon className={`h-6 w-6 ${courseInfo.color}`} />
                <h1 className="text-xl font-bold">{courseInfo.titleAr}</h1>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/courses">
              <Button variant="ghost" size="sm">← الدورات</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">لوحة التحكم</Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              مرحباً، {user?.name || "المتعلم"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-1">{courseInfo.titleAr}</h2>
          <p className="text-sm text-muted-foreground mb-2">{courseInfo.titleEn}</p>
          <p className="text-muted-foreground">
            اختر الوحدة التي تريد البدء بها أو استكمالها
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules?.map((module) => {
            const progressPercentage = getModuleProgress(module.id);
            const completed = isModuleCompleted(module.id);

            return (
              <Card
                key={module.id}
                className="hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                onClick={() => setLocation(`/module/${module.id}`)}
              >
                {/* Module image */}
                {(module as any).imageUrl && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={(module as any).imageUrl}
                      alt={module.titleEn || module.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {completed && (
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
                      {module.moduleNumber}
                    </div>
                  </div>
                )}
                <CardHeader>
                  {!(module as any).imageUrl && (
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                        {module.moduleNumber}
                      </div>
                      {completed && (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                  )}
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {module.titleAr}
                  </CardTitle>
                  {module.titleEn && (
                    <CardDescription className="text-xs mt-1">
                      {module.titleEn}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {module.descriptionAr && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {module.descriptionAr}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration || "ساعة واحدة"}</span>
                    </div>

                    {progressPercentage > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>التقدم</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button className="w-full group-hover:bg-primary/90" variant={completed ? "outline" : "default"}>
                      {completed ? "مراجعة الوحدة" : progressPercentage > 0 ? "استكمال" : "ابدأ الآن"}
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
