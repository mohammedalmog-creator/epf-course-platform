import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BookOpen, Award, Download, ArrowLeft, CheckCircle2, RotateCcw,
  Shield, Hash, Calendar, Target, RefreshCw, Star
} from "lucide-react";
import { Link, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { toast } from "sonner";

export default function Certificate() {
  const { id } = useParams<{ id: string }>();
  const moduleId = parseInt(id || "0");
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [generating, setGenerating] = useState(false);

  const { data: module, isLoading: moduleLoading } = trpc.course.getModule.useQuery({ moduleId });
  const { data: quizAttempts } = trpc.quiz.getUserAttempts.useQuery({ moduleId }, {
    enabled: isAuthenticated,
  });
  const { data: certificates, refetch: refetchCerts } = trpc.certificate.getUserCertificates.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const generateCertificate = trpc.certificate.generateCertificate.useMutation();
  const downloadCertificateMutation = trpc.certificate.downloadCertificate.useMutation();

  if (authLoading || moduleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الشهادة...</p>
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
          <Link href="/courses">
            <Button className="mt-4">العودة إلى الكورسات</Button>
          </Link>
        </div>
      </div>
    );
  }

  const latestAttempt = quizAttempts?.[0];
  const totalAttempts = quizAttempts?.length || 0;
  const hasPassed = latestAttempt && (latestAttempt.score / latestAttempt.totalQuestions) >= 0.7;
  const scorePercent = latestAttempt ? Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100) : 0;
  const existingCertificate = certificates?.find(c => c.moduleId === moduleId);

  const handleGenerateCertificate = async () => {
    if (!user || !module) return;
    setGenerating(true);
    try {
      const result = await generateCertificate.mutateAsync({ moduleId });
      if (result.success && result.certificateUrl) {
        toast.success("تم إصدار الشهادة بنجاح!");
        await refetchCerts();
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("حدث خطأ أثناء إنشاء الشهادة");
    } finally {
      setGenerating(false);
    }
  };

  const downloadCertificate = async (certificateId: number) => {
    try {
      const result = await downloadCertificateMutation.mutateAsync({ certificateId });
      if (result.success && result.pdfBase64) {
        const byteCharacters = atob(result.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = result.filename || `Certificate_Module_${moduleId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        toast.success("تم تنزيل الشهادة بنجاح!");
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("فشل تنزيل الشهادة");
    }
  };

  const completionDate = existingCertificate
    ? new Date(existingCertificate.issuedAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  const completionDateEn = existingCertificate
    ? new Date(existingCertificate.issuedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  // Get verification code from certificate if available
  const verificationCode = (existingCertificate as any)?.verificationCode || null;
  const certAttemptCount = (existingCertificate as any)?.attemptCount || totalAttempts;
  const certScorePercent = (existingCertificate as any)?.scorePercent || scorePercent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/almog-logo.gif" alt="ALMOG" className="h-14" />
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h1 className="text-lg font-bold">منصة دورة EPF</h1>
              </div>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-12 max-w-4xl">
        {!hasPassed ? (
          /* Not passed yet */
          <Card className="border-yellow-300 shadow-lg">
            <CardContent className="pt-12 pb-10 text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-yellow-100 rounded-full p-6">
                  <Award className="h-16 w-16 text-yellow-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">الشهادة غير متاحة بعد</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  تحتاج إلى تحقيق <strong>70% أو أكثر</strong> في اختبار الوحدة للحصول على شهادتك.
                  {latestAttempt && (
                    <span className="block mt-2 text-yellow-700 font-medium">
                      آخر نتيجة: {scorePercent}% — المحاولة {totalAttempts}
                    </span>
                  )}
                  {!latestAttempt && (
                    <span className="block mt-2 text-gray-500">لم تُجرِ أي اختبار حتى الآن.</span>
                  )}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Link href={`/quiz/${moduleId}`}>
                  <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <RotateCcw className="h-4 w-4" />
                    {latestAttempt ? 'إعادة الاختبار' : 'بدء الاختبار'}
                  </Button>
                </Link>
                <Link href={`/module/${moduleId}`}>
                  <Button variant="outline" size="lg">
                    مراجعة الدروس
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Success badge */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-5 py-2.5 rounded-full text-sm font-semibold mb-4 shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
                اجتزت الاختبار بنجاح — النتيجة: {scorePercent}%
              </div>
              <h2 className="text-3xl font-bold text-gray-800">شهادة إتمام الوحدة</h2>
              <p className="text-muted-foreground mt-1">مراجعة شهادتك أدناه قبل تنزيلها</p>
            </div>

            {/* Visual Certificate Preview */}
            <div className="relative mx-auto max-w-3xl">
              <div
                className="relative bg-[#FAFDF7] rounded-2xl shadow-2xl overflow-hidden"
                style={{ aspectRatio: '1.414/1', border: '4px solid #1a6b3c' }}
              >
                {/* Outer gold accent lines */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-[#c8a84b]" />
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#c8a84b]" />

                {/* Inner green border */}
                <div className="absolute inset-3 border border-[#4caf7d] rounded-xl pointer-events-none" />

                {/* Diagonal watermark */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #1a6b3c 0, #1a6b3c 2px, transparent 0, transparent 30px)',
                    backgroundSize: '42px 42px'
                  }}
                />

                {/* Corner ornaments */}
                {[['top-5 left-5', 'origin-top-left'], ['top-5 right-5', 'origin-top-right'], ['bottom-5 left-5', 'origin-bottom-left'], ['bottom-5 right-5', 'origin-bottom-right']].map(([pos], i) => (
                  <div key={i} className={`absolute ${pos} w-5 h-5`}>
                    <div className="w-3 h-3 rounded-full bg-[#c8a84b] m-auto mt-1" />
                  </div>
                ))}

                {/* Content */}
                <div className="relative flex flex-col items-center justify-center h-full px-10 py-6 text-center gap-2">
                  {/* Logo + Company */}
                  <div className="flex items-center gap-3 mb-1">
                    <img src="/almog-logo.gif" alt="ALMOG" className="h-10 object-contain" />
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">ALMOG OIL SERVICES</div>
                      <div className="text-[9px] text-gray-500 tracking-wide">Professional Training Division</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="h-px flex-1 bg-[#c8a84b]" />
                    <Star className="h-3 w-3 text-[#c8a84b]" />
                    <div className="h-px flex-1 bg-[#c8a84b]" />
                  </div>

                  {/* Certificate title */}
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-emerald-800 tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}>
                      Certificate of Completion
                    </h1>
                  </div>

                  {/* Recipient */}
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">This is to certify that</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                      {user?.name || 'Student'}
                    </p>
                    <div className="h-px w-48 bg-emerald-600 mx-auto mt-1" />
                  </div>

                  {/* Completion text */}
                  <div>
                    <p className="text-[10px] text-gray-500">has successfully completed</p>
                    <p className="text-sm md:text-base font-bold text-emerald-700 mt-0.5 max-w-sm">
                      {module.titleEn || module.titleAr}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {(module as any).courseId === 2
                        ? 'Oil & Gas Wellhead Maintenance — Onshore & Offshore'
                        : 'Early Production Facilities (EPF) Course'}
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-stretch gap-4 mt-1">
                    <div className="bg-emerald-50 rounded-lg px-4 py-2 text-center border border-emerald-100">
                      <div className="text-lg font-bold text-emerald-700">{certScorePercent}%</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-wider">Quiz Score</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg px-4 py-2 text-center border border-amber-100">
                      <div className="text-lg font-bold text-amber-600">{certAttemptCount}</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-wider">{certAttemptCount === 1 ? 'Attempt' : 'Attempts'}</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg px-4 py-2 text-center border border-emerald-100">
                      <div className="text-sm font-bold text-emerald-700">{completionDateEn}</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-wider">Date of Issue</div>
                    </div>
                  </div>

                  {/* Signature lines */}
                  <div className="flex items-end gap-12 mt-1">
                    <div className="text-center">
                      <div className="h-px w-28 bg-gray-400 mb-1" />
                      <div className="text-[9px] text-gray-500">Training Director</div>
                    </div>
                    <div className="text-center">
                      <div className="h-px w-28 bg-gray-400 mb-1" />
                      <div className="text-[9px] text-gray-500">Course Coordinator</div>
                    </div>
                  </div>

                  {/* Verification footer */}
                  {verificationCode && (
                    <div className="absolute bottom-2 left-4 right-4 bg-emerald-800 text-white text-[8px] py-1 px-3 rounded text-center tracking-wide">
                      Verification Code: {verificationCode} | ALMOG Oil Services — Valid for Professional Use
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 flex items-center gap-3">
                <div className="bg-emerald-100 rounded-lg p-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">نتيجة الاختبار</div>
                  <div className="text-lg font-bold text-emerald-700">{certScorePercent}%</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 flex items-center gap-3">
                <div className="bg-amber-100 rounded-lg p-2">
                  <RefreshCw className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">عدد المحاولات</div>
                  <div className="text-lg font-bold text-amber-600">{certAttemptCount} {certAttemptCount === 1 ? 'محاولة' : 'محاولات'}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">تاريخ الإصدار</div>
                  <div className="text-sm font-bold text-blue-700">{completionDate}</div>
                </div>
              </div>
            </div>

            {/* Verification code display */}
            {verificationCode && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="bg-gray-100 rounded-lg p-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">رمز التحقق من الشهادة (Anti-Forgery Code)</div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-emerald-600" />
                    <code className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                      {verificationCode}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    هذا الرمز الفريد مُدرج في ملف PDF ويُستخدم للتحقق من أصالة الشهادة.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              {existingCertificate ? (
                <Button
                  onClick={() => downloadCertificate(existingCertificate.id)}
                  disabled={downloadCertificateMutation.isPending}
                  size="lg"
                  className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {downloadCertificateMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      جاري التنزيل...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      تنزيل شهادة PDF
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleGenerateCertificate}
                  disabled={generating}
                  size="lg"
                  className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      جاري إنشاء الشهادة...
                    </>
                  ) : (
                    <>
                      <Award className="h-5 w-5" />
                      إنشاء وتنزيل الشهادة
                    </>
                  )}
                </Button>
              )}
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="flex-1 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  لوحة التحكم
                </Button>
              </Link>
            </div>

            {existingCertificate && (
              <p className="text-center text-sm text-muted-foreground">
                صدرت الشهادة بتاريخ {completionDate}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
