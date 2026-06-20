import React, { useState, useEffect } from 'react';
import { OnboardingStep } from './OnboardingStep';
import { Slider } from '../../components/common/Slider';
import { PhoneContainer } from '../../components/layout/PhoneContainer';
import type { Translations } from '../../i18n';

type ElementKey = 'fire' | 'water' | 'air' | 'earth';

const ELEMENT_COLORS: Record<ElementKey, string> = {
  fire: '230, 126, 34',
  water: '52, 152, 219',
  air: '189, 195, 199',
  earth: '39, 174, 96',
};

interface OnboardingWizardProps {
  locale: Translations;
  onReturnHome?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ locale }) => {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Record<ElementKey, number>>({
    fire: 50,
    water: 50,
    air: 50,
    earth: 50,
  });
  const [bgColor, setBgColor] = useState('rgba(255, 255, 255, 0.9)');

  useEffect(() => {
    if (step === 1) setBgColor('#f7f9fa');
    else if (step >= 2 && step <= 5) {
      const element = locale.steps[step - 2].key;
      updateBg(element, values[element]);
    } else if (step === 6) {
      setBgColor('#ebdef0');
    }
  }, [step, values, locale.steps]);

  const updateBg = (element: ElementKey, val: number) => {
    const intensity = Math.floor((val / 100) * 40);
    const alpha = intensity / 100;
    setBgColor(`rgba(${ELEMENT_COLORS[element]}, ${alpha})`);
  };

  const getElementText = (element: ElementKey, val: number) => {
    const stepData = locale.steps.find((item) => item.key === element);

    if (!stepData) return '';
    if (val > 75) return stepData.descriptions.high;
    if (val < 25) return stepData.descriptions.low;
    return stepData.descriptions.mid;
  };

  const calculateResult = () => {
    let maxDeviation = -1;
    let extremeElement: ElementKey = 'fire';
    let isHigh = true;

    (Object.keys(values) as ElementKey[]).forEach((key) => {
      const val = values[key];
      const deviation = Math.abs(val - 50);
      if (deviation > maxDeviation) {
        maxDeviation = deviation;
        extremeElement = key;
        isHigh = val >= 50;
      }
    });

    const elementResult = locale.results[extremeElement];

    return {
      text: isHigh ? elementResult.highText : elementResult.lowText,
      action: isHigh ? elementResult.highAction : elementResult.lowAction,
    };
  };

  const stepIndex = step - 2;
  const currentStep = locale.steps[stepIndex];

  return (
    <PhoneContainer backgroundColor={bgColor}>
      {step >= 2 && step <= 5 && (
        <div className="wizard-progress" aria-label={locale.progressLabel}>
          {[1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              className={`wizard-progress-segment ${step - 1 >= segment ? 'filled' : ''}`}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <OnboardingStep
          icon="🧘"
          title={locale.intro.title}
          description={locale.intro.description}
          onNext={() => setStep(2)}
          nextLabel={locale.buttons.start}
        />
      )}

      {step >= 2 && step <= 5 && currentStep && (
        <OnboardingStep
          icon={currentStep.icon}
          title={currentStep.title}
          description={getElementText(currentStep.key, values[currentStep.key])}
          onNext={() => setStep(step + 1)}
          nextLabel={step === 5 ? locale.buttons.calculate : locale.buttons.next}
          pulseIcon={currentStep.key === 'fire'}
        >
          <Slider
            value={values[currentStep.key]}
            onChange={(v) => setValues({ ...values, [currentStep.key]: v })}
            labelLeft={currentStep.labelStart}
            labelRight={currentStep.labelEnd}
          />
        </OnboardingStep>
      )}

      {step === 6 && (() => {
        const result = calculateResult();
        return (
          <OnboardingStep
            icon="💎"
            title={locale.result.heading}
            description=""
            onNext={() => {
              setValues({ fire: 50, water: 50, air: 50, earth: 50 });
              setStep(1);
            }}
            nextLabel={locale.buttons.reset}
          >
            <div className="output-box">
              <p>
                <strong>{locale.result.diagnosisLabel}</strong> {result.text}
              </p>
              <p>
                <strong>{locale.result.taskLabel}</strong> {result.action}
              </p>
            </div>
            <div className="token-alert">{locale.result.tokenAlert}</div>
          </OnboardingStep>
        );
      })()}
    </PhoneContainer>
  );
};

