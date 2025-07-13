function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  let characters = "";
  let password = "";

  if (includeUppercase) characters += uppercase;
  if (includeLowercase) characters += lowercase;
  if (includeNumbers) characters += numbers;
  if (includeSymbols) characters += symbols;

  if (characters.length === 0) {
    return "Select at least one character type.";
  }

  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += characters[array[i] % characters.length];
  }

  if (includeUppercase) password = replaceRandomChar(password, uppercase);
  if (includeLowercase) password = replaceRandomChar(password, lowercase);
  if (includeNumbers) password = replaceRandomChar(password, numbers);
  if (includeSymbols) password = replaceRandomChar(password, symbols);

  return password;
}

function replaceRandomChar(password, charSet) {
  const array = new Uint8Array(1);
  crypto.getRandomValues(array);
  const randomIndex = array[0] % password.length;
  const randomChar = charSet[array[0] % charSet.length];
  return password.substring(0, randomIndex) + randomChar + password.substring(randomIndex + 1);
}