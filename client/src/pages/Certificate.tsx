import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, Award, Download, ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { toast } from "sonner";
// jsPDF removed - now using server-side generation

export default function Certificate() {
  const { id } = useParams<{ id: string }>();
  const moduleId = parseInt(id || "0");
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [generating, setGenerating] = useState(false);

  const { data: module, isLoading: moduleLoading } = trpc.course.getModule.useQuery({ moduleId });
  const { data: quizAttempts } = trpc.quiz.getUserAttempts.useQuery({ moduleId }, {
    enabled: isAuthenticated,
  });
  const { data: certificates } = trpc.certificate.getUserCertificates.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const generateCertificate = trpc.certificate.generateCertificate.useMutation();

  if (authLoading || moduleLoading) {
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

  // Check if user has passed the quiz
  const latestAttempt = quizAttempts?.[0];
  const hasPassed = latestAttempt && (latestAttempt.score / latestAttempt.totalQuestions) >= 0.7;

  // Check if certificate already exists
  const existingCertificate = certificates?.find(c => c.moduleId === moduleId);

  const handleGenerateCertificate = async () => {
    if (!user || !module) return;

    setGenerating(true);
    try {
      const result = await generateCertificate.mutateAsync({
        moduleId,
      });

      if (result.success && result.certificateUrl) {
        // Download the certificate
        const link = document.createElement('a');
        link.href = result.certificateUrl;
        link.download = `EPF_Certificate_Module_${module.moduleNumber}.pdf`;
        link.click();
        
        toast.success("تم إصدار الشهادة بنجاح!");
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("حدث خطأ أثناء إنشاء الشهادة");
    } finally {
      setGenerating(false);
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
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="ml-2 h-4 w-4" />
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-16 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Award className="h-20 w-20 text-primary" />
            </div>
            <CardTitle className="text-3xl">شهادة إتمام الوحدة</CardTitle>
            <CardDescription className="text-lg mt-2">
              {module.titleAr}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!hasPassed ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                <p className="text-yellow-800 dark:text-yellow-200">
                  يجب أن تحصل على 70% أو أكثر في اختبار الوحدة للحصول على الشهادة.
                </p>
                <Link href={`/quiz/${moduleId}`}>
                  <Button className="mt-4">
                    إعادة الاختبار
                  </Button>
                </Link>
              </div>
            ) : existingCertificate ? (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <p className="text-green-800 dark:text-green-200 mb-2">
                    تم إصدار شهادتك بنجاح!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    تاريخ الإصدار: {new Date(existingCertificate.issuedAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <a href={existingCertificate.certificateUrl} download>
                  <Button className="w-full" size="lg">
                    <Download className="ml-2 h-5 w-5" />
                    تحميل الشهادة
                  </Button>
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <p className="text-green-800 dark:text-green-200">
                    مبروك! لقد اجتزت الوحدة بنجاح. يمكنك الآن إصدار شهادتك.
                  </p>
                </div>
                <Button
                  onClick={handleGenerateCertificate}
                  disabled={generating}
                  className="w-full"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                      جاري إنشاء الشهادة...
                    </>
                  ) : (
                    <>
                      <Award className="ml-2 h-5 w-5" />
                      إصدار الشهادة
                    </>
                  )}
                </Button>
              </div>
            )}

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">معلومات الشهادة:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• الشهادة تحتوي على اسمك وتاريخ الإكمال</li>
                <li>• يمكنك تحميل الشهادة بصيغة PDF</li>
                <li>• الشهادة متاحة للتحميل في أي وقت من لوحة التحكم</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
