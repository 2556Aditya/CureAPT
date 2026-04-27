// utils/recommendationSystem.js
function generateDynamicRecommendations(metrics) {
    let recommendations = [];
  
    if (metrics.generalLifestyle < 30) {
      recommendations.push("Consider improving your sleep quality and reducing screen time before bed.");
      recommendations.push("Try to establish a consistent sleep schedule and practice relaxation techniques.");
    } else if (metrics.generalLifestyle < 50) {
      recommendations.push("Consider improving your sleep quality and reducing screen time before bed.");
    } else if (metrics.generalLifestyle < 70) {
      recommendations.push("Maintain your current lifestyle but try to improve your sleep quality.");
    } else {
      recommendations.push("Great job! Keep maintaining your healthy lifestyle.");
    }
  
    if (metrics.nutritionHydration < 30) {
      recommendations.push("Focus on balanced meals and staying hydrated throughout the day.");
      recommendations.push("Reduce intake of sugary snacks and beverages, and increase fruit and vegetable servings.");
    } else if (metrics.nutritionHydration < 50) {
      recommendations.push("Focus on balanced meals and staying hydrated throughout the day.");
    } else if (metrics.nutritionHydration < 70) {
      recommendations.push("Maintain your current diet but try to reduce sugary snacks.");
    } else {
      recommendations.push("Great job! Keep maintaining your healthy diet.");
    }
  
    if (metrics.physicalActivity < 30) {
      recommendations.push("Incorporate regular physical exercise into your routine.");
      recommendations.push("Try to include stretching or yoga exercises to improve flexibility.");
    } else if (metrics.physicalActivity < 50) {
      recommendations.push("Incorporate regular physical exercise into your routine.");
    } else if (metrics.physicalActivity < 70) {
      recommendations.push("Maintain your current exercise routine but try to increase intensity.");
    } else {
      recommendations.push("Great job! Keep maintaining your physical activity.");
    }
  
    if (metrics.mindfulnessMentalHealth < 30) {
      recommendations.push("Practice mindfulness activities like meditation or deep breathing.");
      recommendations.push("Consider journaling or talking to someone about your stress.");
    } else if (metrics.mindfulnessMentalHealth < 50) {
      recommendations.push("Practice mindfulness activities like meditation or deep breathing.");
    } else if (metrics.mindfulnessMentalHealth < 70) {
      recommendations.push("Maintain your current mindfulness practices but try to increase frequency.");
    } else {
      recommendations.push("Great job! Keep maintaining your mental health.");
    }
  
    if (metrics.socialConnection < 30) {
      recommendations.push("Spend quality time with friends and family to strengthen your support network.");
      recommendations.push("Engage in community activities or online groups to feel more connected.");
    } else if (metrics.socialConnection < 50) {
      recommendations.push("Spend quality time with friends and family to strengthen your support network.");
    } else if (metrics.socialConnection < 70) {
      recommendations.push("Maintain your current social connections but try to engage more with your community.");
    } else {
      recommendations.push("Great job! Keep maintaining your social connections.");
    }
  
    if (metrics.selfCarePersonalGrowth < 30) {
      recommendations.push("Dedicate time to self-care activities and personal growth.");
      recommendations.push("Set aside time to reflect on personal goals and self-improvement.");
    } else if (metrics.selfCarePersonalGrowth < 50) {
      recommendations.push("Dedicate time to self-care activities and personal growth.");
    } else if (metrics.selfCarePersonalGrowth < 70) {
      recommendations.push("Maintain your current self-care practices but try to increase frequency.");
    } else {
      recommendations.push("Great job! Keep maintaining your personal growth.");
    }
  
    const shuffledRecs = recommendations.sort(() => Math.random() - 0.5);
    return shuffledRecs.slice(0, 3);
  }
  
  export { generateDynamicRecommendations };