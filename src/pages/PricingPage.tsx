
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = [
    {
      name: 'Free',
      description: 'Basic resume creation',
      price: { monthly: 0, annually: 0 },
      features: [
        'Create 1 resume',
        'Basic templates',
        'Download as PDF',
        'Limited customization',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline',
      popular: false,
    },
    {
      name: 'Premium',
      description: 'For serious job seekers',
      price: { monthly: 9.99, annually: 96 },
      features: [
        'Create unlimited resumes',
        'All premium templates',
        'Multiple download formats',
        'Cover letter builder',
        'AI content suggestions',
        'Priority support',
      ],
      buttonText: 'Subscribe',
      buttonVariant: 'default',
      popular: true,
    },
    {
      name: 'Team',
      description: 'For career coaches & teams',
      price: { monthly: 19.99, annually: 192 },
      features: [
        'Everything in Premium',
        'Team management',
        'Unlimited team members',
        'Analytics dashboard',
        'Custom branding',
        'Dedicated account manager',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      popular: false,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-resume-primary mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Select the perfect plan to help you create standout resumes and land your dream job
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Tabs
            value={billingCycle}
            onValueChange={setBillingCycle}
            className="w-full max-w-md"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-resume-primary data-[state=active]:text-white">
                Monthly Billing
              </TabsTrigger>
              <TabsTrigger value="annually" className="data-[state=active]:bg-resume-primary data-[state=active]:text-white">
                Annual Billing
                <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                  Save 20%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col h-full transition-all hover:-translate-y-1 hover:shadow-lg ${
                plan.popular
                  ? 'shadow-md border-resume-primary'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-resume-primary text-white py-1 px-3 text-sm font-semibold text-center">
                  MOST POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${billingCycle === 'monthly'
                      ? plan.price.monthly
                      : (plan.price.annually / 12).toFixed(2)
                    }
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                {billingCycle === 'annually' && plan.price.annually > 0 && (
                  <div className="text-sm text-gray-500">
                    Billed as ${plan.price.annually} annually
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to={plan.name === 'Free' ? '/signup' : '/contact'}>
                  <Button
                    className={`w-full ${
                      plan.buttonVariant === 'default'
                        ? 'bg-resume-primary hover:bg-resume-primary/90'
                        : ''
                    }`}
                    variant={plan.buttonVariant as 'outline' | 'default'}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-resume-primary mb-6">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {[
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes to your subscription will take effect at the end of your current billing cycle."
              },
              {
                question: "Is there a free trial?",
                answer: "We offer a 14-day free trial on our Premium plan so you can experience all the features before committing."
              },
              {
                question: "Can I cancel my subscription?",
                answer: "You can cancel your subscription at any time. If you cancel, you'll have access to premium features until the end of your current billing period."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and Apple Pay. All payments are securely processed."
              }
            ].map((faq, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="text-lg font-semibold mb-1">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-3">Need a custom solution?</h3>
            <p className="text-gray-600 mb-6">
              If you have specific requirements, we can create a tailored solution for you or your business.
            </p>
            <Link to="/contact">
              <Button className="bg-resume-primary hover:bg-resume-primary/90">
                Contact Our Sales Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
