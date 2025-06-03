const onClickOpenForm = document.getElementById("onClickOpenForm");
const form = document.getElementById("form");
const submitForm = document.getElementById("submitForm");
const closeForm = document.getElementById("closeForm");

// Au clique sur le bouton "Ajouter une tâche", on affiche le formulaire
onClickOpenForm.addEventListener("click", () => {
  form.style.display = "grid";
});

// Au clique sur le bouton "Annuler", on cache le formulaire
closeForm.addEventListener("click", () => {
  form.style.display = "none";
});

// Au clique sur le bouton "Ajouter la tâche" empêche la page de recharger
submitForm.addEventListener("click", (event) => {
  event.preventDefault();

  // Récuperation de la valeur de chaque champs du formulaire
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const date = document.getElementById("deadline").value;
  const priority = document.getElementById("priority").value;

  // Création d'un nouvel élément <li>
  const li = document.createElement("li");
  const taskList = document.getElementById("taskList");

  // Création d'une icône de poubelle pour supprimer une tâche
  const icon = document.createElement("ion-icon");
  icon.setAttribute("name", "trash-outline");
  icon.style.cursor = "pointer";

  // Ajoute le texte dans le "li" ( titre, déscription, date et priorité )
  li.innerText = title + " - " + description + " - " + date + " - " + priority;

  // Ajoute le li au parent ( taskList = ul )
  taskList.appendChild(li);

  // ajoute l'icone de poubelle à droite du texte pour supprimer la tâche (remove)
  li.appendChild(icon);
  icon.addEventListener("click", () => {
    li.remove();
  });
});
