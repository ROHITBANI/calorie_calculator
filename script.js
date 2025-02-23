// Update the weight change label based on goal selection
document.getElementById('goal').addEventListener('change', function() {
    const goal = this.value;
    const changeLabel = document.getElementById('change-label');
    if (goal === 'weight gain') {
        changeLabel.textContent = 'Desired Weekly Weight Gain (kg):';
    } else {
        changeLabel.textContent = 'Desired Weekly Weight Loss (kg):';
    }
});

// Set initial label based on default goal (weight loss)
const initialGoal = document.getElementById('goal').value;
const changeLabel = document.getElementById('change-label');
if (initialGoal === 'weight gain') {
    changeLabel.textContent = 'Desired Weekly Weight Gain (kg):';
} else {
    changeLabel.textContent = 'Desired Weekly Weight Loss (kg):';
}

// Handle form submission
document.getElementById('calorie-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get input values
    const goal = document.getElementById('goal').value;
    const age = parseFloat(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const activity = document.getElementById('activity').value;
    const change = parseFloat(document.getElementById('change').value);

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Define activity multipliers
    const activityMultipliers = {
        'sedentary': 1.2,
        'lightly active': 1.375,
        'moderately active': 1.55,
        'very active': 1.725,
        'extra active': 1.9
    };
    const multiplier = activityMultipliers[activity];
    const tdee = bmr * multiplier;

    // Calculate calorie adjustment (7700 calories = 1 kg)
    const weeklyChangeCalories = change * 7700;
    const dailyAdjustment = weeklyChangeCalories / 7;

    // Adjust calorie intake based on goal
    let recommendedCalories;
    if (goal === 'weight gain') {
        recommendedCalories = tdee + dailyAdjustment;
    } else { // weight loss or fat loss
        recommendedCalories = tdee - dailyAdjustment;
    }
    recommendedCalories = Math.round(recommendedCalories);

    // Calculate protein range (grams per kg of body weight)
    let proteinLow, proteinHigh;
    if (goal === 'weight gain') {
        proteinLow = 2 * weight;    // 2 g/kg
        proteinHigh = 2.2 * weight; // 2.2 g/kg
    } else { // weight loss or fat loss
        proteinLow = 1.5 * weight;  // 1.5 g/kg
        proteinHigh = 2 * weight;   // 2 g/kg
    }
    proteinLow = Math.round(proteinLow);
    proteinHigh = Math.round(proteinHigh);

    // Provide goal-specific tips
    let tips;
    if (goal === 'weight loss') {
        tips = "Focus on nutrient-dense foods, portion control, and regular exercise to create a sustainable deficit.";
    } else if (goal === 'fat loss') {
        tips = "Emphasize high-protein foods and strength training to preserve muscle while losing fat.";
    } else if (goal === 'weight gain') {
        tips = "Consume calorie-dense, nutrient-rich foods with plenty of protein and complex carbs, paired with strength training.";
    }

    // Display results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Results</h2>
        <p><strong>Recommended Daily Calorie Intake:</strong> ${recommendedCalories} calories</p>
        <p><strong>Recommended Protein Intake:</strong> ${proteinLow}–${proteinHigh} grams per day</p>
        <p><strong>Tips:</strong> ${tips}</p>
        <p><em>Disclaimer: These are estimates based on standard formulas. Consult a healthcare professional for personalized advice.</em></p>
    `;
});