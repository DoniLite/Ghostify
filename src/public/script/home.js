

/**
 * Fonction retournant le mois correspondant à l'index
 * @param {number} monthIndex
 */
const getMonthWithDate = (monthIndex) => {
const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
return months[monthIndex]
}

window.setInterval(()=>{
    const handler = document.querySelector(".time-check");
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const secondes = date.getSeconds();
    const time = `${hours}H : ${minutes}m ${secondes}s`
    handler.innerHTML = `${time} <br> ${date.getDate()} ${getMonthWithDate(
      date.getMonth()
    )} ${date.getFullYear()}`;
    console.log(time);
}, 1000);
