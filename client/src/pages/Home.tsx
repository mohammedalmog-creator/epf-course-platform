import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import {
  BookOpen, Award, TrendingUp, Users, ArrowLeft,
  Wrench, ChevronLeft, Shield, Clock, CheckCircle2,
  GraduationCap, BarChart3, Star
} from "lucide-react";
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
    level: "متوسط - متقدم",
    duration: "9 أسابيع",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    gradientFrom: "from-blue-600",
    gradientTo: "to-blue-800",
    href: "/modules/1",
    topics: ["فصل السوائل", "معالجة النفط الخام", "معالجة الغاز", "أنظمة السلامة"],
  },
  {
    id: 2,
    titleAr: "صيانة رأس البئر",
    titleEn: "Wellhead Maintenance (Onshore & Offshore)",
    descriptionAr: "دورة متخصصة في صيانة رأس البئر للمنشآت البرية والبحرية، تشمل الإجراءات والسلامة والتشخيص والإصلاح.",
    modules: 12,
    lessons: "60+",
    questions: "96+",
    level: "مبتدئ - متقدم",
    duration: "12 أسبوعاً",
    icon: Wrench,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    gradientFrom: "from-orange-500",
    gradientTo: "to-orange-700",
    href: "/modules/2",
    topics: ["مكونات رأس البئر", "إجراءات الصيانة", "أنظمة التحكم", "السلامة والطوارئ"],
  },
];

const features = [
  {
    icon: GraduationCap,
    title: "محتوى تعليمي متخصص",
    desc: "دروس مبنية على معايير صناعة النفط والغاز العالمية بمحتوى عربي وإنجليزي",
  },
  {
    icon: BarChart3,
    title: "اختبارات تكيفية",
    desc: "أسئلة متعددة الخيارات مع شروحات فورية لتعزيز الفهم وقياس التقدم",
  },
  {
    icon: Award,
    title: "شهادات معتمدة",
    desc: "شهادات PDF احترافية برمز تحقق فريد تُمنح عند إكمال كل وحدة بنجاح",
  },
  {
    icon: Shield,
    title: "بيئة تعلم آمنة",
    desc: "منصة مؤمّنة بتسجيل دخول موحّد وحفظ تلقائي لتقدمك في كل درس",
  },
];

const stats = [
  { value: "21", label: "وحدة تعليمية", icon: BookOpen },
  { value: "100+", label: "درس تفاعلي", icon: TrendingUp },
  { value: "138+", label: "سؤال اختبار", icon: CheckCircle2 },
  { value: "2", label: "كورس متخصص", icon: Users },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-32 items-center justify-between">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png" alt="ALMOG" className="h-30" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground leading-none">شركة المُق للخدمات النفطية</p>
              <p className="text-sm font-bold leading-tight">منصة التدريب التقني</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#courses" className="text-muted-foreground hover:text-foreground transition-colors">الكورسات</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">المميزات</a>
            <a href="#stats" className="text-muted-foreground hover:text-foreground transition-colors">الإحصائيات</a>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:block text-sm text-muted-foreground">مرحباً، {user?.name || "المتعلم"}</span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">لوحة التحكم</Button>
                </Link>
                <Link href="/courses">
                  <Button size="sm">الكورسات</Button>
                </Link>
              </>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="outline" size="sm">تسجيل الدخول</Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button size="sm">ابدأ مجاناً</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 20%, #f97316 0%, transparent 40%)" }}
        />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 text-sm px-4 py-1.5">
              منصة التدريب التقني المتخصصة في النفط والغاز
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              طوّر مهاراتك في
              <span className="block text-transparent bg-clip-text bg-gradient-to-l from-orange-400 to-blue-400 mt-2">
                صناعة النفط والغاز
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              دورات تدريبية متخصصة من شركة المُق للخدمات النفطية — محتوى عربي احترافي، اختبارات تكيفية، وشهادات معتمدة بمعايير الصناعة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/courses">
                  <Button size="lg" className="text-base px-8 bg-blue-600 hover:bg-blue-700 gap-2">
                    استعرض الكورسات
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="text-base px-8 bg-blue-600 hover:bg-blue-700 gap-2">
                    ابدأ التعلم مجاناً
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </a>
              )}
              <a href="#courses">
                <Button size="lg" variant="outline" className="text-base px-8 border-white/30 text-white hover:bg-white/10">
                  تعرف على الكورسات
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section id="stats" className="border-b bg-muted/30">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Courses ────────────────────────────────────────────────────────── */}
      <section id="courses" className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">الكورسات المتاحة</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            اختر الكورس المناسب لمستواك وتخصصك في صناعة النفط والغاز
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <Card key={course.id} className={`group overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${course.borderColor}`}>
                {/* Card top gradient bar */}
                <div className={`h-2 bg-gradient-to-l ${course.gradientFrom} ${course.gradientTo}`} />

                <CardContent className="p-6 space-y-5">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 h-14 w-14 rounded-2xl ${course.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-7 w-7 ${course.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {course.titleAr}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{course.titleEn}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {course.descriptionAr}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 py-4 border-t border-b">
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

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5" />
                      <span>{course.level}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  {isAuthenticated ? (
                    <Link href={course.href}>
                      <Button className="w-full gap-2" size="lg">
                        ابدأ الكورس
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button className="w-full gap-2" size="lg">
                        سجل للوصول
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="bg-muted/40 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">لماذا منصة المُق للتدريب؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              منصة مصممة خصيصاً لمحترفي صناعة النفط والغاز بأعلى معايير الجودة
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-background rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 rounded-xl p-3">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="container py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-bl from-slate-900 to-slate-800 text-white rounded-3xl p-12">
          <GraduationCap className="h-14 w-14 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            هل أنت جاهز لتطوير مهاراتك؟
          </h2>
          <p className="text-slate-300 mb-8 text-lg leading-relaxed">
            انضم إلى منصة التدريب التقني لشركة المُق واحصل على المعرفة والشهادات التي تحتاجها للتميز في صناعة النفط والغاز.
          </p>
          {isAuthenticated ? (
            <Link href="/courses">
              <Button size="lg" className="text-base px-10 bg-blue-600 hover:bg-blue-700 gap-2">
                استعرض الكورسات
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="text-base px-10 bg-blue-600 hover:bg-blue-700 gap-2">
                سجل الآن مجاناً
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t bg-muted/50 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png" alt="ALMOG" className="h-30" />
              <div>
                <p className="font-semibold text-sm">شركة المُق للخدمات النفطية</p>
                <p className="text-xs text-muted-foreground">منصة التدريب التقني المتخصصة</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#courses" className="hover:text-foreground transition-colors">الكورسات</a>
              <a href="#features" className="hover:text-foreground transition-colors">المميزات</a>
              {isAuthenticated && (
                <Link href="/dashboard">
                  <span className="hover:text-foreground transition-colors cursor-pointer">لوحة التحكم</span>
                </Link>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 شركة المُق للخدمات النفطية. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
