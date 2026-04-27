"use client"
import Navbars from "./Navbars";
import {BackgroundGradientAnimation} from "./background-gradient-animation";
import {TracingBeam} from "./tracing-beam";
import { TypewriterEffectSmooth } from "./typewriter-effect";
import { Card, Input, Select, SelectItem, Slider, RadioGroup, Radio, Button } from "@nextui-org/react";
import { useState, useCallback } from "react";
import { useRouter } from 'next/navigation';

const initialFormData = {
  sleepHours: '',
  wakingFreshness: 5,
  energyLevels: 5,
  stressFrequency: '',
  screenTime: '',
  relaxTime: '',
  workLifeBalance: 5,
  mealsPerDay: '',
  mealQuality: '',
  hydrationFrequency: '',
  caffeineFrequency: '',
  sugarFrequency: '',
  fruitVegServings: '',
  supplements: '',
  exerciseFrequency: '',
  exerciseIntensity: '',
  sittingHours: '',
  stretchingRoutine: '',
  strengthFlexibility: 5,
  mindfulnessFrequency: '',
  focusAbility: 5,
  calmFrequency: '',
  stressManagement: '',
  emotionalResilience: 5,
  socialTime: '',
  supportNetwork: '',
  communityConnection: 5,
  purposeActivities: '',
  socialComfort: 5,
  selfCareFrequency: '',
  selfDiscipline: 5,
  reflectGoals: '',
  personalGrowthSatisfaction: 5,
  wellnessGoal: ''
};
export default function Home() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


const handleSliderChange = useCallback((name, value) => {
  setFormData(prev => ({ ...prev, [name]: Number(value) }));
}, []);

const handleSelectChange = useCallback((name, value) => {
  setFormData(prev => ({ ...prev, [name]: value }));
}, []);

const handleRadioChange = useCallback((name, value) => {
  setFormData(prev => ({ ...prev, [name]: value.target.value }));
}, []);

const handleInputChange = useCallback((name, event) => {
  const value = event.target.value;
  setFormData(prev => ({ ...prev, [name]: value }));
}, []);
  
// details/page.js

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Sanitize form data to remove circular references
    const sanitizedData = Object.keys(formData).reduce((acc, key) => {
      // Handle select/option elements specifically
      if (formData[key] && formData[key].target) {
        acc[key] = formData[key].target.value;
      } else {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    const response = await fetch('/api/user/save-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedData)
    });

    const data = await response.json();

    if (data.success) {
      router.push('/dashboard');
    } else {
      console.error('Assessment save failed:', data.error);
    }
  } catch (error) {
    console.error('Submit error:', error.message || 'Failed to submit assessment');
  } finally {
    setLoading(false);
  }
};

  const words = [
    {
      text: "Build",
    },
    {
      text: "awesome",
    },
    {
      text: "Health",
    },
    {
      text: "with",
    },
    {
      text: "CureAPT.",
      className: "text-green-500 dark:text-green-500",
    },
  ];
    return (
      <main className="relative min-h-screen">
      <BackgroundGradientAnimation />
      <div className="relative z-10">
        <Navbars />
        <TracingBeam className="p-2">
          <div className="min-h-screen">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
              The road to freedom starts from here
            </p>
            <TypewriterEffectSmooth words={words} />

            <form onSubmit={handleSubmit}>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">1. How many hours of sleep do you get on an average night?</span>
    <Input 
      type="number"
      min={0}
      max={24}
      className="max-w-lg text-lg"
      value={formData.sleepHours}
      onChange={(value) => handleInputChange('sleepHours', value)}
      isReadOnly={loading}
    />
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">2. How rested and refreshed do you feel upon waking up? (Scale 1-10)</span>
    <Slider 
      size="lg"
      step={1}
      maxValue={10}
      minValue={1}
      value={formData.wakingFreshness}
      onChange={(value) => handleSliderChange('wakingFreshness', value)}
      className="max-w-lg"
    />
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">3. How would you rate your energy levels throughout the day? (Scale 1-10)</span>
    <Slider 
      size="lg"
      step={1}
      maxValue={10}
      minValue={1}
      value={formData.energyLevels}
      onChange={(value) => handleSliderChange('energyLevels', value)}
      className="max-w-lg"
    />
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">4. How often do you find yourself feeling stressed or overwhelmed?</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.stressFrequency}
      onChange={(value) => handleSelectChange('stressFrequency', value)}
      isDisabled={loading}
    >
      <SelectItem value="never">Never</SelectItem>
      <SelectItem value="rarely">Rarely</SelectItem>
      <SelectItem value="occasionally">Sometimes</SelectItem>
      <SelectItem value="frequently">Frequently</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">5. On average, how many hours a day do you spend in front of a screen (e.g., phone, computer, TV)?</span>
    <Input 
      type="number"
      min={0}
      max={24}
      className="max-w-lg text-lg"
      value={formData.screenTime}
      onChange={(value) => handleInputChange('screenTime', value)}
      isReadOnly={loading}
    />
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">6. Do you usually have time each day to relax and unwind?</span>
    <RadioGroup 
      value={formData.relaxTime}
      onChange={(value) => handleRadioChange('relaxTime', value)}
      isDisabled={loading}
    >
      <Radio value="yes">Yes</Radio>
      <Radio value="no">No</Radio>
    </RadioGroup>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">7. How satisfied are you with your work-life balance? (Scale 1-10)</span>
    <Slider 
      size="lg"
      step={1}
      maxValue={10}
      minValue={1}
      value={formData.workLifeBalance}
      onChange={(value) => handleSliderChange('workLifeBalance', value)}
      className="max-w-lg"
    />
  </Card>

  {/* Nutrition & Hydration */}
  <h2 className="text-2xl font-bold m-6">Nutrition & Hydration</h2>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">8. How many meals do you typically eat in a day?</span>
    <Input 
      type="number"
      min={0}
      max={10}
      className="max-w-lg text-lg"
      value={formData.mealsPerDay}
      onChange={(value) => handleInputChange('mealsPerDay', value)}
      isReadOnly={loading}
    />
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">9. How would you describe the nutritional quality of your meals?</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.mealQuality}
      onChange={(value) => handleSelectChange('mealQuality', value)}
      isDisabled={loading}
    >
      <SelectItem value="balanced">Balanced</SelectItem>
      <SelectItem value="varied">Varied</SelectItem>
      <SelectItem value="processed">Mostly Processed</SelectItem>
      <SelectItem value="fastfood">Mostly Fast Food</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">10. How often do you drink water or stay hydrated throughout the day?</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.hydrationFrequency}
      onChange={(value) => handleSelectChange('hydrationFrequency', value)}
      isDisabled={loading}
    >
      <SelectItem value="never">Never</SelectItem>
      <SelectItem value="rarely">Rarely</SelectItem>
      <SelectItem value="occasionally">Sometimes</SelectItem>
      <SelectItem value="frequently">Frequently</SelectItem>
      <SelectItem value="always">Always</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">11. Do you drink any beverages with caffeine (e.g., coffee, tea, energy drinks)? If so, how often?</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.caffeineFrequency}
      onChange={(value) => handleSelectChange('caffeineFrequency', value)}
      isDisabled={loading}
    >
      <SelectItem value="never">Never</SelectItem>
      <SelectItem value="rarely">Rarely</SelectItem>
      <SelectItem value="occasionally">Sometimes</SelectItem>
      <SelectItem value="frequently">Frequently</SelectItem>
      <SelectItem value="always">Always</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">12. How frequently do you consume sugary snacks or beverages?</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.sugarFrequency}
      onChange={(value) => handleSelectChange('sugarFrequency', value)}
      isDisabled={loading}
    >
      <SelectItem value="never">Never</SelectItem>
      <SelectItem value="rarely">Rarely</SelectItem>
      <SelectItem value="occasionally">Sometimes</SelectItem>
      <SelectItem value="frequently">Frequently</SelectItem>
      <SelectItem value="always">Always</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">13. How many servings of fruits and vegetables do you eat in a day?</span>
    <Input 
      type="number"
      min={0}
      max={10}
      className="max-w-lg text-lg"
      value={formData.fruitVegServings}
      onChange={(value) => handleInputChange('fruitVegServings', value)}
      isReadOnly={loading}
    />
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
  <span className="text-xl mb-4 block">14. Do you take any supplements or vitamins regularly?</span>
  <RadioGroup 
    value={formData.supplements}
    onChange={(value) => handleRadioChange('supplements', value)}
    isDisabled={loading}
  >
    <Radio value="yes">Yes</Radio>
    <Radio value="no">No</Radio>
  </RadioGroup>
</Card>

  {/* Physical Activity & Movement */}
  <h2 className="text-2xl font-bold m-6">Physical Activity & Movement</h2>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">15. How often do you engage in physical exercise each week? (e.g., walking, gym, sports)</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.exerciseFrequency}
      onChange={(value) => handleSelectChange('exerciseFrequency', value)}
      isDisabled={loading}
    >
      <SelectItem value="never">Never</SelectItem>
      <SelectItem value="1-2">1-2 times</SelectItem>
      <SelectItem value="3-4">3-4 times</SelectItem>
      <SelectItem value="5+">5+ times</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">16. How intense would you rate your exercise or physical activity? (e.g., light, moderate, intense)</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.exerciseIntensity}
      onChange={(value) => handleSelectChange('exerciseIntensity', value)}
      isDisabled={loading}
    >
      <SelectItem value="light">Light</SelectItem>
      <SelectItem value="moderate">Moderate</SelectItem>
      <SelectItem value="intense">Intense</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">17. Do you spend a lot of time sitting during the day? If so, how many hours?</span>
    <Input 
      type="number"
      min={0}
      max={24}
      className="max-w-lg text-lg"
      value={formData.sittingHours}
      onChange={(value) => handleInputChange('sittingHours', value)}
      isReadOnly={loading}
    />
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">18. Do you incorporate any stretching, yoga, or mobility exercises in your routine?</span>
    <RadioGroup 
      value={formData.stretchingRoutine}
      onChange={(value) => handleRadioChange('stretchingRoutine', value)}
      isDisabled={loading}
    >
      <Radio value="yes">Yes</Radio>
      <Radio value="no">No</Radio>
    </RadioGroup>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">19. On a scale of 1-10, how strong or flexible do you feel?</span>
    <Slider 
      size="lg"
      step={1}
      maxValue={10}
      minValue={1}
      value={formData.strengthFlexibility}
      onChange={(value) => handleSliderChange('strengthFlexibility', value)}
      className="max-w-lg"
    />
  </Card>

  {/* Mindfulness & Mental Health */}
  <h2 className="text-2xl font-bold m-6">Mindfulness & Mental Health</h2>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">20. How often do you practice mindfulness activities, such as meditation or deep breathing?</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.mindfulnessFrequency}
      onChange={(value) => handleSelectChange('mindfulnessFrequency', value)}
      isDisabled={loading}
    >
      <SelectItem value="never">Never</SelectItem>
      <SelectItem value="rarely">Rarely</SelectItem>
      <SelectItem value="occasionally">Occasionally</SelectItem>
      <SelectItem value="frequently">Frequently</SelectItem>
      <SelectItem value="daily">Daily</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">21. Do you feel able to stay focused and present in the moment during daily tasks? (Scale 1-10)</span>
    <Slider 
      size="lg"
      step={1}
      maxValue={10}
      minValue={1}
      value={formData.focusAbility}
      onChange={(value) => handleSliderChange('focusAbility', value)}
      className="max-w-lg"
    />
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">22. How often do you feel calm and relaxed throughout the day?</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.calmFrequency}
      onChange={(value) => handleSelectChange('calmFrequency', value)}
      isDisabled={loading}
    >
      <SelectItem value="never">Never</SelectItem>
      <SelectItem value="rarely">Rarely</SelectItem>
      <SelectItem value="occasionally">Occasionally</SelectItem>
      <SelectItem value="frequently">Frequently</SelectItem>
      <SelectItem value="always">Always</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">23. Do you actively manage stress (e.g., through journaling, mindfulness, talking to others)?</span>
    <RadioGroup 
      value={formData.stressManagement}
      onChange={(value) => handleRadioChange('stressManagement', value)}
      isDisabled={loading}
    >
      <Radio value="yes">Yes</Radio>
      <Radio value="no">No</Radio>
    </RadioGroup>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">24. How would you describe your emotional resilience (e.g., able to recover quickly from challenges)? (Scale 1-10)</span>
    <Slider 
      size="lg"
      step={1}
      maxValue={10}
      minValue={1}
      value={formData.emotionalResilience}
      onChange={(value) => handleSliderChange('emotionalResilience', value)}
      className="max-w-lg"
    />
  </Card>

  {/* Social & Connection */}
  <h2 className="text-2xl font-bold m-6">Social & Connection</h2>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">25. How often do you spend quality time with friends or family?</span>
    <Select 
      className="max-w-lg text-lg"
      value={formData.socialTime}
      onChange={(value) => handleSelectChange('socialTime', value)}
      isDisabled={loading}
    >
      <SelectItem value="daily">Daily</SelectItem>
      <SelectItem value="weekly">Weekly</SelectItem>
      <SelectItem value="monthly">Monthly</SelectItem>
      <SelectItem value="rarely">Rarely</SelectItem>
    </Select>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">26. Do you feel you have a support network for emotional support?</span>
    <RadioGroup 
      value={formData.supportNetwork}
      onChange={(value) => handleRadioChange('supportNetwork', value)}
      isDisabled={loading}
    >
      <Radio value="yes">Yes</Radio>
      <Radio value="no">No</Radio>
      <Radio value="somewhat">Somewhat</Radio>
    </RadioGroup>
  </Card>

  <Card className="p-6 bg-zinc-800/50 m-6">
    <span className="text-xl mb-4 block">27. How connected or engaged do you feel in your community (e.g., neighborhood, online groups)?</span>
    <Slider 
      size="lg"
      step={1}
      maxValue={10}
      minValue={1}
      value={formData.communityConnection}
      onChange={(value) => handleSliderChange('communityConnection', value)}
      className="max-w-lg"
    />
  </Card>

  {/* Self-Care & Personal Growth (continued) */}
  <Card className="p-6 bg-zinc-800/50 m-6">
  <span className="text-xl mb-4 block">28. How often do you engage in activities that bring you a sense of purpose?</span>
  <Select 
    className="max-w-lg text-lg"
    value={formData.purposeActivities}
    onChange={(value) => handleSelectChange('purposeActivities', value)}
    isDisabled={loading}
  >
    <SelectItem value="daily">Daily</SelectItem>
    <SelectItem value="weekly">Weekly</SelectItem>
    <SelectItem value="monthly">Monthly</SelectItem>
    <SelectItem value="rarely">Rarely</SelectItem>
  </Select>
</Card>

<Card className="p-6 bg-zinc-800/50 m-6">
  <span className="text-xl mb-4 block">29. How comfortable do you feel with your social interactions and relationships? (Scale 1-10)</span>
  <Slider 
    size="lg"
    step={1}
    maxValue={10}
    minValue={1}
    value={formData.socialComfort}
    onChange={(value) => handleSliderChange('socialComfort', value)}
    className="max-w-lg"
  />
</Card>

<Card className="p-6 bg-zinc-800/50 m-6">
  <span className="text-xl mb-4 block">30. How often do you dedicate time to self-care activities?</span>
  <Select 
    className="max-w-lg text-lg"
    value={formData.selfCareFrequency}
    onChange={(value) => handleSelectChange('selfCareFrequency', value)}
    isDisabled={loading}
  >
    <SelectItem value="daily">Daily</SelectItem>
    <SelectItem value="weekly">Weekly</SelectItem>
    <SelectItem value="monthly">Monthly</SelectItem>
    <SelectItem value="rarely">Rarely</SelectItem>
  </Select>
</Card>

<Card className="p-6 bg-zinc-800/50 m-6">
  <span className="text-xl mb-4 block">31. How would you rate your overall self-discipline and motivation?</span>
  <Slider 
    size="lg"
    step={1}
    maxValue={10}
    minValue={1}
    value={formData.selfDiscipline}
    onChange={(value) => handleSliderChange('selfDiscipline', value)}
    className="max-w-lg"
  />
</Card>

<Card className="p-6 bg-zinc-800/50 m-6">
  <span className="text-xl mb-4 block">32. Do you set aside time to reflect on personal goals or self-improvement?</span>
  <RadioGroup 
    value={formData.reflectGoals}
    onChange={(value) => handleRadioChange('reflectGoals', value)}
    isDisabled={loading}
  >
    <Radio value="yes">Yes</Radio>
    <Radio value="no">No</Radio>
  </RadioGroup>
</Card>

<Card className="p-6 bg-zinc-800/50 m-6">
  <span className="text-xl mb-4 block">33. How satisfied are you with your current personal growth journey?</span>
  <Slider 
    size="lg"
    step={1}
    maxValue={10}
    minValue={1}
    value={formData.personalGrowthSatisfaction}
    onChange={(value) => handleSliderChange('personalGrowthSatisfaction', value)}
    className="max-w-lg"
  />
</Card>

<Card className="p-6 bg-zinc-800/50 m-6">
  <span className="text-xl mb-4 block">34. What is your biggest wellness goal at the moment?</span>
  <Select
  label="What is your primary wellness goal?"
  value={formData.wellnessGoal}
  onChange={(value) => handleSelectChange('wellnessGoal', value)}
  isDisabled={loading}
>
  <SelectItem value="stressReduction">Stress Reduction</SelectItem>
  <SelectItem value="physicalHealth">Physical Health</SelectItem>
  <SelectItem value="mentalHealth">Mental Health</SelectItem>
  <SelectItem value="balancedLifestyle">Balanced Lifestyle</SelectItem>
  <SelectItem value="socialConnection">Social Connection</SelectItem>
</Select>
</Card>

<Button
  type="submit"
  size="lg"
  color="primary"
  className="w-full md:w-auto mt-12 text-lg h-14 m-6"
  isLoading={loading}
>
  Submit Assessment
</Button>
</form>
          </div> 
        </TracingBeam>
      </div>
    </main>
  );
}