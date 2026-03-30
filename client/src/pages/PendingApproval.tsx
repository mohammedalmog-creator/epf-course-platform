import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function PendingApproval() {
  const [, navigate] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => navigate("/login"),
  });

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg, #1a3a8f 0%, #1e4db7 50%, #1a3a8f 100%)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 max-w-md w-full mx-4 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">حسابك قيد المراجعة</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          شكراً لتسجيلك في منصة المُق للتدريب التقني. تم استلام طلبك وهو الآن قيد المراجعة من قبل المسؤول.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800 text-right">
          <p className="font-semibold mb-1">ماذا يحدث الآن؟</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>سيراجع المسؤول بيانات حسابك</li>
            <li>سيتم قبول أو رفض طلبك</li>
            <li>بعد القبول يمكنك الدخول والبدء في التعلم</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            تحقق من حالة الحساب
          </button>
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors text-sm"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="text-center mt-6 text-blue-200 text-xs">
        <p>© 2026 ALMOG Oil Services Training Platform</p>
      </div>
    </div>
  );
}
