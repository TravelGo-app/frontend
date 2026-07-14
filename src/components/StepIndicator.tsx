interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  accentColor: string;
}

export default function StepIndicator({
  steps,
  currentStep,
  accentColor,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center mt-6 px-1">
      {steps.map((label, index) => {
        const isActive = index <= currentStep;
        return (
          <div
            key={label}
            className={`flex items-center ${
              index < steps.length - 1 ? "flex-1" : ""
            }`}
          >
            <div className="flex flex-col items-center shrink-0">
              <div
                className="w-3 h-3 rounded-full transition-colors"
                style={{
                  backgroundColor: isActive ? accentColor : "#d1d5db",
                }}
              ></div>
              <span
                className="text-[10px] mt-1 text-center w-16 font-semibold leading-tight"
                style={{ color: isActive ? accentColor : "#9ca3af" }}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-1 mb-4 transition-colors"
                style={{
                  backgroundColor:
                    index < currentStep ? accentColor : "#e5e7eb",
                }}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}