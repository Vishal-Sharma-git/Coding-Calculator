let currentDisplay = "";
let lastAnswer = 0;

const displayEl = document.getElementById("Display");
const historyList = document.getElementById("HistoryList");

// Update display
function updateDisplay() {
  displayEl.value = currentDisplay || "0";
}

// Append value
function append(val) {
  currentDisplay += val;
  updateDisplay();
}

// Clear all
function clearDisplay() {
  currentDisplay = "";
  updateDisplay();
}

// Backspace
function backspace() {
  currentDisplay = currentDisplay.slice(0, -1);
  updateDisplay();
}

// Convert human expression to JS-safe
function formatExpression(expr) {
  return expr
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/π/g, "Math.PI")
    .replace(/e/g, "Math.E")
    .replace(/\^/g, "**");
}

// Calculate result
function calculate() {
  try {
    if (!currentDisplay) return;
    const formatted = formatExpression(currentDisplay);
    const result = eval(formatted);

    if (!isFinite(result)) throw new Error("Math error");

    addToHistory(`${currentDisplay} = ${result}`);
    lastAnswer = result;
    currentDisplay = result.toString();
    updateDisplay();
  } catch (err) {
    displayEl.value = "Error";
  }
}

// Factorial function
function doFactorial() {
  if (!currentDisplay) return;
  let value = Number(currentDisplay);

  if (!Number.isInteger(value) || value < 0 || value > 170) {
    // 170! is around JS limit
    displayEl.value = "Error";
    return;
  }

  let result = 1;
  for (let i = 2; i <= value; i++) {
    result *= i;
  }

  addToHistory(`${value}! = ${result}`);
  currentDisplay = result.toString();
  updateDisplay();
}

// Insert last answer
function insertAns() {
  if (lastAnswer !== undefined) {
    currentDisplay += lastAnswer.toString();
    updateDisplay();
  }
}

// Add expression to history
function addToHistory(text) {
  const li = document.createElement("li");
  li.textContent = text;
  historyList.prepend(li);

  // Limit history to 30 entries
  if (historyList.children.length > 30) {
    historyList.removeChild(historyList.lastChild);
  }
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("light");
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key >= "0" && key <= "9") {
    append(key);
  } else if (["+", "-", "*", "/", "%", "(", ")"].includes(key)) {
    append(key);
  } else if (key === ".") {
    append(".");
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
