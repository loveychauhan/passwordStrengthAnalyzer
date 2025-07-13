function displayFeedback(score, strength, feedback, entropy, crackTime, password) {
  const lengthBar = document.getElementById("length-bar");
  const varietyBar = document.getElementById("variety-bar");
  const entropyBar = document.getElementById("entropy-bar");
  const strengthText = document.getElementById("strength-text");
  const feedbackDiv = document.getElementById("feedback");

  // Calculate individual scores
  const lengthScore = Math.min((password.length / 12) * 100, 100);
  const varietyScore = (/[A-Z]/.test(password) ? 25 : 0) +
                      (/[a-z]/.test(password) ? 25 : 0) +
                      (/[0-9]/.test(password) ? 25 : 0) +
                      (/[^A-Za-z0-9]/.test(password) ? 25 : 0);
  const entropyScore = Math.min((entropy / 80) * 100, 100);

  lengthBar.style.width = `${lengthScore}%`;
  varietyBar.style.width = `${varietyScore}%`;
  entropyBar.style.width = `${entropyScore}%`;

  lengthBar.className = `segment ${lengthScore > 66 ? 'strong' : lengthScore > 33 ? 'medium' : 'weak'}`;
  varietyBar.className = `segment ${varietyScore > 66 ? 'strong' : varietyScore > 33 ? 'medium' : 'weak'}`;
  entropyBar.className = `segment ${entropyScore > 66 ? 'strong' : entropyScore > 33 ? 'medium' : 'weak'}`;

  strengthText.textContent = `Password Strength: ${strength.charAt(0).toUpperCase() + strength.slice(1)} (Entropy: ${entropy.toFixed(1)} bits, Crack Time: ${crackTime})`;
  feedbackDiv.innerHTML = feedback.length > 0 ? feedback.join("<br>") : "Great job! This is a strong password.";
}