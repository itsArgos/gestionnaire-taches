const onClickOpenForm = document.getElementById("onClickOpenForm");
const form = document.getElementById("form");
const submitForm = document.getElementById("submitForm");
const closeForm = document.getElementById("closeForm");

onClickOpenForm.addEventListener("click", () => {
  form.style.display = "grid";
});

closeForm.addEventListener("click", () => {
  form.style.display = "none";
});
