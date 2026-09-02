import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, CheckCircle2, ArrowRight, BookOpen } from "lucide-react";

const courseNames: Record<number, { ar: string; en: string }> = {
  1: { ar: "منشآت الإنتاج المبكر", en: "Early Production Facilities (EPF)" },
  2: { ar: "صيانة رأس البئر", en: "Wellhead Maintenance (Onshore & Offshore)" },
};

export default function CourseCertificate() {
  const { courseId: courseIdStr } = useParams<{ courseId: string }>();
  const courseId = Number(courseIdStr);
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();

  const certQuery = trpc.courseExam.getCertificate.useQuery(
    { courseId },
    { enabled: !!user }
  );

  const course = courseNames[courseId] ?? { ar: `الكورس ${courseId}`, en: `Course ${courseId}` };

  if (loading || certQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white" dir="rtl">
        <div className="text-center">
          <p className="mb-4">يجب تسجيل الدخول أولاً</p>
          <Button onClick={() => navigate("/")}>العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  if (!certQuery.data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4" dir="rtl">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">لا توجد شهادة بعد</h2>
          <p className="text-slate-400 mb-6">
            يجب اجتياز الامتحان الشامل بنسبة 90% أو أعلى للحصول على الشهادة
          </p>
          <Button
            onClick={() => navigate(`/course-exam/${courseId}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            الذهاب للامتحان الشامل
          </Button>
        </div>
      </div>
    );
  }

  const cert = certQuery.data;
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const scoreNum = Number(cert.scorePercent);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/verify/${cert.verificationCode}`;
    if (navigator.share) {
      navigator.share({ title: "شهادة إتمام الكورس", url });
    } else {
      navigator.clipboard.writeText(url);
      alert("تم نسخ رابط التحقق!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 flex flex-col items-center justify-center" dir="rtl">
      {/* Actions (hidden in print) */}
      <div className="flex gap-3 mb-6 print:hidden">
        <Button
          variant="outline"
          onClick={() => navigate("/courses")}
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للكورسات
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="border-blue-600 text-blue-400 hover:bg-blue-900/30"
        >
          <Share2 className="w-4 h-4 ml-2" />
          مشاركة
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          <Download className="w-4 h-4 ml-2" />
          طباعة / حفظ PDF
        </Button>
      </div>

      {/* Certificate */}
      <div
        id="course-certificate"
        className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
        style={{ aspectRatio: "1.414/1", minHeight: "500px" }}
      >
        {/* Gold border frame */}
        <div className="h-full flex flex-col border-8 border-yellow-600 m-3 rounded-xl relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: "repeating-linear-gradient(45deg, #b45309 0, #b45309 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px"
            }} />
          </div>

          {/* Top accent */}
          <div className="h-2 bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600" />

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            {/* Logo area */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-500 rounded-full flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">شركة الفق للخدمات النفطية</p>
                <p className="text-sm font-bold text-slate-700">منصة التدريب التقني</p>
              </div>
            </div>

            {/* Certificate title */}
            <div className="mb-4">
              <p className="text-slate-500 text-sm uppercase tracking-widest mb-1">Certificate of Completion</p>
              <h1 className="text-3xl font-bold text-yellow-700 mb-1">شهادة إتمام الكورس</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-amber-400 mx-auto rounded-full" />
            </div>

            {/* Presented to */}
            <p className="text-slate-500 text-sm mb-1">يُشهد بأن</p>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{user.name ?? "المتدرب"}</h2>
            <p className="text-slate-500 text-sm mb-4">قد أتم بنجاح متطلبات كورس</p>

            {/* Course name */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl px-6 py-3 mb-4">
              <h3 className="text-xl font-bold text-yellow-800">{course.ar}</h3>
              <p className="text-sm text-yellow-600">{course.en}</p>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-slate-600 text-sm">
                بنسبة إتقان <strong className="text-emerald-700 text-lg">{scoreNum.toFixed(1)}%</strong>
              </span>
            </div>

            {/* Date and verification */}
            <div className="flex items-center justify-between w-full mt-2 pt-4 border-t border-slate-200">
              <div className="text-right">
                <p className="text-xs text-slate-400">تاريخ الإصدار</p>
                <p className="text-sm font-semibold text-slate-700">{issuedDate}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-slate-400">ختم المنصة</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400">رمز التحقق</p>
                <p className="text-sm font-mono font-bold text-slate-700">{cert.verificationCode}</p>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-2 bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600" />
        </div>
      </div>

      {/* Verification link */}
      <div className="mt-4 text-center print:hidden">
        <p className="text-slate-500 text-sm">
          للتحقق من صحة الشهادة:{" "}
          <a
            href={`/verify/${cert.verificationCode}`}
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {window.location.origin}/verify/{cert.verificationCode}
          </a>
        </p>
      </div>
    </div>
  );
}
