const body = document.getElementById("star");

let meteorNumber = 25;
for (let i = 1; i <= meteorNumber; i++) {
  body.innerHTML += `<div class="meteor-${i}"></div>`;
}