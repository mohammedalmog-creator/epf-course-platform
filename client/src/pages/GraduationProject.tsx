import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { BookOpen, Upload, FileText, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PROJECT_GUIDE = `# مشروع التخرج: تصميم منشأة إنتاج مبكر (EPF) افتراضية

**المدة:** 3 أسابيع (14 ساعة أسبوعياً = 42 ساعة إجمالاً)

---

## نظرة عامة على المشروع

ستقوم بتصميم منشأة إنتاج مبكر كاملة لحقل نفطي افتراضي، بدءاً من تحليل البيانات الأولية وحتى إعداد تقرير تصميم نهائي شامل.

---

## سيناريو المشروع

**اسم الحقل:** حقل "الأمل الجديد" (New Hope Field)

**الموقع:** منطقة صحراوية نائية، على بعد 150 كم من أقرب منشأة معالجة مركزية (CPF).

**الوضع:** تم اكتشاف الحقل حديثاً. أظهرت اختبارات الآبار الأولية إمكانات إنتاج واعدة. الشركة قررت بناء منشأة إنتاج مبكر (EPF) لبدء الإنتاج بسرعة وتحقيق عائد مبكر على الاستثمار.

---

## البيانات المعطاة

### 1. بيانات الإنتاج

*   **عدد الآبار المنتجة:** 4 آبار
*   **معدل الإنتاج المتوقع لكل بئر:**
    *   النفط الخام: 1,500 برميل/يوم
    *   الغاز: 2 MMSCFD (مليون قدم مكعب قياسي يومياً)
    *   الماء: 500 برميل/يوم
*   **ضغط رأس البئر:** 800 psia
*   **درجة حرارة رأس البئر:** 180°F (82°C)

### 2. خصائص السوائل

**النفط الخام:**
*   الكثافة: 35° API (كثافة متوسطة)
*   اللزوجة عند 100°F: 15 cP
*   RVP: 10 psia
*   محتوى الكبريت: 1.5% (نفط حامضي)
*   BS&W: 3%

**الغاز الطبيعي:**
*   التركيب: 85% ميثان، 8% إيثان، 4% بروبان، 2% بيوتان، 1% CO2، 500 ppm H2S (غاز حامضي)
*   محتوى بخار الماء: مشبع

---

## المطلوب منك

### 1. تحليل البيانات الأولية
- حساب معدلات الإنتاج الإجمالية
- تحديد نسب الغاز إلى النفط (GOR)
- تحليل خصائص السوائل

### 2. تصميم نظام الفصل
- اختيار نوع الفاصل المناسب
- حساب أبعاد الفاصل
- تحديد ضغط ودرجة حرارة التشغيل

### 3. تصميم أنظمة المعالجة
- نظام معالجة النفط (إزالة الماء والأملاح)
- نظام معالجة الغاز (إزالة H2S والتجفيف)
- نظام معالجة المياه المنتجة

### 4. أنظمة التخزين والتصدير
- حساب سعة خزانات التخزين
- تصميم نظام القياس
- تحديد طريقة التصدير

### 5. السلامة والبيئة
- تحديد أنظمة السلامة المطلوبة
- تصميم نظام الإطفاء
- إجراءات الحماية البيئية

### 6. دراسة الجدوى الاقتصادية
- تقدير التكاليف الرأسمالية (CAPEX)
- تقدير التكاليف التشغيلية (OPEX)
- حساب العائد على الاستثمار (ROI)

---

## التسليمات المطلوبة

يجب أن يحتوي تقريرك النهائي على:

1. **ملخص تنفيذي** (صفحة واحدة)
2. **مقدمة** - وصف المشروع والأهداف
3. **تحليل البيانات** - جميع الحسابات والتحليلات
4. **التصميم التفصيلي** - مخططات ورسومات توضيحية
5. **دراسة الجدوى** - التحليل الاقتصادي
6. **الخلاصة والتوصيات**
7. **المراجع والملاحق**

**الصيغة المطلوبة:** PDF
**عدد الصفحات:** 20-30 صفحة

---

## معايير التقييم

- **الدقة الفنية** (40%)
- **الشمولية** (25%)
- **الوضوح والتنظيم** (20%)
- **الإبداع والابتكار** (15%)

---

## نصائح للنجاح

✓ ابدأ مبكراً ولا تؤجل العمل
✓ استخدم المعادلات والمعايير الهندسية المعتمدة
✓ ارجع إلى محتوى الدورة للمساعدة
✓ استخدم الرسومات والمخططات لتوضيح التصميم
✓ راجع عملك قبل التسليم

**بالتوفيق!**
`;

export default function GraduationProject() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: submissions, isLoading: submissionsLoading } = trpc.project.getUserSubmissions.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const submitProject = trpc.project.submitProject.useMutation();

  if (authLoading || submissionsLoading) {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast.error("الرجاء اختيار ملف PDF فقط");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("الرجاء اختيار ملف التقرير");
      return;
    }

    setUploading(true);
    try {
      // In a real implementation, upload file to S3 first
      // For now, we'll create a mock URL
      const mockUrl = URL.createObjectURL(file);

      await submitProject.mutateAsync({
        reportFileUrl: mockUrl,
        reportFileName: file.name,
        notes: notes || undefined,
      });

      toast.success("تم رفع المشروع بنجاح!");
      setFile(null);
      setNotes("");
    } catch (error) {
      toast.error("حدث خطأ أثناء رفع المشروع");
    } finally {
      setUploading(false);
    }
  };

  const latestSubmission = submissions?.[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-40 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png" alt="ALMOG" className="h-36" />
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground leading-none">شركة المُق للخدمات النفطية</p>
                <p className="text-sm font-bold leading-tight">منصة التدريب التقني</p>
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
      <main className="container py-8 max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Project Guide */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">دليل مشروع التخرج</CardTitle>
                <CardDescription>
                  اقرأ التعليمات بعناية قبل البدء في المشروع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="markdown-content prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {PROJECT_GUIDE}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submission Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Upload Form */}
              <Card>
                <CardHeader>
                  <CardTitle>رفع المشروع</CardTitle>
                  <CardDescription>
                    قم برفع تقرير المشروع بصيغة PDF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="file">ملف التقرير (PDF)</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="mt-1"
                      />
                      {file && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <FileText className="inline h-4 w-4 ml-1" />
                          {file.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="أضف أي ملاحظات أو تعليقات..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={!file || uploading}
                      className="w-full"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          جاري الرفع...
                        </>
                      ) : (
                        <>
                          <Upload className="ml-2 h-4 w-4" />
                          رفع المشروع
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Previous Submissions */}
              {latestSubmission && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      تم الرفع بنجاح
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <p className="text-muted-foreground">اسم الملف:</p>
                      <p className="font-medium">{latestSubmission.reportFileName}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">تاريخ الرفع:</p>
                      <p className="font-medium">
                        {new Date(latestSubmission.submittedAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    {latestSubmission.notes && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">ملاحظات:</p>
                        <p className="font-medium">{latestSubmission.notes}</p>
                      </div>
                    )}
                    <a href={latestSubmission.reportFileUrl} download>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        تحميل التقرير
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
