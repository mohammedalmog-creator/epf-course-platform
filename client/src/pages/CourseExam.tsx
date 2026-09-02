import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle, CheckCircle2, XCircle, Clock, BookOpen,
  Trophy, Lock, ChevronRight, ChevronLeft, Send, RotateCcw, Award
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ExamOption {
  id: string;
  text: string;
}
interface ExamQuestion {
  id: number;
  courseId: number;
  questionType: "mcq" | "true_false";
  questionText: string;
  options: ExamOption[];
  correctOptionId: string;
  timeLimitSeconds: number;
  order: number;
}

// ─── Timer Component ────────────────────────────────────────────────────────────
function QuestionTimer({
  limitSeconds,
  onExpire,
  paused,
}: {
  limitSeconds: number;
  onExpire: () => void;
  paused: boolean;
}) {
  const [remaining, setRemaining] = useState(limitSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    setRemaining(limitSeconds);
    expiredRef.current = false;
  }, [limitSeconds]);

  useEffect(() => {
    if (paused) return;
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, paused, onExpire]);

  const pct = (remaining / limitSeconds) * 100;
  const color = pct > 50 ? "text-emerald-400" : pct > 25 ? "text-amber-400" : "text-red-400";
  const bgColor = pct > 50 ? "bg-emerald-500" : pct > 25 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <Clock className={`w-4 h-4 ${color}`} />
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden w-24">
        <div
          className={`h-full ${bgColor} transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm font-mono font-bold ${color}`}>{remaining}s</span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function CourseExam() {
  const { courseId: courseIdStr } = useParams<{ courseId: string }>();
  const courseId = Number(courseIdStr);
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth();

  // State
  const [phase, setPhase] = useState<"intro" | "exam" | "result">("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timerPaused, setTimerPaused] = useState(false);
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [result, setResult] = useState<{
    passed: boolean;
    scorePercent: number;
    correct: number;
    total: number;
    certificate?: { verificationCode: string } | null;
    nextAllowedAt?: string | null;
  } | null>(null);
  const [autoAdvanceMsg, setAutoAdvanceMsg] = useState<string | null>(null);

  // Queries
  const statusQuery = trpc.courseExam.getStatus.useQuery({ courseId }, { enabled: !!user });
  const questionsQuery = trpc.courseExam.getQuestions.useQuery(
    { courseId },
    { enabled: phase === "exam" && !!user }
  );
  const submitMutation = trpc.courseExam.submit.useMutation();

  const questions: ExamQuestion[] = ((questionsQuery.data ?? []) as unknown as ExamQuestion[]);
  const currentQ = questions[currentIdx];

  // Course name mapping
  const courseNames: Record<number, string> = {
    1: "منشآت الإنتاج المبكر (EPF)",
    2: "صيانة رأس البئر (Wellhead Maintenance)",
  };
  const courseName = courseNames[courseId] ?? `الكورس ${courseId}`;

  // ── Lockout check ──────────────────────────────────────────────────────────
  const status = statusQuery.data;
  const lockedUntil = status?.lockedUntil ? new Date(status.lockedUntil) : null;
  const isLocked = lockedUntil ? lockedUntil > new Date() : false;
  const hasCertificate = status?.hasPassed;

  // ── Handle time expiry ─────────────────────────────────────────────────────
  const handleTimeExpire = useCallback(() => {
    if (!currentQ) return;
    // Auto-mark as wrong (no answer)
    setAnswers((prev) => ({ ...prev, [String(currentQ.id)]: "__expired__" }));
    setAutoAdvanceMsg("انتهى الوقت! الانتقال للسؤال التالي...");
    setTimeout(() => {
      setAutoAdvanceMsg(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1);
        setSelectedOption(null);
      } else {
        handleSubmit({ ...answers, [String(currentQ.id)]: "__expired__" });
      }
    }, 1500);
  }, [currentQ, currentIdx, questions.length, answers]);

  // ── Navigate questions ─────────────────────────────────────────────────────
  const handleSelectOption = (optionId: string) => {
    if (timerPaused) return;
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!currentQ || !selectedOption) return;
    const newAnswers = { ...answers, [String(currentQ.id)]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  // ── Submit exam ────────────────────────────────────────────────────────────
  const handleSubmit = async (finalAnswers: Record<string, string>) => {
    setTimerPaused(true);
    setPhase("result");
    const timeTaken = Math.round((Date.now() - examStartTime) / 1000);
    try {
      const res = await submitMutation.mutateAsync({
        courseId,
        answers: finalAnswers,
        timeTakenSeconds: timeTaken,
      });
      setResult({
        passed: res.passed,
        scorePercent: res.scorePercent,
        correct: res.correct,
        total: res.total,
        certificate: res.certificate as { verificationCode: string } | null,
        nextAllowedAt: res.nextAllowedAt ? new Date(res.nextAllowedAt).toLocaleDateString("ar-SA", {
          year: "numeric", month: "long", day: "numeric"
        }) : null,
      });
      statusQuery.refetch();
    } catch (e) {
      console.error("Submit error:", e);
    }
  };

  // ── Start exam ─────────────────────────────────────────────────────────────
  const startExam = () => {
    setPhase("exam");
    setCurrentIdx(0);
    setAnswers({});
    setSelectedOption(null);
    setTimerPaused(false);
    setExamStartTime(Date.now());
  };

  // ── Loading / Auth ─────────────────────────────────────────────────────────
  if (authLoading || statusQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="mb-4">يجب تسجيل الدخول أولاً</p>
          <Button onClick={() => navigate("/")}>العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  // ── INTRO PHASE ────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">الامتحان الشامل</h1>
            <p className="text-slate-400 text-lg">{courseName}</p>
          </div>

          {/* Certificate already earned */}
          {hasCertificate && (
            <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-2xl p-6 mb-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-emerald-300 mb-2">لقد اجتزت هذا الامتحان بنجاح!</h2>
              <p className="text-slate-300 mb-4">يمكنك الاطلاع على شهادتك</p>
              <Button
                onClick={() => navigate(`/course-certificate/${courseId}`)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Award className="w-4 h-4 ml-2" />
                عرض الشهادة
              </Button>
            </div>
          )}

          {/* Locked */}
          {isLocked && !hasCertificate && (
            <div className="bg-red-900/40 border border-red-500/50 rounded-2xl p-6 mb-6 text-center">
              <Lock className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-red-300 mb-2">الامتحان مقفل مؤقتاً</h2>
              <p className="text-slate-300">
                لم تحقق نسبة النجاح المطلوبة (90%). يمكنك إعادة المحاولة في:
              </p>
              <p className="text-red-300 font-bold text-lg mt-2">
                {lockedUntil?.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          )}

          {/* Rules */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-blue-300">قواعد الامتحان</h2>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                <p>يتكون الامتحان من <strong className="text-white">100 سؤال</strong> متنوع بين اختيار من متعدد وصح/خطأ</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                <p>لكل سؤال <strong className="text-white">وقت محدد</strong> — عند انتهاء الوقت ينتقل تلقائياً للسؤال التالي</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                <p>نسبة النجاح المطلوبة: <strong className="text-emerald-400">90% أو أعلى</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                <p>في حالة الرسوب: <strong className="text-red-400">لا يمكن إعادة الامتحان إلا بعد أسبوع كامل</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</div>
                <p>عند النجاح: تُصدر <strong className="text-yellow-400">شهادة إتمام الكورس</strong> فوراً</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">6</div>
                <p>مستوى الأسئلة: <strong className="text-purple-400">متقدم وعالي المستوى</strong> — يتطلب فهماً عميقاً للمادة</p>
              </div>
            </div>
          </div>

          {/* Last attempt info */}
          {status?.lastAttempt && !hasCertificate && (
            <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-4 mb-6 text-sm text-slate-400">
              <p>آخر محاولة: نسبة {Number(status.lastAttempt.scorePercent).toFixed(1)}% — {status.lastAttempt.passed ? "ناجح ✓" : "راسب ✗"}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/courses`)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              العودة للكورسات
            </Button>
            {!isLocked && (
              <Button
                onClick={startExam}
                className="flex-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8"
              >
                <BookOpen className="w-4 h-4 ml-2" />
                {hasCertificate ? "إعادة الامتحان" : "بدء الامتحان"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── EXAM PHASE ─────────────────────────────────────────────────────────────
  if (phase === "exam") {
    if (questionsQuery.isLoading) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">جاري تحميل الأسئلة...</p>
          </div>
        </div>
      );
    }

    if (questionsQuery.error) {
      const msg = questionsQuery.error.message;
      if (msg.startsWith("LOCKED:")) {
        const lockDate = new Date(msg.replace("LOCKED:", ""));
        return (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
            <div className="text-center text-white max-w-md">
              <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">الامتحان مقفل</h2>
              <p className="text-slate-400 mb-2">يمكنك المحاولة مجدداً بعد:</p>
              <p className="text-red-400 font-bold text-xl">
                {lockDate.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <Button className="mt-6" onClick={() => navigate("/courses")}>العودة للكورسات</Button>
            </div>
          </div>
        );
      }
    }

    if (!currentQ) return null;

    const progress = ((currentIdx) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col" dir="rtl">
        {/* Top bar */}
        <div className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-400">
                السؤال <span className="text-white font-bold">{currentIdx + 1}</span> من <span className="text-white font-bold">{questions.length}</span>
              </span>
              <span className="text-sm text-slate-400">
                تمت الإجابة: <span className="text-emerald-400 font-bold">{answeredCount}</span>
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-700" />
          </div>
          <QuestionTimer
            limitSeconds={currentQ.timeLimitSeconds}
            onExpire={handleTimeExpire}
            paused={timerPaused}
            key={currentIdx}
          />
        </div>

        {/* Auto-advance message */}
        {autoAdvanceMsg && (
          <div className="bg-amber-900/80 border-b border-amber-600 px-4 py-2 text-center text-amber-300 text-sm font-medium">
            {autoAdvanceMsg}
          </div>
        )}

        {/* Question */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Question type badge */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs">
                {currentQ.questionType === "true_false" ? "صح أم خطأ" : "اختر الإجابة الصحيحة"}
              </Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
                مستوى متقدم
              </Badge>
            </div>

            {/* Question text */}
            <div className="bg-slate-800/80 border border-slate-600 rounded-2xl p-6 mb-6">
              <p className="text-xl font-semibold leading-relaxed text-white">
                {currentQ.questionText}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={timerPaused}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? "border-blue-500 bg-blue-900/40 text-white"
                        : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-400 hover:bg-slate-700/50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isSelected ? "border-blue-400 bg-blue-600 text-white" : "border-slate-500 text-slate-400"
                    }`}>
                      {["A", "B", "C", "D"][idx] ?? String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1">{option.text}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-slate-500 text-sm">
                {selectedOption ? "اضغط التالي للمتابعة" : "اختر إجابة للمتابعة"}
              </p>
              <Button
                onClick={handleNext}
                disabled={!selectedOption || timerPaused}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 px-6"
              >
                {currentIdx < questions.length - 1 ? (
                  <>التالي <ChevronLeft className="w-4 h-4 mr-1" /></>
                ) : (
                  <>إنهاء الامتحان <Send className="w-4 h-4 mr-1" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT PHASE ───────────────────────────────────────────────────────────
  if (phase === "result") {
    if (submitMutation.isPending || !result) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">جاري حساب النتيجة...</p>
          </div>
        </div>
      );
    }

    const { passed, scorePercent, correct, total, certificate, nextAllowedAt } = result;

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-lg w-full text-center">
          {/* Result icon */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${
            passed
              ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/40"
              : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40"
          }`}>
            {passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <XCircle className="w-12 h-12 text-white" />
            )}
          </div>

          <h1 className={`text-4xl font-bold mb-2 ${passed ? "text-emerald-400" : "text-red-400"}`}>
            {passed ? "مبروك! اجتزت الامتحان" : "لم تحقق نسبة النجاح"}
          </h1>

          {/* Score */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 my-6">
            <div className="text-6xl font-bold mb-2">
              <span className={passed ? "text-emerald-400" : "text-red-400"}>
                {scorePercent.toFixed(1)}%
              </span>
            </div>
            <p className="text-slate-400 mb-4">نسبة النجاح المطلوبة: 90%</p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{correct}</div>
                <div className="text-slate-500">إجابة صحيحة</div>
              </div>
              <div className="w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{total - correct}</div>
                <div className="text-slate-500">إجابة خاطئة</div>
              </div>
              <div className="w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{total}</div>
                <div className="text-slate-500">إجمالي الأسئلة</div>
              </div>
            </div>
          </div>

          {/* Certificate or lockout message */}
          {passed && certificate && (
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-yellow-300 font-semibold">تم إصدار شهادة إتمام الكورس!</p>
              <p className="text-slate-400 text-sm mt-1">رمز التحقق: {certificate.verificationCode}</p>
            </div>
          )}

          {!passed && nextAllowedAt && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-6">
              <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 font-semibold">تم قفل الامتحان لمدة أسبوع</p>
              <p className="text-slate-400 text-sm mt-1">يمكنك المحاولة مجدداً في: {nextAllowedAt}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {passed && certificate && (
              <Button
                onClick={() => navigate(`/course-certificate/${courseId}`)}
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold"
              >
                <Award className="w-4 h-4 ml-2" />
                عرض الشهادة
              </Button>
            )}
            <Button
              onClick={() => navigate(`/courses`)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              العودة للكورسات
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
