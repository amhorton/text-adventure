export function setExplanation(newContent = "") {
    const explanation = window.document.getElementById('explanation');
    explanation.innerText = newContent;
}

export function setDescription(newContent = "") {
  const description = window.document.getElementById('description');
  description.innerText = newContent;
}

export function getInput() {
  return window.document.getElementById('player-input');
}
