import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCheck, Shield, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PageHeader() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const showTraineeNotifications = Boolean(isAuthenticated && user?.role !== "admin");
  const { data: notifications = [] } = trpc.notifications.getMine.useQuery(undefined, {
    enabled: showTraineeNotifications,
    refetchInterval: 30_000,
  });
  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => utils.notifications.getMine.invalidate(),
  });
  const markAllReadMutation = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => utils.notifications.getMine.invalidate(),
  });
  const [locallyReadIds, setLocallyReadIds] = useState<number[]>([]);
  const isUnread = (notification: (typeof notifications)[number]) =>
    !notification.isRead && !locallyReadIds.includes(notification.id);
  const unreadCount = notifications.filter(isUnread).length;

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
              {showTraineeNotifications && (
                <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative rounded-full"
                      aria-label="إشعارات المتدرب"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[360px] max-w-[calc(100vw-2rem)] p-0">
                    <div className="flex items-center justify-between px-3 py-2">
                      <DropdownMenuLabel className="px-0 text-base">إشعاراتي</DropdownMenuLabel>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs text-primary"
                          onClick={() => {
                            setLocallyReadIds(notifications.map(notification => notification.id));
                            markAllReadMutation.mutate();
                          }}
                          disabled={markAllReadMutation.isPending}
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          تحديد الكل كمقروء
                        </Button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-[360px] overflow-y-auto p-1">
                      {notifications.length === 0 ? (
                        <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                          لا توجد إشعارات جديدة
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <DropdownMenuItem
                            key={notification.id}
                            className={`items-start whitespace-normal p-3 cursor-pointer ${isUnread(notification) ? "bg-primary/5" : ""}`}
                            onSelect={() => {
                              if (isUnread(notification)) {
                                setLocallyReadIds(previous => [...previous, notification.id]);
                                markReadMutation.mutate({ notificationId: notification.id });
                              }
                            }}
                          >
                            <div className="min-w-0 flex-1 text-right">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm leading-5 ${isUnread(notification) ? "font-bold" : "font-medium"}`}>
                                  {notification.title}
                                </p>
                                {isUnread(notification) && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                              </div>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">{notification.message}</p>
                              <p className="mt-2 text-[10px] text-muted-foreground">
                                {new Date(notification.createdAt).toLocaleString("ar-SA")}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
