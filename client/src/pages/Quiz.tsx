import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { BookOpen, ArrowLeft, CheckCircle2, XCircle, Award } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useMemo } from "react";
import { toast } from "sonner";

// Shuffle function to randomize answer order
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
  const submitQuiz = trpc.quiz.submitQuiz.useMutation();

  // Prepare current question data
  const currentQuestion = questions?.[currentQuestionIndex];
  const options = currentQuestion ? (
    typeof currentQuestion.optionsJson === 'string'
      ? JSON.parse(currentQuestion.optionsJson)
      : currentQuestion.optionsJson as Array<{ id: string; textAr: string; textEn?: string }>
  ) : [];

  // Shuffle options once per question using useMemo
  const shuffledOptions = useMemo(() => {
    return options ? shuffleArray(options) : [];
  }, [currentQuestion?.id]);

  if (authLoading || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No questions available for this module</p>
          <Link href={`/module/${moduleId}`}>
            <Button className="mt-4">Back to Module</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  const handleAnswerSubmit = () => {
    if (!selectedOption || !currentQuestion) {
      toast.error("Please select an answer");
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
      const result = await submitQuiz.mutateAsync({
        moduleId,
        answers,
      });
      setQuizResult(result);
      setQuizCompleted(true);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      toast.error("An error occurred while submitting the quiz");
    }
  };

  if (quizCompleted && quizResult) {
    const passed = quizResult.percentage >= 70;

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-4 cursor-pointer">
                <img src="/almog-logo.gif" alt="ALMOG" className="h-16" />
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">EPF Course Platform</h1>
                </div>
              </div>
            </Link>
          </div>
        </header>

        <main className="container py-16 max-w-2xl">
          <Card className={`text-center ${passed ? 'border-green-500' : 'border-yellow-500'}`}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                {passed ? (
                  <Award className="h-20 w-20 text-green-600" />
                ) : (
                  <CheckCircle2 className="h-20 w-20 text-yellow-600" />
                )}
              </div>
              <CardTitle className="text-3xl">
                {passed ? "Congratulations! You Passed!" : "Quiz Completed"}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {module?.titleEn || module?.titleAr}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">{quizResult.score}</div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{quizResult.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{quizResult.percentage}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              </div>

              {passed && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">
                    Well done! You achieved the passing score (70% or above). You can now get your certificate.
                  </p>
                </div>
              )}

              {!passed && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    You did not reach the required passing score (70%). We recommend reviewing the lessons and trying again.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Link href={`/module/${moduleId}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Back to Module
                  </Button>
                </Link>
                {passed && (
                  <Link href={`/certificate/${moduleId}`} className="flex-1">
                    <Button className="w-full">
                      <Award className="mr-2 h-4 w-4" />
                      Get Certificate
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

  // Get display text - prefer English, fallback to Arabic
  const questionText = (currentQuestion as any)?.questionTextEn || currentQuestion?.questionTextAr;
  const explanationText = (currentQuestion as any)?.explanationEn || (currentQuestion as any)?.explanationAr;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer">
              <img src="/almog-logo.gif" alt="ALMOG" className="h-16" />
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">EPF Course Platform</h1>
              </div>
            </div>
          </Link>
          <Link href={`/module/${moduleId}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Module
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">{module?.titleEn || module?.titleAr}</h2>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed" dir="ltr">
              {questionText?.replace(/\*\*(.*?)\*\*/g, '$1')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Options */}
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption} disabled={showExplanation}>
              <div className="space-y-3">
                {(shuffledOptions as Array<{ id: string; textAr: string; textEn?: string }>)?.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      showExplanation
                        ? option.id === currentQuestion?.correctOptionId
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : option.id === selectedOption
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-border"
                        : selectedOption === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="flex-shrink-0" />
                    <Label htmlFor={option.id} className="cursor-pointer text-base leading-relaxed flex-1">
                      {option.textEn || option.textAr}
                    </Label>
                    {showExplanation && option.id === currentQuestion?.correctOptionId && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                    {showExplanation && option.id === selectedOption && option.id !== currentQuestion?.correctOptionId && (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Explanation */}
            {showExplanation && explanationText && (
              <div className={`p-4 rounded-lg ${
                currentAnswer?.correct
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  {currentAnswer?.correct ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 dark:text-green-200">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="text-red-800 dark:text-red-200">Incorrect</span>
                    </>
                  )}
                </h4>
                <p className="text-sm leading-relaxed">{explanationText}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              {!showExplanation ? (
                <Button onClick={handleAnswerSubmit} className="flex-1" disabled={!selectedOption}>
                  Check Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="flex-1">
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
