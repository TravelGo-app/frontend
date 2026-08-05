import type { CSSProperties } from "react";

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
  const style = {
    "--tg-operation-accent": accentColor,
  } as CSSProperties;

  return (
    <div
      className="tg-operation-steps"
      style={style}
      aria-label="Progreso de la operación"
    >
      {steps.map((label, index) => {
        const isCompleted =
          index < currentStep;

        const isCurrent =
          index === currentStep;

        return (
          <div
            key={label}
            className={[
              "tg-operation-step",
              isCompleted
                ? "is-completed"
                : "",
              isCurrent
                ? "is-current"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="tg-operation-stepline" />

            <div className="tg-operation-stepcircle">
              {isCompleted ? "✓" : index + 1}
            </div>

            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}