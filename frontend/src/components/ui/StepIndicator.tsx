import { Check } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
    steps: string[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
    return (
        <div className="flex items-center justify-center w-full max-w-sm mx-auto mb-12">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <div key={step} className="flex-1 flex flex-col items-center relative">
                        {/* ProgressBar Line (except last item) */}
                        {index < steps.length - 1 && (
                            <div
                                className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${isCompleted ? 'bg-primary' : 'bg-muted'
                                    }`}
                            />
                        )}

                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-2 transition-colors duration-300 ${isActive
                                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                                    : isCompleted
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                        >
                            {isCompleted ? <Check size={14} /> : stepNumber}
                        </div>

                        <span
                            className={`text-xs font-medium tracking-wide ${isActive ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            {step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
