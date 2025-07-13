async function evaluatePasswordStrength(password, policy = {}) {
  let score = 0;
  const feedback = [];

  // Length check
  const minLength = policy.minLength || 8;
  if (password.length < minLength) {
    feedback.push(`Password is too short. Minimum ${minLength} characters required.`);
  } else if (password.length >= minLength && password.length < minLength + 4) {
    score += 20;
  } else {
    score += 30;
  }

  // Character variety checks
  if (policy.uppercase && !/[A-Z]/.test(password)) {
    feedback.push("Uppercase letters required.");
  } else if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    feedback.push("Add uppercase letters for better strength.");
  }

  if (policy.lowercase && !/[a-z]/.test(password)) {
    feedback.push("Lowercase letters required.");
  } else if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    feedback.push("Add lowercase letters for better strength.");
  }

  if (policy.numbers && !/[0-9]/.test(password)) {
    feedback.push("Numbers required.");
  } else if (/[0-9]/.test(password)) {
    score += 20;
  } else {
    feedback.push("Add numbers for better strength.");
  }

  if (policy.symbols && !/[^A-Za-z0-9]/.test(password)) {
    feedback.push("Special characters required.");
  } else if (/[^A-Za-z0-9]/.test(password)) {
    score += 20;
  } else {
    feedback.push("Add special characters (e.g., !@#$) for better strength.");
  }

  // Pattern checks
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push("Avoid repeating characters more than twice.");
  }

  // Entropy calculation
  const entropy = calculateEntropy(password);
  if (entropy < 50) {
    feedback.push("Low entropy. Use a more random password.");
  } else if (entropy < 80) {
    score += 10;
  } else {
    score += 20;
  }

  // Crack time estimation
  const crackTime = estimateCrackTime(entropy);
  feedback.push(`Estimated crack time: ${crackTime}`);

  // Breach detection
  let breachMessage = null;
  try {
    const breachCount = await checkPasswordBreach(password);
    if (breachCount > 0) {
      feedback.push(`This password was found in ${breachCount} data breach${breachCount > 1 ? 'es' : ''}!`);
      score -= 20;
    }
  } catch (e) {
    console.warn("Breach check failed:", e);
  }

  // Determine strength level
  let strength;
  if (score < 50) {
    strength = "weak";
  } else if (score < 80) {
    strength = "medium";
  } else {
    strength = "strong";
  }

  return { score, strength, feedback, entropy, crackTime };
}

function calculateEntropy(password) {
  const charSetSize = (/[A-Z]/.test(password) ? 26 : 0) +
                      (/[a-z]/.test(password) ? 26 : 0) +
                      (/[0-9]/.test(password) ? 10 : 0) +
                      (/[^A-Za-z0-9]/.test(password) ? 32 : 0);
  return charSetSize ? password.length * Math.log2(charSetSize) : 0;
}

async function checkPasswordBreach(password) {
  try {
    const hash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password))
      .then(buffer => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join(''));
    const prefix = hash.slice(0, 5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();
    const lines = data.split('\n');
    for (const line of lines) {
      const [suffix, count] = line.split(':');
      if (hash.slice(5).toUpperCase() === suffix) {
        return parseInt(count, 10);
      }
    }
    return 0;
  } catch {
    return 0;
  }
}

function estimateCrackTime(entropy) {
  const guessesPerSecond = 10e9; // Assume 10 billion guesses/sec (modern GPU)
  const guesses = Math.pow(2, entropy);
  const seconds = guesses / guessesPerSecond;
  if (seconds < 60) return "< 1 minute";
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  return `${Math.round(seconds / 31536000)} years`;
}