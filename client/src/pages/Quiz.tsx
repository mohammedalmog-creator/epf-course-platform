import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  BookOpen, ArrowLeft, CheckCircle2, XCircle, Award, Target,
  RotateCcw, ChevronRight, HelpCircle, Timer
} from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useMemo } from "react";
import { toast } from "sonner";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface Answer {
  questionId: number;
  selectedOptionId: string;
  correct: boolean;
}

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const moduleId = parseInt(id || "0");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; totalQuestions: number; percentage: number } | null>(null);

  const { data: module } = trpc.course.getModule.useQuery({ moduleId });
  const { data: questions, isLoading: questionsLoading } = trpc.course.getQuizQuestions.useQuery({ moduleId });
  const { data: quizAttempts } = trpc.quiz.getUserAttempts.useQuery({ moduleId }, { enabled: isAuthenticated });
  const submitQuiz = trpc.quiz.submitQuiz.useMutation();

  const currentQuestion = questions?.[currentQuestionIndex];
  const options = currentQuestion
    ? (typeof currentQuestion.optionsJson === 'string'
        ? JSON.parse(currentQuestion.optionsJson)
        : currentQuestion.optionsJson as Array<{ id: string; textAr: string; textEn?: string }>)
    : [];

  const shuffledOptions = useMemo(() => shuffleArray(options), [currentQuestion?.id]);

  if (authLoading || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الاختبار...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto" />
          <p className="text-lg text-muted-foreground">لا توجد أسئلة لهذه الوحدة</p>
          <Link href={`/module/${moduleId}`}>
            <Button>العودة إلى الوحدة</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);
  const previousAttempts = quizAttempts?.length || 0;

  const handleAnswerSubmit = () => {
    if (!selectedOption || !currentQuestion) {
      toast.error("الرجاء اختيار إجابة");
      return;
    }
    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      correct: isCorrect,
    };
    setAnswers(prev => [...prev.filter(a => a.questionId !== currentQuestion.id), newAnswer]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption("");
      setShowExplanation(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    try {
      const result = await submitQuiz.mutateAsync({ moduleId, answers });
      setQuizResult(result);
      setQuizCompleted(true);
    } catch {
      toast.error("حدث خطأ أثناء إرسال الاختبار");
    }
  };

  // ── Results Screen ──────────────────────────────────────────────────────────
  if (quizCompleted && quizResult) {
    const passed = quizResult.percentage >= 70;
    const thisAttemptNumber = previousAttempts + 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="container flex h-24 items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png" alt="ALMOG" className="h-36" />
                <div className="hidden sm:block">
                  <p className="text-xs text-muted-foreground leading-none">شركة المُق للخدمات النفطية</p>
                  <p className="text-sm font-bold leading-tight">منصة التدريب التقني</p>
                </div>
              </div>
            </Link>
          </div>
        </header>

        <main className="container py-12 max-w-2xl">
          <Card className={`shadow-xl ${passed ? 'border-green-400' : 'border-yellow-400'}`}>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`rounded-full p-6 ${passed ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {passed
                    ? <Award className="h-16 w-16 text-green-600" />
                    : <Target className="h-16 w-16 text-yellow-600" />
                  }
                </div>
              </div>
              <CardTitle className="text-2xl">
                {passed ? "أحسنت! لقد اجتزت الاختبار" : "انتهى الاختبار"}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {module?.titleAr}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-primary">{quizResult.score}</div>
                  <div className="text-xs text-muted-foreground mt-1">إجابات صحيحة</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="text-3xl font-bold">{quizResult.totalQuestions}</div>
                  <div className="text-xs text-muted-foreground mt-1">مجموع الأسئلة</div>
                </div>
                <div className={`rounded-xl p-4 ${passed ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <div className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
                    {quizResult.percentage}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">النتيجة</div>
                </div>
              </div>

              {/* Attempt info */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <RotateCcw className="h-4 w-4" />
                <span>المحاولة رقم {thisAttemptNumber}</span>
                {previousAttempts > 0 && (
                  <span className="text-xs">(من أصل {thisAttemptNumber} محاولة)</span>
                )}
              </div>

              {/* Result message */}
              {passed ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-green-800 font-medium">
                    ممتاز! حققت النسبة المطلوبة (70% أو أكثر). يمكنك الآن الحصول على شهادتك.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <p className="text-yellow-800">
                    لم تصل إلى النسبة المطلوبة (70%). ننصحك بمراجعة الدروس والمحاولة مرة أخرى.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/module/${moduleId}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    العودة إلى الوحدة
                  </Button>
                </Link>
                {!passed && (
                  <Button
                    onClick={() => {
                      setQuizCompleted(false);
                      setQuizResult(null);
                      setAnswers([]);
                      setCurrentQuestionIndex(0);
                      setSelectedOption("");
                      setShowExplanation(false);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="ml-2 h-4 w-4" />
                    إعادة الاختبار
                  </Button>
                )}
                {passed && (
                  <Link href={`/certificate/${moduleId}`} className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <Award className="ml-2 h-4 w-4" />
                      الحصول على الشهادة
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // ── Quiz Screen ──────────────────────────────────────────────────────────────
  const questionText = (currentQuestion as any)?.questionTextEn || currentQuestion?.questionTextAr;
  const explanationText = (currentQuestion as any)?.explanationEn || (currentQuestion as any)?.explanationAr;
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-24 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FVrEGXBKGaDlsHpx.png" alt="ALMOG" className="h-36" />
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground leading-none">شركة المُق للخدمات النفطية</p>
                <p className="text-sm font-bold leading-tight">منصة التدريب التقني</p>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {previousAttempts > 0 && (
              <Badge variant="outline" className="text-xs hidden sm:flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                المحاولة {previousAttempts + 1}
              </Badge>
            )}
            <Link href={`/module/${moduleId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="ml-1 h-4 w-4" />
                <span className="hidden sm:inline">الوحدة</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        {/* Quiz header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold">{module?.titleAr}</h2>
              <p className="text-sm text-muted-foreground">اختبار الوحدة</p>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-primary">{currentQuestionIndex + 1}<span className="text-muted-foreground text-base">/{questions.length}</span></div>
              <div className="text-xs text-muted-foreground">سؤال</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Answer dots */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {questions.map((_, idx) => {
              const ans = answers.find(a => a.questionId === questions[idx]?.id);
              return (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    idx === currentQuestionIndex
                      ? 'bg-primary scale-125'
                      : ans
                        ? ans.correct ? 'bg-green-500' : 'bg-red-400'
                        : 'bg-muted'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-primary/10 text-primary rounded-lg w-8 h-8 flex items-center justify-center font-bold text-sm">
                {currentQuestionIndex + 1}
              </div>
              <CardTitle className="text-lg leading-relaxed flex-1" dir="ltr">
                {questionText?.replace(/\*\*(.*?)\*\*/g, '$1')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Options */}
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption} disabled={showExplanation}>
              <div className="space-y-2.5">
                {(shuffledOptions as Array<{ id: string; textAr: string; textEn?: string }>)?.map((option) => {
                  const isCorrect = option.id === currentQuestion?.correctOptionId;
                  const isSelected = option.id === selectedOption;
                  return (
                    <div
                      key={option.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        showExplanation
                          ? isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : isSelected
                              ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                              : "border-border opacity-60"
                          : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                      }`}
                      onClick={() => !showExplanation && setSelectedOption(option.id)}
                    >
                      <RadioGroupItem value={option.id} id={option.id} className="flex-shrink-0" />
                      <Label htmlFor={option.id} className="cursor-pointer text-base leading-relaxed flex-1">
                        {option.textEn || option.textAr}
                      </Label>
                      {showExplanation && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
                      {showExplanation && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {/* Explanation */}
            {showExplanation && explanationText && (
              <div className={`p-4 rounded-xl border ${
                currentAnswer?.correct
                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                  : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              }`}>
                <div className="flex items-center gap-2 mb-2 font-semibold">
                  {currentAnswer?.correct ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 dark:text-green-200">إجابة صحيحة!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-800 dark:text-red-200">إجابة خاطئة</span>
                    </>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{explanationText}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {!showExplanation ? (
                <Button
                  onClick={handleAnswerSubmit}
                  className="flex-1"
                  disabled={!selectedOption}
                >
                  تحقق من الإجابة
                  <ChevronRight className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="flex-1"
                  disabled={submitQuiz.isPending}
                >
                  {submitQuiz.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                  ) : null}
                  {currentQuestionIndex < questions.length - 1 ? 'السؤال التالي' : 'إنهاء الاختبار'}
                  <ChevronRight className="mr-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
