import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  BookOpen, ArrowLeft, ArrowRight, CheckCircle2, Clock, ChevronRight,
  FileText, PlayCircle, Award, List, X, Lightbulb, Target, AlertTriangle,
  Info, Star, Zap, BookMarked, GraduationCap, Sun, Moon
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
  const [readingProgress, setReadingProgress] = useState(0);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("lesson-theme");
    return stored !== "light"; // default dark
  });
  const toggleTheme = () => setIsDark(prev => {
    const next = !prev;
    localStorage.setItem("lesson-theme", next ? "dark" : "light");
    return next;
  });

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

  // Track reading progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
      setReadingProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
            <BookOpen className="absolute inset-0 m-auto h-6 w-6 text-primary" />
          </div>
          <p className="text-slate-300 text-lg font-medium">جاري تحميل الدرس...</p>
          <p className="text-slate-500 text-sm mt-1">يُرجى الانتظار</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-red-400" />
          </div>
          <p className="text-xl font-bold text-white mb-2">الدرس غير موجود</p>
          <p className="text-slate-400 mb-6">لم يتم العثور على الدرس المطلوب</p>
          <Link href="/modules">
            <Button className="bg-primary hover:bg-primary/90">العودة إلى الوحدات</Button>
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
  const moduleProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleMarkComplete = async () => {
    try {
      await updateLessonProgress.mutateAsync({ lessonId: lesson.id, completed: true });
      toast.success("🎉 أحسنت! تم تحديد الدرس كمكتمل", {
        description: "استمر في التعلم لإتمام الوحدة",
      });
    } catch {
      toast.error("حدث خطأ أثناء حفظ التقدم");
    }
  };

  // ─── Theme tokens ────────────────────────────────────────────────────────────
  const D = isDark; // shorthand
  const th = {
    // Page
    pageBg:       D ? "bg-slate-950"                        : "bg-gray-100",
    // Header
    headerBorder: D ? "border-slate-800"                    : "border-gray-300",
    headerBg:     D ? "bg-slate-900/95"                     : "bg-white/95",
    headerText:   D ? "text-white"                          : "text-gray-900",
    headerSub:    D ? "text-slate-400"                      : "text-gray-500",
    headerMuted:  D ? "text-slate-500"                      : "text-gray-400",
    progressBg:   D ? "bg-slate-700"                        : "bg-gray-300",
    btn:          D ? "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                    : "border-gray-400 text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white",
    // Sidebar
    sidebarBg:    D ? "bg-slate-900 border-slate-700"       : "bg-white border-gray-300",
    sidebarTitle: D ? "text-white"                          : "text-gray-900",
    sidebarSub:   D ? "text-slate-400"                      : "text-gray-500",
    sidebarClose: D ? "text-slate-400 hover:text-white"     : "text-gray-500 hover:text-gray-900",
    sidebarMini:  D ? "bg-slate-700"                        : "bg-gray-300",
    sidebarHover: D ? "hover:bg-slate-800"                  : "hover:bg-gray-100",
    sidebarDot:   D ? "bg-slate-700 text-slate-400"         : "bg-gray-200 text-gray-500",
    sidebarLabel: D ? "text-slate-400"                      : "text-gray-500",
    sidebarDone:  D ? "text-slate-300"                      : "text-gray-600",
    sidebarTime:  D ? "text-slate-500"                      : "text-gray-400",
    sidebarFoot:  D ? "border-slate-700"                    : "border-gray-300",
    // Breadcrumb
    breadcrumb:   D ? "text-slate-500"                      : "text-gray-500",
    breadcrumbHi: D ? "text-slate-300"                      : "text-gray-700",
    // Hero card
    heroBg:       D ? "from-slate-800 to-slate-900 border-slate-700"
                    : "from-blue-50 to-indigo-50 border-blue-200",
    heroTitle:    D ? "text-white"                          : "text-gray-900",
    heroSub:      D ? "text-slate-400"                      : "text-gray-600",
    heroBorder:   D ? "border-slate-700/50"                 : "border-blue-200/70",
    heroMeta:     D ? "text-slate-400"                      : "text-gray-600",
    // Image card
    imgBorder:    D ? "border-slate-700"                    : "border-gray-300",
    imgOverlay:   D ? "from-slate-900/60"                   : "from-gray-900/40",
    imgBadge:     D ? "bg-slate-900/80 text-slate-300 border-slate-600" : "bg-white/90 text-gray-700 border-gray-400",
    // Video card
    videoBorder:  D ? "border-slate-700"                    : "border-gray-300",
    videoHeader:  D ? "bg-slate-800 border-slate-700"       : "bg-gray-100 border-gray-300",
    videoTitle:   D ? "text-white"                          : "text-gray-800",
    // Content card
    contentCard:  D ? "bg-slate-900 border-slate-700"       : "bg-white border-gray-200",
    contentHead:  D ? "bg-slate-800 border-slate-700"       : "bg-gray-50 border-gray-200",
    contentTitle: D ? "text-white"                          : "text-gray-800",
    contentSub:   D ? "text-slate-500"                      : "text-gray-500",
    // Markdown elements
    mdH1:         D ? "text-white border-slate-700"         : "text-gray-900 border-gray-300",
    mdH2:         D ? "text-white"                          : "text-gray-900",
    mdH3:         D ? "text-amber-300"                      : "text-indigo-700",
    mdH4:         D ? "text-slate-200"                      : "text-gray-800",
    mdP:          D ? "text-slate-300"                      : "text-gray-700",
    mdStrong:     D ? "text-white"                          : "text-gray-900",
    mdEm:         D ? "text-amber-300"                      : "text-indigo-600",
    mdLi:         D ? "text-slate-300"                      : "text-gray-700",
    mdBqBorder:   D ? "border-amber-400 bg-amber-400/5"     : "border-amber-500 bg-amber-50",
    mdBqText:     D ? "text-amber-100"                      : "text-amber-900",
    mdCodeBlock:  D ? "border-slate-600"                    : "border-gray-300",
    mdCodeHead:   D ? "bg-slate-800 border-slate-600"       : "bg-gray-100 border-gray-300",
    mdCodeHeadTx: D ? "text-slate-500"                      : "text-gray-500",
    mdCodePre:    D ? "bg-slate-950"                        : "bg-gray-900",
    mdCodeInline: D ? "bg-slate-800 text-amber-300 border-slate-600" : "bg-gray-100 text-indigo-700 border-gray-300",
    mdTableWrap:  D ? "border-slate-700"                    : "border-gray-300",
    mdThead:      D ? "bg-primary/10 border-slate-700"      : "bg-blue-50 border-gray-300",
    mdTh:         D ? "text-primary"                        : "text-blue-700",
    mdTd:         D ? "text-slate-300 border-slate-800"     : "text-gray-700 border-gray-200",
    mdTr:         D ? "hover:bg-slate-800/50"               : "hover:bg-gray-50",
    mdHr:         D ? "bg-slate-700"                        : "bg-gray-300",
    mdHrStar:     D ? "text-slate-600"                      : "text-gray-400",
    mdImg:        D ? "border-slate-700"                    : "border-gray-300",
    mdImgCap:     D ? "text-slate-500 bg-slate-800"         : "text-gray-500 bg-gray-100",
    // Takeaway box
    takeawayBg:   D ? "from-primary/10 to-amber-500/5 border-primary/20" : "from-blue-50 to-indigo-50 border-blue-200",
    takeawayTitle:D ? "text-white"                          : "text-gray-900",
    takeawaySub:  D ? "text-slate-400"                      : "text-gray-600",
    // Nav buttons
    navPrev:      D ? "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    navPrevSub:   D ? "text-slate-500"                      : "text-gray-400",
    navBack:      D ? "text-slate-400 hover:text-white"     : "text-gray-500 hover:text-gray-900",
  };

  return (
    <div className={`min-h-screen ${th.pageBg} flex flex-col transition-colors duration-300`} dir="rtl">
      {/* Reading Progress Bar */}
      <div className={`fixed top-0 left-0 right-0 z-[60] h-1 ${th.progressBg}`}>
        <div
          className="h-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className={`border-b ${th.headerBorder} ${th.headerBg} backdrop-blur sticky top-0 z-50`}>
        <div className="container flex h-20 items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png"
                alt="ALMOG"
                className="h-14 transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <p className={`text-xs ${th.headerSub} leading-none`}>شركة المُق للخدمات النفطية</p>
                <p className={`text-sm font-bold ${th.headerText} leading-tight`}>منصة التدريب التقني</p>
              </div>
            </div>
          </Link>

          {/* Module progress indicator */}
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="flex justify-between text-xs mb-1.5">
              <span className={`truncate max-w-[160px] ${th.headerSub}`}>{module?.titleAr}</span>
              <span className="text-primary font-bold">{completedCount}/{totalLessons} درس</span>
            </div>
            <div className={`h-2 ${th.progressBg} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${moduleProgress}%` }}
              />
            </div>
            <p className={`text-xs ${th.headerMuted} mt-1 text-left`}>{moduleProgress}% مكتمل</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark / Light toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              title={isDark ? "تبديل للوضع النهاري" : "تبديل للوضع الليلي"}
              className={`${th.btn} transition-colors`}
            >
              {isDark
                ? <Sun className="h-4 w-4 text-amber-400" />
                : <Moon className="h-4 w-4 text-indigo-500" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={th.btn}
            >
              <List className="h-4 w-4 ml-1" />
              <span className="hidden sm:inline">قائمة الدروس</span>
            </Button>
            <Link href={`/module/${lesson.moduleId}`}>
              <Button variant="outline" size="sm" className={th.btn}>
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
          <>
            <div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className={`fixed inset-y-0 right-0 z-40 w-80 ${th.sidebarBg} shadow-2xl flex flex-col pt-20 border-l`}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${th.sidebarFoot}`}>
                <div>
                  <h3 className={`font-bold ${th.sidebarTitle} text-sm`}>دروس الوحدة</h3>
                  <p className={`text-xs ${th.sidebarSub}`}>{completedCount} من {totalLessons} مكتمل</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className={th.sidebarClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mini progress bar */}
              <div className={`px-4 py-2 border-b ${th.sidebarFoot}`}>
                <div className={`h-1.5 ${th.sidebarMini} rounded-full overflow-hidden`}>
                  <div
                    className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all"
                    style={{ width: `${moduleProgress}%` }}
                  />
                </div>
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
                      className={`w-full text-right px-4 py-3 flex items-center gap-3 text-sm transition-all ${
                        isCurrent
                          ? 'bg-primary/15 border-r-2 border-primary'
                          : th.sidebarHover
                      }`}
                    >
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        done
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-primary text-white'
                          : th.sidebarDot
                      }`}>
                        {done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      <span className={`flex-1 leading-tight ${
                        isCurrent
                          ? `font-semibold ${th.sidebarTitle}`
                          : done
                          ? th.sidebarDone
                          : th.sidebarLabel
                      }`}>{l.titleAr}</span>
                      {l.estimatedMinutes && (
                        <span className={`text-xs ${th.sidebarTime} flex-shrink-0`}>{l.estimatedMinutes}د</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className={`p-4 border-t ${th.sidebarFoot}`}>
                <Button
                  onClick={() => { setLocation(`/quiz/${lesson.moduleId}`); setSidebarOpen(false); }}
                  size="sm"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Award className="ml-2 h-4 w-4" />
                  اختبار الوحدة
                </Button>
              </div>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 py-6 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className={`flex items-center gap-1.5 text-sm ${th.breadcrumb} mb-6`}>
              <Link href="/modules">
                <span className="hover:text-primary cursor-pointer transition-colors">الوحدات</span>
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/module/${lesson.moduleId}`}>
                <span className="hover:text-primary cursor-pointer transition-colors">{module?.titleAr}</span>
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className={`${th.breadcrumbHi} font-medium`}>الدرس {lesson.lessonNumber}</span>
            </nav>

            {/* Lesson Hero Section */}
            <div className={`relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br ${th.heroBg} border`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400 rounded-full translate-y-24 -translate-x-24" />
              </div>

              <div className="relative p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    <BookMarked className="h-3 w-3 mr-1" />
                    الدرس {lesson.lessonNumber} من {totalLessons}
                  </Badge>
                  {lesson.estimatedMinutes && (
                    <Badge variant="outline" className={`${D ? "border-slate-600 text-slate-400" : "border-gray-400 text-gray-600"} text-xs`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {lesson.estimatedMinutes} دقيقة
                    </Badge>
                  )}
                  {isCompleted && (
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      مكتمل
                    </Badge>
                  )}
                </div>

                <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${th.heroTitle} leading-tight mb-2`}>
                  {lesson.titleAr}
                </h1>
                {lesson.titleEn && (
                  <p className={`${th.heroSub} text-base font-medium`}>{lesson.titleEn}</p>
                )}

                {/* Module info strip */}
                <div className={`flex items-center gap-2 mt-4 pt-4 border-t ${th.heroBorder}`}>
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className={`text-sm ${th.heroMeta}`}>{module?.titleAr}</span>
                </div>
              </div>
            </div>

            {/* Lesson Image */}
            {lesson.imageUrl && (
              <div className={`mb-8 rounded-2xl overflow-hidden shadow-2xl border ${th.imgBorder} group`}>
                <div className="relative">
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.titleAr || lesson.titleEn || 'Lesson illustration'}
                    className="w-full object-cover max-h-80 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${th.imgOverlay} to-transparent`} />
                  <div className="absolute bottom-4 right-4">
                    <Badge className={`${th.imgBadge} text-xs backdrop-blur`}>
                      <FileText className="h-3 w-3 mr-1" />
                      صورة توضيحية
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Video */}
            {lesson.videoUrl && (
              <div className={`mb-8 rounded-2xl overflow-hidden border ${th.videoBorder} shadow-xl`}>
                <div className={`flex items-center gap-2 px-4 py-3 ${th.videoHeader} border-b`}>
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <PlayCircle className="h-4 w-4 text-red-400" />
                  </div>
                  <span className={`text-sm font-bold ${th.videoTitle}`}>فيديو الدرس</span>
                </div>
                <video controls className="w-full bg-black" src={lesson.videoUrl}>
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              </div>
            )}

            {/* Lesson Content */}
            <div className={`rounded-2xl ${th.contentCard} border shadow-xl overflow-hidden mb-8`}>
              {/* Content header */}
              <div className={`flex items-center gap-3 px-6 py-4 ${th.contentHead} border-b`}>
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className={`font-bold ${th.contentTitle} text-sm`}>محتوى الدرس</h2>
                  <p className={`text-xs ${th.contentSub}`}>اقرأ بتمعن وتركيز</p>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="lesson-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className={`text-2xl font-bold ${th.mdH1} mt-8 mb-4 pb-3 border-b flex items-center gap-3`}>
                          <span className="w-1 h-7 bg-primary rounded-full inline-block flex-shrink-0" />
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className={`text-xl font-bold ${th.mdH2} mt-7 mb-3 flex items-center gap-2`}>
                          <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                          </span>
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className={`text-lg font-bold ${th.mdH3} mt-5 mb-2 flex items-center gap-2`}>
                          <ChevronRight className="h-4 w-4 flex-shrink-0" />
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className={`text-base font-bold ${th.mdH4} mt-4 mb-2`}>{children}</h4>
                      ),
                      p: ({ children }) => (
                        <p className={`${th.mdP} leading-relaxed mb-4 text-base`}>{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className={`${th.mdStrong} font-bold`}>{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className={`${th.mdEm} not-italic font-medium`}>{children}</em>
                      ),
                      ul: ({ children }) => (
                        <ul className="space-y-2 mb-4 mr-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="space-y-2 mb-4 mr-2 list-decimal list-inside">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className={`flex items-start gap-2 ${th.mdLi}`}>
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          <span className="leading-relaxed">{children}</span>
                        </li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className={`my-4 border-r-4 ${th.mdBqBorder} rounded-l-xl px-5 py-4`}>
                          <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className={`${th.mdBqText} text-sm leading-relaxed`}>{children}</div>
                          </div>
                        </blockquote>
                      ),
                      code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
                        const isBlock = className?.includes('language-');
                        if (isBlock) {
                          return (
                            <div className={`my-4 rounded-xl overflow-hidden border ${th.mdCodeBlock}`}>
                              <div className={`flex items-center gap-2 px-4 py-2 ${th.mdCodeHead} border-b`}>
                                <div className="flex gap-1.5">
                                  <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                  <span className="w-3 h-3 rounded-full bg-green-500/60" />
                                </div>
                                <span className={`text-xs ${th.mdCodeHeadTx} mr-2`}>إجراء / خطوات</span>
                              </div>
                              <pre className={`p-4 ${th.mdCodePre} overflow-x-auto text-sm`}>
                                <code className="text-green-300 font-mono leading-relaxed">{children}</code>
                              </pre>
                            </div>
                          );
                        }
                        return (
                          <code className={`${th.mdCodeInline} px-1.5 py-0.5 rounded text-sm font-mono border`} {...props}>
                            {children}
                          </code>
                        );
                      },
                      table: ({ children }) => (
                        <div className={`my-5 overflow-x-auto rounded-xl border ${th.mdTableWrap}`}>
                          <table className="w-full text-sm">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className={`${th.mdThead} border-b`}>{children}</thead>
                      ),
                      th: ({ children }) => (
                        <th className={`px-4 py-3 text-right font-bold ${th.mdTh} text-sm`}>{children}</th>
                      ),
                      td: ({ children }) => (
                        <td className={`px-4 py-3 ${th.mdTd} border-b text-sm`}>{children}</td>
                      ),
                      tr: ({ children }) => (
                        <tr className={`${th.mdTr} transition-colors`}>{children}</tr>
                      ),
                      hr: () => (
                        <div className="my-6 flex items-center gap-3">
                          <div className={`flex-1 h-px ${th.mdHr}`} />
                          <Star className={`h-4 w-4 ${th.mdHrStar}`} />
                          <div className={`flex-1 h-px ${th.mdHr}`} />
                        </div>
                      ),
                      a: ({ href, children }) => (
                        <a href={href} className="text-primary hover:text-primary/80 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                      img: ({ src, alt }) => (
                        <div className={`my-5 rounded-xl overflow-hidden border ${th.mdImg}`}>
                          <img src={src} alt={alt} className="w-full object-cover" />
                          {alt && <p className={`text-center text-xs ${th.mdImgCap} py-2`}>{alt}</p>}
                        </div>
                      ),
                    }}
                  >
                    {lesson.contentMarkdown}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Key Takeaway Box */}
            <div className={`mb-8 rounded-2xl bg-gradient-to-br ${th.takeawayBg} border p-6`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold ${th.takeawayTitle} mb-1`}>هل أتقنت هذا الدرس؟</h3>
                  <p className={`${th.takeawaySub} text-sm leading-relaxed`}>
                    إذا استوعبت المحتوى بشكل جيد، حدّد الدرس كمكتمل للمضي قدماً في مسيرتك التعليمية. تذكر: الفهم العميق أهم من السرعة.
                  </p>
                </div>
              </div>
            </div>

            {/* Complete + Navigation */}
            <div className="space-y-5">
              {/* Mark complete button */}
              {!isCompleted ? (
                <div className="flex justify-center">
                  <Button
                    onClick={handleMarkComplete}
                    disabled={updateLessonProgress.isPending}
                    size="lg"
                    className="gap-3 px-10 py-6 text-base font-bold bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg shadow-green-500/20 rounded-2xl transition-all hover:scale-105"
                  >
                    {updateLessonProgress.isPending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6" />
                    )}
                    تحديد الدرس كمكتمل ✓
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="flex items-center gap-3 text-green-600 bg-green-500/10 border border-green-500/20 rounded-2xl px-8 py-4">
                    <CheckCircle2 className="h-6 w-6" />
                    <div>
                      <p className="font-bold">أحسنت! تم إكمال هذا الدرس</p>
                      <p className="text-xs text-green-500/70">استمر في التعلم</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Prev / Next navigation */}
              <div className="flex items-center justify-between gap-4 pt-2">
                {previousLesson ? (
                  <Button
                    variant="outline"
                    onClick={() => setLocation(`/lesson/${previousLesson.id}`)}
                    className={`flex-1 max-w-[220px] ${th.navPrev} rounded-xl py-5 gap-2`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <div className="text-right">
                      <p className={`text-xs ${th.navPrevSub}`}>السابق</p>
                      <p className="text-sm font-medium truncate max-w-[140px]">{previousLesson.titleAr}</p>
                    </div>
                  </Button>
                ) : (
                  <Link href={`/module/${lesson.moduleId}`}>
                    <Button variant="ghost" className={`flex-1 max-w-[220px] ${th.navBack} rounded-xl py-5`}>
                      <ArrowLeft className="h-4 w-4 ml-2" />
                      العودة للوحدة
                    </Button>
                  </Link>
                )}

                {nextLesson ? (
                  <Button
                    onClick={() => setLocation(`/lesson/${nextLesson.id}`)}
                    className="flex-1 max-w-[220px] bg-primary hover:bg-primary/90 text-white rounded-xl py-5 gap-2 shadow-lg shadow-primary/20"
                  >
                    <div className="text-left">
                      <p className="text-xs text-primary-foreground/70">التالي</p>
                      <p className="text-sm font-medium truncate max-w-[140px]">{nextLesson.titleAr}</p>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setLocation(`/quiz/${lesson.moduleId}`)}
                    className="flex-1 max-w-[220px] bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white rounded-xl py-5 gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <div className="text-left">
                      <p className="text-xs text-amber-100/70">أنهيت الوحدة!</p>
                      <p className="text-sm font-bold">ابدأ الاختبار</p>
                    </div>
                    <Award className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
