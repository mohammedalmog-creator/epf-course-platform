import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, Award, Download, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading certificate...</p>
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
          <p className="text-lg text-muted-foreground">Module not found</p>
          <Link href="/courses">
            <Button className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const latestAttempt = quizAttempts?.[0];
  const hasPassed = latestAttempt && (latestAttempt.score / latestAttempt.totalQuestions) >= 0.7;
  const scorePercent = latestAttempt ? Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100) : 0;
  const existingCertificate = certificates?.find(c => c.moduleId === moduleId);

  const handleGenerateCertificate = async () => {
    if (!user || !module) return;
    setGenerating(true);
    try {
      const result = await generateCertificate.mutateAsync({ moduleId });
      if (result.success && result.certificateUrl) {
        toast.success("Certificate issued successfully!");
        await refetchCerts();
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("An error occurred while generating the certificate");
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
        toast.success("Certificate downloaded successfully!");
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download certificate");
    }
  };

  const completionDate = existingCertificate
    ? new Date(existingCertificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/almog-logo.gif" alt="ALMOG" className="h-14" />
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-bold">Course Platform</h1>
              </div>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Yet Available</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You need to score <strong>70% or above</strong> on the module quiz to earn your certificate.
                  {latestAttempt && <span className="block mt-1 text-yellow-700">Your last score: <strong>{scorePercent}%</strong></span>}
                </p>
              </div>
              <Link href={`/quiz/${moduleId}`}>
                <Button size="lg" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retake Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Certificate Preview */}
            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <CheckCircle2 className="h-4 w-4" />
                Quiz Passed — Score: {scorePercent}%
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Your Certificate</h2>
              <p className="text-muted-foreground mt-1">Preview your certificate below</p>
            </div>

            {/* Visual Certificate */}
            <div className="relative mx-auto max-w-3xl">
              <div
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-double border-emerald-600"
                style={{ aspectRatio: '1.414/1', padding: '0' }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #059669 0, #059669 1px, transparent 0, transparent 50%)',
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Top decorative bar */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-700" />
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-700" />

                {/* Inner border */}
                <div className="absolute inset-4 border-2 border-emerald-200 rounded-xl pointer-events-none" />

                {/* Content */}
                <div className="relative flex flex-col items-center justify-center h-full px-12 py-8 text-center gap-3">
                  {/* Logo + Title row */}
                  <div className="flex items-center gap-4 mb-1">
                    <img src="/almog-logo.gif" alt="ALMOG" className="h-12 object-contain" />
                    <div className="text-left">
                      <div className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">ALMOG Oil Services</div>
                      <div className="text-xs text-gray-500">Professional Training Division</div>
                    </div>
                  </div>

                  {/* Certificate title */}
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-emerald-800 tracking-wide uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                      Certificate of Completion
                    </h1>
                    <div className="flex items-center justify-center gap-3 mt-1">
                      <div className="h-px w-16 bg-emerald-400" />
                      <Award className="h-5 w-5 text-emerald-500" />
                      <div className="h-px w-16 bg-emerald-400" />
                    </div>
                  </div>

                  {/* Recipient */}
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">This certifies that</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                      {user?.name || 'Student'}
                    </p>
                  </div>

                  {/* Completion text */}
                  <div>
                    <p className="text-sm text-gray-500">has successfully completed</p>
                    <p className="text-lg md:text-xl font-bold text-emerald-700 mt-1 max-w-lg">
                      {module.titleEn || module.titleAr}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {(module as any).courseId === 2
                        ? 'Oil & Gas Wellhead Maintenance — Onshore & Offshore'
                        : 'Early Production Facilities (EPF) Course'}
                    </p>
                  </div>

                  {/* Score + Date */}
                  <div className="flex items-center gap-8 mt-1">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-700">{scorePercent}%</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Quiz Score</div>
                    </div>
                    <div className="h-10 w-px bg-gray-200" />
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-700">{completionDate}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Date of Completion</div>
                    </div>
                  </div>

                  {/* Signature line */}
                  <div className="flex items-end gap-12 mt-2">
                    <div className="text-center">
                      <div className="h-px w-32 bg-gray-400 mb-1" />
                      <div className="text-xs text-gray-500">Training Director</div>
                    </div>
                    <div className="text-center">
                      <div className="h-px w-32 bg-gray-400 mb-1" />
                      <div className="text-xs text-gray-500">Participant Signature</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Download PDF Certificate
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
                      Generating Certificate...
                    </>
                  ) : (
                    <>
                      <Award className="h-5 w-5" />
                      Generate & Download Certificate
                    </>
                  )}
                </Button>
              )}
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="flex-1 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            {existingCertificate && (
              <p className="text-center text-sm text-muted-foreground">
                Certificate issued on {new Date(existingCertificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
