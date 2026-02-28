import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Mail, User, CheckCircle, Loader2, Shield } from "lucide-react";

const LOGO_URL = "https://files.manus.im/webdev/pasted_file_QajoAB_ALMOG-logo2.png";

export default function ProfileSetup() {
  const [, navigate] = useLocation();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => navigate("/courses"), 2000);
    },
    onError: (err) => {
      setError(err.message || "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مجدداً.");
    },
  });

  // If profile already completed, redirect to courses
  if (!profileLoading && profile?.profileCompleted) {
    navigate("/courses");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone.trim() || phone.trim().length < 7) {
      setError("يرجى إدخال رقم هاتف صحيح (7 أرقام على الأقل)");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    updateProfile.mutate({ phone: phone.trim(), email: email.trim() });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
      dir="rtl"
    >
      {/* Logo */}
      <div className="mb-8 text-center">
        <img src={LOGO_URL} alt="ALMOG" className="h-20 mx-auto mb-4" />
        <p className="text-slate-400 text-sm">منصة التدريب التقني</p>
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-white">أكمل ملفك الشخصي</CardTitle>
          <CardDescription className="text-slate-400 text-base mt-2">
            مرحباً بك في منصة المُق للتدريب التقني!
            <br />
            يرجى إدخال بياناتك للمتابعة والوصول إلى الكورسات.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-lg font-semibold">تم حفظ بياناتك بنجاح!</p>
              <p className="text-slate-400 text-sm">جاري تحويلك إلى الكورسات...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="مثال: 0501234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="text-right bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-primary"
                  dir="ltr"
                  required
                />
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="text-right bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-primary"
                  dir="ltr"
                  required
                />
              </div>

              {/* Error message */}
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {/* Privacy note */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                <Shield className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-slate-400 text-xs leading-relaxed">
                  بياناتك محمية ولن تُشارك مع أطراف ثالثة. تُستخدم فقط للتواصل معك بشأن الكورسات والشهادات.
                </p>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ وبدء التعلم ←"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-6 text-slate-500 text-xs">
        © {new Date().getFullYear()} شركة المُق للخدمات النفطية. جميع الحقوق محفوظة.
      </p>
    </div>
  );
}
