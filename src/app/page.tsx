import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Award, Gift, Users, ChevronRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <Gift className="h-8 w-8 text-primary" />,
    title: 'Lucky Wheel',
    description: 'Spin the wheel to win exciting prizes. Every spin is a new chance to get tickets, points, and more!',
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: 'Daily Raffle',
    description: 'Enter the daily raffle for a chance to win the grand prize. The more you play, the higher your chances.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Community',
    description: 'Join a thriving community of players. Compete on leaderboards and make new friends.',
  },
];

const faqs = [
  {
    question: 'What is Babylon Block?',
    answer: 'Babylon Block is an exciting new mobile game that combines strategy, skill, and a bit of luck. This portal is your gateway to extra features like the lucky wheel and daily raffles.',
  },
  {
    question: 'How do I get Tickets (TK) and Points (PT)?',
    answer: 'You can earn tickets and points by playing the Babylon Block mobile game, participating in promotions, and spinning the lucky wheel on this portal.',
  },
  {
    question: 'Is this platform secure?',
    answer: 'Yes, we use industry-standard security practices. Your account and data are managed by PlayFab, a secure backend platform by Microsoft Azure.',
  },
  {
    question: 'Can I win real money?',
    answer: 'No, Babylon Block uses virtual currencies (Tickets and Points) that can only be used within the game and this portal. They have no real-world monetary value.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 text-center">
            <div className="container mx-auto px-4">
                <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                    Welcome to the <span className="text-gradient">Babylon Block</span> Portal
                </h1>
                <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Your central hub for exclusive rewards, daily raffles, and the lucky wheel. Connect your game account and start winning!
                </p>
                <div className="mt-8 md:mt-10 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/register">
                            Get Started <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline">
                        Download Game
                    </Button>
                </div>
            </div>
        </section>

        {heroImage && (
          <section className="container mx-auto px-4 -mt-16">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Awesome Features</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                Discover all the amazing perks waiting for you in the Babylon Block Portal.
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
        <section id="faq" className="py-20 md:py-24 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                Got questions? We've got answers.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto mt-12">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-glass border-b-0 mb-2 rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 text-left font-semibold hover:no-underline">
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
