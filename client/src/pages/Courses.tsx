import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { BookOpen, ArrowRight, Wrench } from "lucide-react";
import { Link } from "wouter";

const courses = [
  {
    id: 1,
    titleAr: "منشآت الإنتاج المبكر",
    titleEn: "Early Production Facilities (EPF)",
    descriptionAr: "دورة شاملة تغطي جميع جوانب منشآت الإنتاج المبكر في صناعة النفط والغاز، من الأساسيات إلى التصميم والتشغيل والصيانة.",
    modules: 9,
    lessons: "42+",
    questions: "42+",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/modules/1",
  },
  {
    id: 2,
    titleAr: "صيانة رأس البئر",
    titleEn: "Wellhead Maintenance (Onshore & Offshore)",
    descriptionAr: "دورة متخصصة في صيانة رأس البئر للمنشآت البرية والبحرية، تشمل الإجراءات والسلامة والتشخيص والإصلاح.",
    modules: 12,
    lessons: "18+",
    questions: "61+",
    icon: Wrench,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/modules/2",
  },
];

export default function Courses() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/juIkiBzVsHshNjRK.svg" alt="ALMOG" className="h-12" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground leading-none">شركة المُق للخدمات النفطية</p>
              <p className="text-sm font-bold leading-tight">منصة التدريب التقني</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">مرحباً، {user?.name || "المتعلم"}</span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">لوحة التحكم</Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button>تسجيل الدخول</Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          اختر دورتك التدريبية
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          دورات تدريبية متخصصة في صناعة النفط والغاز من شركة المُق للخدمات النفطية
        </p>
      </section>

      {/* Courses Grid */}
      <section className="container py-8 pb-16">
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <Card key={course.id} className="hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/30">
                <CardHeader className="pb-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${course.bgColor} mb-4`}>
                    <Icon className={`h-8 w-8 ${course.color}`} />
                  </div>
                  <CardTitle className="text-2xl leading-tight group-hover:text-primary transition-colors">
                    {course.titleAr}
                  </CardTitle>
                  <CardDescription className="text-sm font-medium">
                    {course.titleEn}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {course.descriptionAr}
                  </p>

                  <div className="grid grid-cols-3 gap-3 py-3 border-t border-b">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{course.modules}</div>
                      <div className="text-xs text-muted-foreground">وحدة</div>
                    </div>
                    <div className="text-center border-x">
                      <div className="text-2xl font-bold text-primary">{course.lessons}</div>
                      <div className="text-xs text-muted-foreground">درس</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{course.questions}</div>
                      <div className="text-xs text-muted-foreground">سؤال</div>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <Link href={course.href}>
                      <Button className="w-full" size="lg">
                        ابدأ الدورة
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button className="w-full" size="lg">
                        سجل للوصول
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 منصة التدريب التقني - شركة المُق للخدمات النفطية. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
