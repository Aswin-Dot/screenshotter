import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { number: 1, label: 'Upload' },
  { number: 2, label: 'Customize' },
  { number: 3, label: 'Captions' },
  { number: 4, label: 'Export' },
];

export default function StepIndicator({ currentStep, completedSteps }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.number);
        const isCurrent = currentStep === step.number;

        return (
          <React.Fragment key={step.number}>
            {index > 0 && (
              <div
                className={`h-px w-8 ${
                  isCompleted ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary/20 text-primary border border-primary'
                    : 'bg-surface text-muted border border-border'
                }`}
              >
                {isCompleted ? <Check size={14} /> : step.number}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  isCurrent ? 'text-white' : 'text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
