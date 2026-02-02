import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, Award, Download, ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";

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
  
  const issueCertificate = trpc.certificate.issueCertificate.useMutation();

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

  const generateCertificate = async () => {
    if (!user || !module) return;

    setGenerating(true);
    try {
      // Create PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Set RTL support (limited in jsPDF, we'll use English for certificate)
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(240, 248, 255);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Border
      doc.setDrawColor(34, 139, 34);
      doc.setLineWidth(2);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Title
      doc.setFontSize(40);
      doc.setTextColor(34, 139, 34);
      doc.text("Certificate of Completion", pageWidth / 2, 40, { align: "center" });

      // Subtitle
      doc.setFontSize(16);
      doc.setTextColor(100, 100, 100);
      doc.text("This certifies that", pageWidth / 2, 60, { align: "center" });

      // User name
      doc.setFontSize(32);
      doc.setTextColor(0, 0, 0);
      doc.text(user.name || "Student", pageWidth / 2, 80, { align: "center" });

      // Description
      doc.setFontSize(16);
      doc.setTextColor(100, 100, 100);
      doc.text("has successfully completed", pageWidth / 2, 100, { align: "center" });

      // Module name
      doc.setFontSize(24);
      doc.setTextColor(34, 139, 34);
      const moduleTitle = module.titleEn || module.titleAr;
      doc.text(moduleTitle, pageWidth / 2, 120, { align: "center" });

      // Course name
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text("Early Production Facilities (EPF) Course", pageWidth / 2, 135, { align: "center" });

      // Date
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      const completionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Date of Completion: ${completionDate}`, pageWidth / 2, 155, { align: "center" });

      // Score
      if (latestAttempt) {
        const score = Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100);
        doc.text(`Quiz Score: ${score}%`, pageWidth / 2, 165, { align: "center" });
      }

      // Award icon (simple star)
      doc.setFillColor(255, 215, 0);
      doc.circle(pageWidth / 2, 35, 8, "F");

      // Save PDF as blob
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Save certificate record to database
      await issueCertificate.mutateAsync({
        moduleId,
        certificateUrl: pdfUrl,
      });

      // Download PDF
      doc.save(`EPF_Certificate_Module_${module.moduleNumber}.pdf`);

      toast.success("تم إصدار الشهادة بنجاح!");
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
                  onClick={generateCertificate}
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
