const allMinicards = document.querySelectorAll(".minicard");

allMinicards.forEach((minicard) => {
  minicard.addEventListener("click", () => {
    allMinicards.forEach((card) => card.classList.remove("active"));

    minicard.classList.add("active");
  });
});

// GETDATE
function formatCurrentDate() {
  const date = document.querySelector(`.date`);
  const day = document.querySelector(".day");
  const today = new Date().toLocaleDateString("en-us", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  date.innerText = today;
  day.innerText = "Today";
}
// Example usage
const formattedDate = formatCurrentDate();
