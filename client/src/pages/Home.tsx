import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { BookOpen, Award, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">منصة دورة EPF</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <Link href="/modules">
                <Button>الدخول إلى الدورة</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button>تسجيل الدخول</Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            دورة منشآت الإنتاج المبكر
            <span className="block text-primary mt-2">Early Production Facilities</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            دورة تعليمية شاملة ومتكاملة لتعلم كل جوانب منشآت الإنتاج المبكر في صناعة النفط والغاز، 
            من الأساسيات إلى الاحترافية، مع مشاريع عملية واختبارات تكيفية وشهادات معتمدة.
          </p>
          {isAuthenticated ? (
            <Link href="/modules">
              <Button size="lg" className="text-lg px-8">
                ابدأ التعلم الآن
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="text-lg px-8">
                ابدأ التعلم الآن
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 bg-muted/50">
        <div className="mx-auto max-w-5xl">
          <h3 className="text-3xl font-bold text-center mb-12">مميزات الدورة</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>9 وحدات تعليمية</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  محتوى شامل يغطي جميع جوانب منشآت الإنتاج المبكر من الأساسيات إلى التصميم والتشغيل
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>تعلم تكيفي</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  اختبارات ذكية تتكيف مع مستواك وتوفر شروحات فورية لتعزيز الفهم
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-2" />
                <CardTitle>شهادات معتمدة</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  احصل على شهادة PDF قابلة للتنزيل عند إكمال كل وحدة تعليمية
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>مشروع تخرج</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  طبّق ما تعلمته في مشروع تخرج شامل لتصميم منشأة EPF كاملة
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Outline */}
      <section className="container py-16">
        <div className="mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-center mb-12">محتوى الدورة</h3>
          <div className="space-y-4">
            {[
              { title: "مقدمة في صناعة النفط والغاز ودور الـ EPF", duration: "1 أسبوع" },
              { title: "فصل السوائل الثلاثي (Three-Phase Separation)", duration: "1 أسبوع" },
              { title: "أنظمة معالجة النفط الخام", duration: "1 أسبوع" },
              { title: "معالجة الغاز الطبيعي والمياه المنتجة", duration: "1 أسبوع" },
              { title: "أنظمة التدفئة والتبريد والضغط", duration: "1 أسبوع" },
              { title: "التخزين، القياس، والسلامة", duration: "1 أسبوع" },
              { title: "التصميم الأولي والحسابات الهندسية", duration: "2 أسابيع" },
              { title: "مشروع التخرج", duration: "3 أسابيع" },
              { title: "التشغيل والصيانة", duration: "1 أسبوع" },
            ].map((module, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">الوحدة {index + 1}: {module.title}</CardTitle>
                    <CardDescription className="mt-1">المدة: {module.duration}</CardDescription>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 bg-primary/5">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-3xl font-bold mb-4">هل أنت جاهز لتصبح محترفاً في EPF؟</h3>
          <p className="text-lg text-muted-foreground mb-8">
            ابدأ رحلتك التعليمية الآن واحصل على المعرفة والمهارات اللازمة لتصميم وتشغيل منشآت الإنتاج المبكر
          </p>
          {isAuthenticated ? (
            <Link href="/modules">
              <Button size="lg" className="text-lg px-8">
                الدخول إلى الدورة
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="text-lg px-8">
                سجل الآن مجاناً
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 منصة دورة منشآت الإنتاج المبكر. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
