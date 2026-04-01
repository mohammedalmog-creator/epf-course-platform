import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PageHeader() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      navigate("/");
      toast.success("تم تسجيل الخروج بنجاح");
    },
  });

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png"
              alt="ALMOG"
              className="h-14 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground leading-none">شركة المُق للخدمات النفطية</p>
            <p className="text-sm font-bold leading-tight">منصة التدريب التقني</p>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-muted-foreground">مرحباً، {user?.name || "المتعلم"}</span>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">لوحة المسؤول</span>
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">دخول</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">تسجيل</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
