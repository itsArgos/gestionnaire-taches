const onClickOpenForm = document.getElementById("onClickOpenForm");
const form = document.getElementById("form");
const submitForm = document.getElementById("submitForm");
const closeForm = document.getElementById("closeForm");

// Affiche le formulaire
onClickOpenForm.addEventListener("click", () => {
  form.style.display = "grid";
});

// Cache et réinitialise le formulaire
closeForm.addEventListener("click", () => {
  form.style.display = "none";
  form.reset();
});

// Au clique sur le bouton "Ajouter la tâche" empêche la page de recharger
submitForm.addEventListener("click", (event) => {
  // Si le formulaire est invalide, on affiche les champs requis
  const formElement = document.getElementById("form");
  if (!formElement.checkValidity()) {
    return formElement.reportValidity();
  }

  event.preventDefault();

  // Récuperation de la valeur de chaque champs du formulaire
  const titleForm = document.getElementById("title-form").value;
  const descriptionForm = document.getElementById("description-form").value;
  const dateForm = document.getElementById("deadline-form").value;
  const priorityForm = document.getElementById("priority-form").value;

  // Formatage de la date en ordre FR -> JJ/MM/AAAA
  const [year, month, day] = dateForm.split("-");
  const frenchDate = `${day}/${month}/${year}`;

  // Création d'un nouvel élément <li>
  const li = document.createElement("li");
  const taskList = document.getElementById("taskList");

  // Création d'un "span" pour ajouter un icone de priorité à la suite
  const taskContent = document.createElement("p");
  taskContent.innerHTML = `<strong>${titleForm}</strong> <p>${descriptionForm}</p> <p>${frenchDate}</p>`;

  const iconsContainer = document.createElement("div");
  iconsContainer.classList.add("icons-container");

  const priorityIcon = document.createElement("ion-icon");
  priorityIcon.setAttribute("name", "ellipse");
  priorityIcon.classList.add("priority-icon", `priority-${priorityForm}`);

  const icon = document.createElement("ion-icon");
  icon.setAttribute("name", "trash-outline");
  icon.style.cursor = "pointer";

  // Suppression de la tâche (li)
  icon.addEventListener("click", () => {
    li.remove();
  });

  // Ajout des éléments dans le <li> puis dans la liste
  iconsContainer.appendChild(priorityIcon);
  iconsContainer.appendChild(icon);

  li.appendChild(taskContent);
  li.appendChild(iconsContainer);

  taskList.appendChild(li);

  // Réinitialisation du formulaire àprès ajout de la tâche
  form.reset();
  form.style.display = "none";
});
