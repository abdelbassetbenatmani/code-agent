"use client";
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';

const items = [
  {
    id: '1',
    title: 'What makes AI Code Agent different?',
    content:
      'AI Code Agent is an intelligent coding assistant built with advanced machine learning models that understand your unique coding style and project context. Unlike generic code suggestions, our AI provides personalized, context-aware recommendations that truly enhance your development workflow and help you write better code faster.',
  },
  {
    id: '2',
    title: 'How does the AI learn my coding patterns?',
    content:
      'Our AI analyzes your code patterns, formatting preferences, and common solutions you implement. Over time, it builds a personalized profile to deliver suggestions that match your approach to development, becoming more accurate and helpful with each use.',
  },
  {
    id: '3',
    title: 'Is my code secure when using AI Code Agent?',
    content:
      "Security is our top priority. Your code never leaves your environment without your explicit permission. All analysis happens locally when possible, and any cloud processing uses enterprise-grade encryption and anonymization techniques to ensure your intellectual property remains protected.",
  },
  {
    id: '4',
    title: 'Do you offer team or enterprise solutions?',
    content:
      'Yes, we offer team and enterprise plans with advanced features like shared learning profiles, organization-wide code standards enforcement, and dedicated support. Our enterprise solutions can be customized to meet your specific team size and requirements.',
  },
  {
    id: '5',
    title: 'How do I get started with AI Code Agent?',
    content:
      "Getting started is simple - install our extension in your preferred IDE, authorize the application, and start coding. The AI begins learning immediately and will provide suggestions within minutes. Our comprehensive documentation provides detailed setup instructions and tips for maximizing productivity.",
  },
];

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
      duration: 0.4,
    },
  }),
};

export default function Faq1() {
  return (
    <section id='faq' className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to know about MVPBlocks and how to use our
            components to build your next project quickly.
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Decorative gradient */}
          <div className="absolute -left-4 -top-4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-4 -right-4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          <Accordion
            type="single"
            collapsible
            className="w-full rounded-xl border border-border/40 bg-card/30 p-2 backdrop-blur-sm"
            defaultValue="1"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={item.id}
                  className={cn(
                    'my-1 overflow-hidden rounded-lg border-none bg-card/50 px-2 shadow-sm transition-all',
                    'data-[state=open]:bg-card/80 data-[state=open]:shadow-md',
                  )}
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      className={cn(
                        'group flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-medium',
                        'outline-none transition-all duration-300 hover:text-primary',
                        'focus-visible:ring-2 focus-visible:ring-primary/50',
                        'data-[state=open]:text-primary',
                      )}
                    >
                      {item.title}
                      <PlusIcon
                        size={18}
                        className={cn(
                          'shrink-0 text-primary/70 transition-transform duration-300 ease-out',
                          'group-data-[state=open]:rotate-45',
                        )}
                        aria-hidden="true"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    className={cn(
                      'overflow-hidden pb-4 pt-0 text-muted-foreground',
                      'data-[state=open]:animate-accordion-down',
                      'data-[state=closed]:animate-accordion-up',
                    )}
                  >
                    <div className="border-t border-border/30 pt-3">
                      {item.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
