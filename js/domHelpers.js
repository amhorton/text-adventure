export const setExplanation = function (newContent = "") {
    const explanation = window.document.getElementById('#explanation');
    explanation.innerHtml(newContent);
}
