const allMinicards = document.querySelectorAll(".minicard");

allMinicards.forEach((minicard) => {
  minicard.addEventListener("click", () => {
    allMinicards.forEach((card) => card.classList.remove("active"));

    minicard.classList.add("active");
  });
});
