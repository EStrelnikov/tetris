let totalScore = 0;
const score = {
  1: 100,
  2: 300,
  3: 700,
  4: 1500,
};
const scoreValue = document.querySelector(".score_value");

// обновление очков
export function scorePoints(number) {
  if (number > 0 && number <= 4) {
    totalScore += score[number];
    scoreValue.innerText = totalScore;
  }
}
