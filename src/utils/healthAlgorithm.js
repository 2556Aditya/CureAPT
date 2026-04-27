import { INPUT_CONSTANTS } from './constants';

// At the top of the file after imports
const { FREQUENCY, MEAL_QUALITY, EXERCISE_FREQUENCY, EXERCISE_INTENSITY, SOCIAL_TIME, SELF_CARE_FREQUENCY, BOOLEAN, WELLNESS_GOAL_SCORES } = INPUT_CONSTANTS;
// Update normalizeInput function to handle FREQUENCY and other constants
function normalizeInput(value, type = 'raw', max = 10) {
  if (type === 'raw-inverse') {
    return 10 - Math.min(Math.max((value / max) * 10, 0), 10);
  }
  if (type === 'frequency') return FREQUENCY[value] || 0;
  if (type === 'meal') return MEAL_QUALITY[value] || 0;
  if (type === 'exercise') return EXERCISE_FREQUENCY[value] || 0;
  if (type === 'intensity') return EXERCISE_INTENSITY[value] || 0;
  if (type === 'social') return SOCIAL_TIME[value] || 0;
  if (type === 'selfcare') return SELF_CARE_FREQUENCY[value] || 0;
  if (type === 'boolean') return BOOLEAN[value] || 0;
  return Math.min(Math.max((value / max) * 10, 0), 10);
}

// Calculate weighted average
function weightedAverage(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const weightedSum = items.reduce((sum, item) => sum + item.value * item.weight, 0);
  return weightedSum / totalWeight;
}

// Calculate category scores
function calculateCategoryScores(answers) {

  const scaleTo100 = (value) => value * 10;

  const generalLifestyle = scaleTo100(weightedAverage([
    { value: normalizeInput(answers.sleepHours, 'raw', 24), weight: 0.15 },
    { value: normalizeInput(answers.wakingFreshness, 'raw'), weight: 0.15 },
    { value: normalizeInput(answers.energyLevels, 'raw'), weight: 0.15 },
    { value: normalizeInput(answers.stressFrequency, 'frequency'), weight: 0.15 },
    { value: normalizeInput(answers.screenTime, 'raw-inverse', 24), weight: 0.15 },
    { value: normalizeInput(answers.relaxTime, 'boolean'), weight: 0.15 },
    { value: normalizeInput(answers.workLifeBalance, 'raw'), weight: 0.10 }
  ]));
  
  const nutritionHydration = scaleTo100( weightedAverage([
    { value: normalizeInput(answers.mealsPerDay, 'raw', 5), weight: 0.15 },
    { value: normalizeInput(answers.mealQuality, 'meal'), weight: 0.15 },
    { value: normalizeInput(answers.hydrationFrequency, 'frequency'), weight: 0.15 },
    { value: normalizeInput(answers.caffeineFrequency, 'frequency'), weight: 0.15 },
    { value: normalizeInput(answers.sugarFrequency, 'frequency'), weight: 0.15 },
    { value: normalizeInput(answers.fruitVegServings, 'raw', 10), weight: 0.15 },
    { value: normalizeInput(answers.supplements, 'boolean'), weight: 0.10 }
  ]));
  
  const physicalActivity = scaleTo100(weightedAverage([
    { value: normalizeInput(answers.exerciseFrequency, 'exercise'), weight: 0.2 },
    { value: normalizeInput(answers.exerciseIntensity, 'intensity'), weight: 0.2 },
    { value: normalizeInput(answers.sittingHours, 'raw-inverse', 24), weight: 0.2 },
    { value: normalizeInput(answers.stretchingRoutine, 'boolean'), weight: 0.2 },
    { value: normalizeInput(answers.strengthFlexibility, 'raw'), weight: 0.2 }
  ]));
  
  const mindfulnessMentalHealth = scaleTo100(weightedAverage([
    { value: normalizeInput(answers.mindfulnessFrequency, 'frequency'), weight: 0.2 },
    { value: normalizeInput(answers.focusAbility, 'raw'), weight: 0.2 },
    { value: normalizeInput(answers.calmFrequency, 'frequency'), weight: 0.2 },
    { value: normalizeInput(answers.stressManagement, 'boolean'), weight: 0.2 },
    { value: normalizeInput(answers.emotionalResilience, 'raw'), weight: 0.2 }
  ]));
  
  const socialConnection = scaleTo100(weightedAverage([
    { value: normalizeInput(answers.socialTime, 'social'), weight: 0.2 },
    { value: normalizeInput(answers.supportNetwork, 'boolean'), weight: 0.2 },
    { value: normalizeInput(answers.communityConnection, 'raw'), weight: 0.2 },
    { value: normalizeInput(answers.socialComfort, 'raw'), weight: 0.2 },
    { value: normalizeInput(answers.purposeActivities, 'social'), weight: 0.2 } // Added purposeActivities
  ]));
  
  const selfCarePersonalGrowth = scaleTo100(weightedAverage([
    { value: normalizeInput(answers.selfCareFrequency, 'selfcare'), weight: 0.2 },
    { value: normalizeInput(answers.selfDiscipline, 'raw'), weight: 0.2 },
    { value: normalizeInput(answers.reflectGoals, 'boolean'), weight: 0.2 },
    { value: normalizeInput(answers.personalGrowthSatisfaction, 'raw'), weight: 0.2 },
    { value: normalizeInput(WELLNESS_GOAL_SCORES[answers.wellnessGoal] || 5, 'raw'), weight: 0.2 }
  ]));

  const overallHealth = scaleTo100(weightedAverage([
    { value: generalLifestyle, weight: 0.167 },
    { value: nutritionHydration, weight: 0.167 },
    { value: physicalActivity, weight: 0.167 },
    { value: mindfulnessMentalHealth, weight: 0.167 },
    { value: socialConnection, weight: 0.167 },
    { value: selfCarePersonalGrowth, weight: 0.167 }
  ]));

  return {
    generalLifestyle,
    nutritionHydration,
    physicalActivity,
    mindfulnessMentalHealth,
    socialConnection,
    selfCarePersonalGrowth,
    overallHealth
  };
}

// Generate daily questions for tracking
function generateDailyQuestions(scores) {
  const dailyQuestions = [];

  if (scores.generalLifestyle < 50) {
    dailyQuestions.push("How many hours of sleep did you get last night?");
    dailyQuestions.push("How would you rate your energy levels today? (Scale 1-10)");
  } else if (scores.generalLifestyle < 70) {
    dailyQuestions.push("Did you feel rested upon waking up today?");
  } else {
    dailyQuestions.push("Did you maintain your sleep schedule today?");
  }

  if (scores.nutritionHydration < 50) {
    dailyQuestions.push("How many meals did you eat today?");
    dailyQuestions.push("How much water did you drink today?");
  } else if (scores.nutritionHydration < 70) {
    dailyQuestions.push("Did you avoid sugary snacks today?");
  } else {
    dailyQuestions.push("Did you maintain your balanced diet today?");
  }

  if (scores.physicalActivity < 50) {
    dailyQuestions.push("Did you engage in any physical exercise today? If so, for how long?");
    dailyQuestions.push("Did you incorporate any stretching or yoga exercises today?");
  } else if (scores.physicalActivity < 70) {
    dailyQuestions.push("Did you increase the intensity of your exercise today?");
  } else {
    dailyQuestions.push("Did you maintain your exercise routine today?");
  }

  if (scores.mindfulnessMentalHealth < 50) {
    dailyQuestions.push("Did you practice any mindfulness activities today?");
    dailyQuestions.push("How would you rate your mood today? (Scale 1-10)");
  } else if (scores.mindfulnessMentalHealth < 70) {
    dailyQuestions.push("Did you practice mindfulness more frequently today?");
  } else {
    dailyQuestions.push("Did you maintain your mindfulness practices today?");
  }

  if (scores.socialConnection < 50) {
    dailyQuestions.push("Did you spend quality time with friends or family today?");
    dailyQuestions.push("Did you engage in any community activities today?");
  } else if (scores.socialConnection < 70) {
    dailyQuestions.push("Did you engage more with your community today?");
  } else {
    dailyQuestions.push("Did you maintain your social connections today?");
  }

  if (scores.selfCarePersonalGrowth < 50) {
    dailyQuestions.push("Did you dedicate time to any self-care activities today?");
    dailyQuestions.push("Did you reflect on your personal goals today?");
  } else if (scores.selfCarePersonalGrowth < 70) {
    dailyQuestions.push("Did you increase the frequency of your self-care activities today?");
  } else {
    dailyQuestions.push("Did you maintain your self-care practices today?");
  }

  return dailyQuestions;
}

// Main function to calculate metrics, recommendations, and daily questions
// utils/healthAlgorithm.js
function calculateHealthMetrics(answers) {
  console.log('Processing answers:', answers); // Debug log
  
  const scores = calculateCategoryScores(answers);
  console.log('Calculated scores:', scores); // Debug log

  const dailyQuestions = generateDailyQuestions(scores);

  return {
    scores,
    dailyQuestions
  };
}

export { 
  calculateHealthMetrics,
  calculateCategoryScores,
  generateDailyQuestions,
  normalizeInput,
  weightedAverage 
};