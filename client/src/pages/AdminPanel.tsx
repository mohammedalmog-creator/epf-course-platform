import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Award,
  BookOpen,
  BarChart3,
  Search,
  Shield,
  ShieldOff,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Calendar,
  Hash,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserDetailDialog({ userId, open, onClose }: { userId: number | null; open: boolean; onClose: () => void }) {
  const { data, isLoading } = trpc.admin.getUserDetail.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">تفاصيل المتدرب</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* User info */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {data.user.name?.charAt(0)?.toUpperCase() ?? "?"}
                </span>
              </div>
              <div>
                <p className="text-lg font-bold">{data.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  انضم في {new Date(data.user.createdAt).toLocaleDateString("ar-SA")}
                </p>
                <Badge variant={data.user.role === "admin" ? "default" : "secondary"} className="mt-1">
                  {data.user.role === "admin" ? "مسؤول" : "متدرب"}
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{data.completedLessonsCount}</p>
                <p className="text-xs text-muted-foreground">درس مكتمل</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{data.certificates.length}</p>
                <p className="text-xs text-muted-foreground">شهادة</p>
              </div>
              <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{data.quizAttempts.length}</p>
                <p className="text-xs text-muted-foreground">محاولة اختبار</p>
              </div>
            </div>

            {/* Certificates */}
            {data.certificates.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  الشهادات المُصدرة
                </h3>
                <div className="space-y-2">
                  {data.certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                      <div>
                        <p className="font-medium">{cert.moduleTitleAr}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(cert.issuedAt).toLocaleDateString("ar-SA")} · {cert.attemptCount} محاولة · {cert.scorePercent}%
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">{cert.verificationCode}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent quiz attempts */}
            {data.quizAttempts.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  آخر محاولات الاختبار
                </h3>
                <div className="space-y-2">
                  {data.quizAttempts.slice(0, 5).map((attempt) => {
                    const pct = Math.round((attempt.score / attempt.totalQuestions) * 100);
                    return (
                      <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                        <div>
                          <p className="font-medium">{attempt.moduleTitleAr}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(attempt.completedAt).toLocaleDateString("ar-SA")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${pct >= 70 ? "text-green-600" : "text-red-500"}`}>{pct}%</p>
                          <p className="text-xs text-muted-foreground">{attempt.score}/{attempt.totalQuestions}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">لا توجد بيانات</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── CSV Export Helpers ──────────────────────────────────────────────────────
function downloadCSV(filename: string, rows: string[][]) {
  const bom = "\uFEFF"; // UTF-8 BOM for Arabic support in Excel
  const csv = bom + rows.map(r => r.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPanel() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [searchUsers, setSearchUsers] = useState("");
  const [searchQuiz, setSearchQuiz] = useState("");
  const [searchCerts, setSearchCerts] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const { data: users, isLoading: usersLoading } = trpc.admin.getUsers.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const { data: quizAttempts, isLoading: quizLoading } = trpc.admin.getQuizAttempts.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const { data: certificates, isLoading: certsLoading } = trpc.admin.getCertificates.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const utils = trpc.useUtils();
  const promoteMutation = trpc.admin.promoteUser.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      toast.success("تم تحديث صلاحية المستخدم");
    },
    onError: () => toast.error("فشل تحديث الصلاحية"),
  });

  const filteredUsers = useMemo(() =>
    (users ?? []).filter(u =>
      u.name?.toLowerCase().includes(searchUsers.toLowerCase()) ||
      u.openId?.toLowerCase().includes(searchUsers.toLowerCase())
    ), [users, searchUsers]);

  const filteredQuiz = useMemo(() =>
    (quizAttempts ?? []).filter(a =>
      a.userName?.toLowerCase().includes(searchQuiz.toLowerCase()) ||
      a.moduleTitleAr?.toLowerCase().includes(searchQuiz.toLowerCase())
    ), [quizAttempts, searchQuiz]);

  const filteredCerts = useMemo(() =>
    (certificates ?? []).filter(c =>
      c.userName?.toLowerCase().includes(searchCerts.toLowerCase()) ||
      c.moduleTitleAr?.toLowerCase().includes(searchCerts.toLowerCase()) ||
      c.verificationCode?.toLowerCase().includes(searchCerts.toLowerCase())
    ), [certificates, searchCerts]);

  const exportUsersCSV = () => {
    const headers = ["#", "الاسم", "الصلاحية", "تاريخ الانضمام"];
    const rows = (users ?? []).map((u, i) => [
      String(i + 1),
      u.name ?? "",
      u.role === "admin" ? "مسؤول" : "متدرب",
      new Date(u.createdAt).toLocaleDateString("ar-SA"),
    ]);
    downloadCSV("المتدربون.csv", [headers, ...rows]);
    toast.success("تم تصدير قائمة المتدربين");
  };

  const exportQuizCSV = () => {
    const headers = ["المتدرب", "الوحدة", "النتيجة", "النسبة", "الحالة", "التاريخ"];
    const rows = (quizAttempts ?? []).map(a => {
      const pct = Math.round((a.score / a.totalQuestions) * 100);
      return [
        a.userName ?? "",
        a.moduleTitleAr ?? "",
        `${a.score}/${a.totalQuestions}`,
        `${pct}%`,
        pct >= 70 ? "ناجح" : "راسب",
        new Date(a.completedAt).toLocaleDateString("ar-SA"),
      ];
    });
    downloadCSV("نتائج_الاختبارات.csv", [headers, ...rows]);
    toast.success("تم تصدير نتائج الاختبارات");
  };

  const exportCertsCSV = () => {
    const headers = ["المتدرب", "الوحدة", "النتيجة", "المحاولات", "رمز التحقق", "تاريخ الإصدار"];
    const rows = (certificates ?? []).map(c => [
      c.userName ?? "",
      c.moduleTitleAr ?? "",
      `${c.scorePercent ?? 0}%`,
      String(c.attemptCount ?? 1),
      c.verificationCode ?? "",
      new Date(c.issuedAt).toLocaleDateString("ar-SA"),
    ]);
    downloadCSV("الشهادات.csv", [headers, ...rows]);
    toast.success("تم تصدير قائمة الشهادات");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" dir="rtl">
        <Shield className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">غير مصرح بالوصول</h1>
        <p className="text-muted-foreground">هذه الصفحة مخصصة للمسؤولين فقط</p>
        <Button onClick={() => navigate("/")}>العودة للرئيسية</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex h-24 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="ALMOG" className="h-36 object-contain" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground leading-tight">شركة المُق للخدمات النفطية</p>
              <p className="text-sm font-bold leading-tight">لوحة تحكم المسؤول</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1">
              <Shield className="h-3 w-3" />
              مسؤول
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              الرئيسية
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/courses")}>
              الكورسات
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold">لوحة تحكم المسؤولين</h1>
          <p className="text-muted-foreground mt-1">إدارة المتدربين ومتابعة نتائجهم وشهاداتهم</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatCard icon={Users} label="إجمالي المتدربين" value={stats?.totalUsers ?? 0} color="bg-blue-500" />
              <StatCard icon={Award} label="الشهادات المُصدرة" value={stats?.totalCertificates ?? 0} color="bg-amber-500" />
              <StatCard icon={BarChart3} label="محاولات الاختبار" value={stats?.totalQuizAttempts ?? 0} color="bg-purple-500" />
              <StatCard icon={BookOpen} label="الدروس المكتملة" value={stats?.totalLessonsCompleted ?? 0} color="bg-green-500" />
            </>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              المتدربون ({users?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              نتائج الاختبارات ({quizAttempts?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="certs" className="gap-2">
              <Award className="h-4 w-4" />
              الشهادات ({certificates?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          {/* ── Trainees Tab ── */}
          <TabsContent value="users">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="text-lg">قائمة المتدربين</CardTitle>
                  <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={exportUsersCSV} className="gap-2 shrink-0">
                    <Download className="h-4 w-4" />
                    تصدير CSV
                  </Button>
                  <div className="relative w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث بالاسم..."
                      value={searchUsers}
                      onChange={e => setSearchUsers(e.target.value)}
                      className="pr-9 text-right"
                    />
                  </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">#</TableHead>
                        <TableHead className="text-right">الاسم</TableHead>
                        <TableHead className="text-right">الصلاحية</TableHead>
                        <TableHead className="text-right">تاريخ الانضمام</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            لا توجد نتائج
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((u, idx) => (
                          <TableRow key={u.id}>
                            <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                  {u.name?.charAt(0)?.toUpperCase() ?? "?"}
                                </div>
                                <span className="font-medium">{u.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                                {u.role === "admin" ? "مسؤول" : "متدرب"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(u.createdAt).toLocaleDateString("ar-SA")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedUserId(u.id)}
                                  className="gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  عرض
                                </Button>
                                {u.id !== user.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => promoteMutation.mutate({
                                      userId: u.id,
                                      role: u.role === "admin" ? "user" : "admin",
                                    })}
                                    className={`gap-1 ${u.role === "admin" ? "text-red-500 hover:text-red-600" : "text-blue-500 hover:text-blue-600"}`}
                                  >
                                    {u.role === "admin" ? (
                                      <><ShieldOff className="h-3 w-3" />إلغاء المسؤول</>
                                    ) : (
                                      <><Shield className="h-3 w-3" />ترقية لمسؤول</>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Quiz Results Tab ── */}
          <TabsContent value="quiz">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="text-lg">نتائج الاختبارات</CardTitle>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={exportQuizCSV} className="gap-2 shrink-0">
                      <Download className="h-4 w-4" />
                      تصدير CSV
                    </Button>
                    <div className="relative w-64">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="بحث بالاسم أو الوحدة..."
                        value={searchQuiz}
                        onChange={e => setSearchQuiz(e.target.value)}
                        className="pr-9 text-right"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {quizLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المتدرب</TableHead>
                        <TableHead className="text-right">الوحدة</TableHead>
                        <TableHead className="text-right">النتيجة</TableHead>
                        <TableHead className="text-right">النسبة</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuiz.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            لا توجد نتائج
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredQuiz.map((attempt) => {
                          const pct = Math.round((attempt.score / attempt.totalQuestions) * 100);
                          const passed = pct >= 70;
                          return (
                            <TableRow key={attempt.id}>
                              <TableCell className="font-medium">{attempt.userName ?? "—"}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{attempt.moduleTitleAr ?? "—"}</TableCell>
                              <TableCell>{attempt.score}/{attempt.totalQuestions}</TableCell>
                              <TableCell>
                                <span className={`font-bold ${passed ? "text-green-600" : "text-red-500"}`}>
                                  {pct}%
                                </span>
                              </TableCell>
                              <TableCell>
                                {passed ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    ناجح
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="gap-1">
                                    <XCircle className="h-3 w-3" />
                                    راسب
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(attempt.completedAt).toLocaleDateString("ar-SA")}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Certificates Tab ── */}
          <TabsContent value="certs">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="text-lg">الشهادات المُصدرة</CardTitle>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={exportCertsCSV} className="gap-2 shrink-0">
                      <Download className="h-4 w-4" />
                      تصدير CSV
                    </Button>
                    <div className="relative w-64">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="بحث بالاسم أو رمز التحقق..."
                        value={searchCerts}
                        onChange={e => setSearchCerts(e.target.value)}
                        className="pr-9 text-right"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {certsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المتدرب</TableHead>
                        <TableHead className="text-right">الوحدة</TableHead>
                        <TableHead className="text-right">النتيجة</TableHead>
                        <TableHead className="text-right">المحاولات</TableHead>
                        <TableHead className="text-right">رمز التحقق</TableHead>
                        <TableHead className="text-right">تاريخ الإصدار</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCerts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            لا توجد شهادات بعد
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCerts.map((cert) => (
                          <TableRow key={cert.id}>
                            <TableCell className="font-medium">{cert.userName ?? "—"}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{cert.moduleTitleAr ?? "—"}</TableCell>
                            <TableCell>
                              <span className="font-bold text-green-600">{cert.scorePercent}%</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {cert.attemptCount}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                {cert.verificationCode}
                              </code>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(cert.issuedAt).toLocaleDateString("ar-SA")}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* User Detail Dialog */}
      <UserDetailDialog
        userId={selectedUserId}
        open={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
}
