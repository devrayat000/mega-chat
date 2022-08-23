import { useCallback, useState } from "react";

export default function useStepper(length: number, initialStep = 0) {
  const [active, setActive] = useState(initialStep);

  const nextStep = useCallback(() => {
    setActive((current) => (current < length ? current + 1 : current));
  }, [length]);
  const prevStep = useCallback(() => {
    setActive((current) => (current > 0 ? current - 1 : current));
  }, []);

  return {
    step: active,
    nextStep,
    prevStep,
    onStepChange: setActive,
  };
}
