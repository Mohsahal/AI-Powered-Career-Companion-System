import { Headings } from "@/components/MockInterview/Headings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { Mic, Sparkles, Star, MessageCircle, ShieldCheck, Timer, Rocket, } from "lucide-react";
import { Link } from "react-router-dom";
const Feature = ({ icon: Icon, title, desc, }) => (<Card className="shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Icon className="h-5 w-5"/>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
    </CardContent>
  </Card>);
const Step = ({ num, title, desc, }) => (<div className="flex items-start gap-4">
    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
      {num}
    </div>
    <div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  </div>);
const AboutMockPage = () => {
    return (<div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Master interviews with AI guidance
            </h1>
            <p className="mt-3 text-gray-700">
              Generate role‑specific questions, record your responses, and get instant
              structured feedback with ratings and improvement tips.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link to="/generate/create">
                <Button>Start a mock interview</Button>
              </Link>
              <Link to="/generate/practice">
                <Button variant="outline">Go to practice</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 space-y-12">
        {/* Features */}
        <section>
          <Headings title="Why use MockInterview?" isSubHeading/>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            <Feature icon={Sparkles} title="AI‑generated questions" desc="Create a tailored question bank based on role, experience, and tech stack."/>
            <Feature icon={Mic} title="Voice recording" desc="Answer verbally with built‑in speech‑to‑text and optional webcam preview."/>
            <Feature icon={Star} title="Actionable feedback" desc="Receive ratings, strengths, and targeted suggestions to improve quickly."/>
            <Feature icon={MessageCircle} title="Answer comparisons" desc="Compare your response with an ideal answer to identify gaps."/>
            <Feature icon={Timer} title="Efficient practice" desc="Short, focused sessions help you build confidence without burnout."/>
            <Feature icon={ShieldCheck} title="Secure by design" desc="Your session data stays private and under your control."/>
          </div>
        </section>

        <Separator />

        {/* How it works */}
        <section>
          <Headings title="How it works" isSubHeading/>
          <div className="grid gap-6 md:grid-cols-2 mt-4">
            <div className="space-y-5">
              <Step num={1} title="Create an interview" desc="Enter the role, description, experience, and tech stack. We’ll generate relevant questions."/>
              <Step num={2} title="Record your answers" desc="Use the mic (and optional webcam) to answer. Re‑record if needed until satisfied."/>
              <Step num={3} title="Review feedback" desc="Get a score per question, read the suggested improvements, and compare with the expected answer."/>
              <Step num={4} title="Improve and repeat" desc="Track progress across sessions and focus on weak areas to level up fast."/>
            </div>
            <Card className="p-6 flex items-center justify-center">
              <div className="text-center">
                <Rocket className="h-10 w-10 text-indigo-600 mx-auto"/>
                <p className="mt-3 text-sm text-gray-600">
                  Tip: practice 15–20 minutes daily for the best improvement curve.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FAQ */}
        <section>
          <Headings title="Frequently asked questions" isSubHeading/>
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="q1">
              <AccordionTrigger>Do you store my recordings?</AccordionTrigger>
              <AccordionContent>
                We only process your answers to generate feedback. Video isn't stored; text answers are associated with your account
                so you can review progress and feedback history.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can I retry a question?</AccordionTrigger>
              <AccordionContent>
                Yes. You can re‑record answers before saving. Saved attempts are de‑duplicated per question to avoid clutter.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Which roles are supported?</AccordionTrigger>
              <AccordionContent>
                Any role you define. Provide the position, stack, and experience range—questions adapt automatically.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="inline-flex flex-wrap gap-3 items-center justify-center">
            <Link to="/generate/create">
              <Button size="lg">Create an interview</Button>
            </Link>
            <Link to="/generate/practice">
              <Button size="lg" variant="outline">
                Go to practice
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>);
};
export default AboutMockPage;
