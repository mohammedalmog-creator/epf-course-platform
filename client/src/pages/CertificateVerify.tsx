import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  XCircle,
  Search,
  Award,
  User,
  BookOpen,
  Calendar,
  Hash,
  TrendingUp,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png";

function VerificationResult({ data }: { data: NonNullable<ReturnType<typeof useVerify>["data"]> }) {
  const issuedDate = new Date(data.issuedAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const courseLabel = data.courseId === 1 ? "منشآت الإنتاج المبكر (EPF)" : "صيانة رأس البئر (Wellhead)";

  return (
    <div className="space-y-6">
      {/* Valid badge */}
      <div className="flex items-center justify-center gap-3 py-6">
        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">شهادة صحيحة ومعتمدة</h2>
        <p className="text-muted-foreground mt-1">تم التحقق من صحة هذه الشهادة بنجاح</p>
      </div>

      {/* Certificate details */}
      <div className="grid gap-4 mt-6">
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">اسم المتدرب</p>
            <p className="font-bold text-lg">{data.userName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">الوحدة التدريبية</p>
            <p className="font-bold">{data.moduleTitleAr}</p>
            <p className="text-xs text-muted-foreground">{data.moduleTitleEn}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border">
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">الكورس</p>
            <p className="font-bold">{courseLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800 text-center">
            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600">{data.scorePercent}%</p>
            <p className="text-xs text-muted-foreground">النتيجة</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
            <Hash className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-purple-600">{data.attemptCount}</p>
            <p className="text-xs text-muted-foreground">المحاولات</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
            <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-bold text-blue-600 leading-tight mt-1">{issuedDate}</p>
            <p className="text-xs text-muted-foreground">تاريخ الإصدار</p>
          </div>
        </div>

        {/* Verification code */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">رمز التحقق</span>
          </div>
          <code className="text-sm font-mono bg-background px-3 py-1 rounded-lg border">
            {data.verificationCode}
          </code>
        </div>
      </div>

      {/* Issuer */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t">
        <img src={LOGO_URL} alt="ALMOG" className="h-10 object-contain" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">شركة المُق للخدمات النفطية</p>
          <p>منصة التدريب التقني</p>
        </div>
      </div>
    </div>
  );
}

function useVerify(code: string | undefined) {
  return trpc.certificates.verify.useQuery(
    { code: code ?? "" },
    { enabled: !!code && code.length > 0 }
  );
}

export default function CertificateVerify() {
  const params = useParams<{ code?: string }>();
  const [, navigate] = useLocation();
  const [inputCode, setInputCode] = useState(params.code ?? "");
  const [searchCode, setSearchCode] = useState(params.code ?? "");

  const { data, isLoading, isFetched } = useVerify(searchCode);

  const handleSearch = () => {
    const trimmed = inputCode.trim().toUpperCase();
    if (!trimmed) return;
    setSearchCode(trimmed);
    navigate(`/verify/${trimmed}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 flex h-24 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="ALMOG" className="h-36 object-contain" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground leading-none">شركة المُق للخدمات النفطية</p>
              <p className="text-sm font-bold leading-tight">التحقق من الشهادات</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              الرئيسية
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">التحقق من صحة الشهادة</h1>
          <p className="text-muted-foreground mt-2">
            أدخل رمز التحقق الموجود أسفل الشهادة للتأكد من صحتها وأصالتها
          </p>
        </div>

        {/* Search box */}
        <Card className="border-0 shadow-md mb-8">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="أدخل رمز التحقق (مثال: ALMG-XXXX-XXXX)"
                value={inputCode}
                onChange={e => setInputCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="text-right font-mono text-sm flex-1"
                dir="ltr"
              />
              <Button onClick={handleSearch} disabled={!inputCode.trim()} className="gap-2 shrink-0">
                <Search className="h-4 w-4" />
                تحقق
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              رمز التحقق يوجد في أسفل الشهادة المطبوعة أو المحملة
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading && searchCode && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <Skeleton className="h-6 w-48 mx-auto" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        )}

        {!isLoading && isFetched && searchCode && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              {data ? (
                <VerificationResult data={data} />
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center mx-auto">
                    <XCircle className="h-12 w-12 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-500">شهادة غير صحيحة</h2>
                  <p className="text-muted-foreground">
                    لم يتم العثور على شهادة بهذا الرمز. تأكد من صحة الرمز وحاول مجدداً.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    رمز البحث: <code className="font-mono bg-muted px-2 py-0.5 rounded">{searchCode}</code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info box */}
        {!searchCode && (
          <div className="text-center text-muted-foreground py-8 space-y-2">
            <Award className="h-12 w-12 mx-auto opacity-30" />
            <p className="text-sm">أدخل رمز التحقق أعلاه للبدء</p>
          </div>
        )}
      </main>
    </div>
  );
}
