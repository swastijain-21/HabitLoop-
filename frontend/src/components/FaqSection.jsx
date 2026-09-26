import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How is HabitLoop different from traditional daily habit trackers?',
      a: 'Traditional habit trackers force rigid daily streaks that punish you when life gets busy. HabitLoop uses a 7-day feedback loop (Check-in → Track → Evaluate → Adapt). You get a weekly score instead of binary daily pass/fail rules, keeping you motivated even through exam weeks.'
    },
    {
      q: 'What happens if I miss a habit for a day or two?',
      a: 'Nothing breaks! HabitLoop features a built-in Streak Recovery Shield. Our algorithm evaluates your total 7-day trend rather than resetting your streak to zero. Missing one workout won’t ruin your 6-week loop progress.'
    },
    {
      q: 'Is HabitLoop really free for students?',
      a: 'Yes! Our Student Free plan is 100% free forever. It includes core 7-day weekly loops, 5 habit trackers, basic weekly scores, and access to 1 squad.'
    },
    {
      q: 'How does the AI Weekly Evaluation work?',
      a: 'Every Sunday, our AI engine analyzes your 7-day data across sleep, hydration, focus, movement, and stress levels. It identifies hidden patterns—like how poor sleep impacts study focus—and gives you 3 actionable micro-adjustments for next week.'
    },
    {
      q: 'Can I sync HabitLoop with Apple Health or Google Fit?',
      a: 'Yes! HabitLoop Pro automatically syncs sleep hours, active minutes, and step counts from Apple Health, Google Fit, Garmin, and Notion study planners so you don’t have to log everything manually.'
    },
    {
      q: 'How do Campus Squad Loops work?',
      a: 'Squads allow you to invite friends, roommates, or classmates to share weekly loop scores. You can compare progress on private leaderboards and send high-fives and encouragement.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="section-tag tag-green">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2>Frequently Asked Questions</h2>
          <p className="text-slate-600 mt-2 text-lg">
            Everything you need to know about starting your weekly wellness loop with HabitLoop.
          </p>
        </div>

        {/* Accordion */}
        <div className="faq-accordion">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="faq-item">
                <button 
                  className="faq-header"
                  onClick={() => toggleFaq(idx)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="faq-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
