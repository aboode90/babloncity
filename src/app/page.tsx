import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Award, Gift, Users, HeartHandshake, ChevronLeft } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: 'السحب اليومي',
    description: 'ادخل السحب اليومي للحصول على فرصة الفوز بالجائزة الكبرى. كلما لعبت أكثر، زادت فرصك.',
  },
  {
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    title: 'برنامج الإحالة',
    description: 'ادعُ أصدقاءك واكسب نسبة  من تذاكرهم . تصل أرباحك إلى 15%!',
  },
];

const faqs = [
  {
    question: 'ما هي بابلون بلوك؟',
    answer: 'بابلون بلوك هي لعبة محمولة جديدة ومثيرة تجمع بين الاستراتيجية والمهارة وقليل من الحظ. هذه البوابة هي طريقك إلى ميزات إضافية مثل السحوبات اليومية.',
  },
  {
    question: 'كيف أحصل على التذاكر (TK)؟',
    answer: 'يمكنك كسب التذاكر من خلال لعب لعبة بابلون بلوك على الهاتف المحمول، والمشاركة في العروض الترويجية.',
  },
  {
    question: 'كيف يعمل برنامج الإحالة؟',
    answer: 'عندما تقوم بدعوة أصدقائك إلى بابلون بلوك، فإنك تكسب نسبة مئوية من التذاكر التي يربحونها. كلما زاد عدد اللاعبين الذين تدعوهم، زادت النسبة التي تحصل عليها. تبدأ من 1% وتصل إلى 15%.'
  },
  {
    question: 'ما هي مستويات الربح من الإحالة؟',
    answer: 'تعتمد نسبة الربح على عدد المستخدمين الذين قمت بإحالتهم: 2 مستخدمين (1%)، 5 مستخدمين (2%)، 10 مستخدمين (5%)، 25 مستخدمًا (7%)، 50 مستخدمًا (10%)، و100 مستخدم أو أكثر (15%).'
  }
];

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 text-center">
            <div className="container mx-auto px-4">
                <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                    مرحباً بك في بوابة <span className="text-gradient">بابلون بلوك</span>
                </h1>
                <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                    مركزك الحصري للمكافآت، والسحوبات اليومية. اربط حساب لعبتك وابدأ بالفوز!
                </p>
                <div className="mt-8 md:mt-10 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/register">
                            ابدأ الآن <ChevronLeft className="mr-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline">
                        تحميل اللعبة
                    </Button>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">ميزات رائعة</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                اكتشف كل المزايا المدهشة التي تنتظرك في بوابة بابلون بلوك.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-glass text-center shadow-lg">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-headline font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">الأسئلة الشائعة</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                لديك أسئلة؟ لدينا الإجابات.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto mt-12 text-right">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-glass border-b-0 mb-2 rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 text-right font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
