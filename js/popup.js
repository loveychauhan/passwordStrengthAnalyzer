document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password-input");
  const togglePassword = document.getElementById("toggle-password");
  const generateButton = document.getElementById("generate-password");
  const copyButton = document.getElementById("copy-password");
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsPanel = document.getElementById("settings-panel");
  const themeToggle = document.getElementById("theme-toggle");
  const contrastToggle = document.getElementById("contrast-toggle");
  const generatedPasswordDiv = document.getElementById("generated-password");
  const lengthInput = document.getElementById("password-length");
  const checkboxes = {
    uppercase: document.getElementById("include-uppercase"),
    lowercase: document.getElementById("include-lowercase"),
    numbers: document.getElementById("include-numbers"),
    symbols: document.getElementById("include-symbols"),
  };
  const policyInputs = {
    minLength: document.getElementById("policy-min-length"),
    uppercase: document.getElementById("policy-uppercase"),
    lowercase: document.getElementById("policy-lowercase"),
    numbers: document.getElementById("policy-numbers"),
    symbols: document.getElementById("policy-symbols"),
  };

  // Real-time password strength analysis
  passwordInput.addEventListener("input", async () => {
    const password = passwordInput.value;
    const policy = {
      minLength: parseInt(policyInputs.minLength.value),
      uppercase: policyInputs.uppercase.checked,
      lowercase: policyInputs.lowercase.checked,
      numbers: policyInputs.numbers.checked,
      symbols: policyInputs.symbols.checked,
    };
    const { score, strength, feedback, entropy, crackTime } = await evaluatePasswordStrength(password, policy);
    displayFeedback(score, strength, feedback, entropy, crackTime, password);
  });

  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePassword.textContent = type === "password" ? "Show" : "Hide";
  });

  // Generate password
  generateButton.addEventListener("click", async () => {
    const length = parseInt(lengthInput.value);
    const options = {
      includeUppercase: checkboxes.uppercase.checked,
      includeLowercase: checkboxes.lowercase.checked,
      includeNumbers: checkboxes.numbers.checked,
      includeSymbols: checkboxes.symbols.checked,
    };
    const password = generatePassword(length, options.includeUppercase, options.includeLowercase, options.includeNumbers, options.includeSymbols);
    generatedPasswordDiv.textContent = password;
    passwordInput.value = password;
    copyButton.style.display = "block";
    const policy = {
      minLength: parseInt(policyInputs.minLength.value),
      uppercase: policyInputs.uppercase.checked,
      lowercase: policyInputs.lowercase.checked,
      numbers: policyInputs.numbers.checked,
      symbols: policyInputs.symbols.checked,
    };
    const { score, strength, feedback, entropy, crackTime } = await evaluatePasswordStrength(password, policy);
    displayFeedback(score, strength, feedback, entropy, crackTime, password);
  });

  // Copy to clipboard
  copyButton.addEventListener("click", () => {
    const password = generatedPasswordDiv.textContent;
    navigator.clipboard.writeText(password).then(() => {
      alert("Password copied to clipboard!");
    });
  });

  // Toggle settings panel
  settingsToggle.addEventListener("click", () => {
    settingsPanel.style.display = settingsPanel.style.display === "none" ? "block" : "none";
  });

  // Toggle dark mode
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });

  // Toggle high-contrast mode
  contrastToggle.addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
    contrastToggle.textContent = document.body.classList.contains("high-contrast") ? "🔅" : "🔆";
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement === passwordInput) {
      generateButton.click();
    }
  });
});