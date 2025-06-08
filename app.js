const onClickOpenForm = document.getElementById("onClickOpenForm");
const form = document.getElementById("form");
const submitForm = document.getElementById("submitForm");
const closeForm = document.getElementById("closeForm");
const filterSelect = document.querySelector(".filter-list");

let taskEdited = null;

// Affiche le formulaire
onClickOpenForm.addEventListener("click", () => {
  form.style.display = "grid";
});

// Ferme et réinitialise le formulaire
closeForm.addEventListener("click", () => {
  form.style.display = "none";
  form.reset();
});

// Au clique sur le bouton "Ajouter la tâche" empêche la page de recharger
submitForm.addEventListener("click", (event) => {
  const formElement = document.getElementById("form");
  if (!formElement.checkValidity()) {
    return formElement.reportValidity();
  }
  event.preventDefault();

  const titleForm = document.getElementById("title-form").value;
  const descriptionForm = document.getElementById("description-form").value;
  const dateForm = document.getElementById("deadline-form").value;
  const priorityForm = document.getElementById("priority-form").value;

  const [year, month, day] = dateForm.split("-");
  const frenchDate = `${day}/${month}/${year}`;

  // Si on modifie une tâche existante
  if (taskEdited) {
    const taskContent = taskEdited.querySelector("p");
    const iconsContainer = taskEdited.querySelector(".icons-container");

    // Met à jour le contenu textuel
    taskContent.innerHTML = `
      <strong>${titleForm}</strong>
      <p>${descriptionForm}</p>
      <p>${frenchDate}</p>
    `;

    // Supprime l'ancienne pastille si elle existe
    const oldIcon = iconsContainer.querySelector(".priority-icon");
    if (oldIcon) oldIcon.remove();

    // Crée une nouvelle pastille
    const newPriorityIcon = document.createElement("ion-icon");
    newPriorityIcon.setAttribute("name", "ellipse");
    newPriorityIcon.classList.add("priority-icon", `priority-${priorityForm}`);
    iconsContainer.prepend(newPriorityIcon); // Ajoute au début

    submitForm.textContent = "Ajouter la tâche";
    taskEdited = null;
  } else {
    // Création d'un nouvel élément <li>
    const li = document.createElement("li");
    const taskList = document.getElementById("taskList");
    li.dataset.status = "in-progress";

    const taskContent = document.createElement("p");
    taskContent.innerHTML = `
      <strong>${titleForm}</strong>
      <p>${descriptionForm}</p>
      <p>${frenchDate}</p>
    `;

    const iconsContainer = document.createElement("div");
    iconsContainer.classList.add("icons-container");

    const priorityIcon = document.createElement("ion-icon");
    priorityIcon.setAttribute("name", "ellipse");
    priorityIcon.classList.add("priority-icon", `priority-${priorityForm}`);

    const deleteIcon = document.createElement("ion-icon");
    deleteIcon.setAttribute("name", "trash-outline");
    deleteIcon.style.cursor = "pointer";

    const editIcon = document.createElement("ion-icon");
    editIcon.setAttribute("name", "create-outline");
    editIcon.style.cursor = "pointer";
    editIcon.title = "Modifier la tâche";

    const taskEnd = document.createElement("ion-icon");
    taskEnd.setAttribute("name", "checkmark-done-outline");
    taskEnd.style.cursor = "pointer";
    taskEnd.title = "Marquer comme terminée";

    // Modification de la tâche via formulaire
    editIcon.addEventListener("click", () => {
      const boldTitle = taskContent.querySelector("strong");
      const paragraphs = taskContent.querySelectorAll("p");

      const descEl = paragraphs[0];
      const dateEl = paragraphs[1];

      const titleText = boldTitle?.innerText || "";
      const descText = descEl?.innerText || "";
      const dateText = dateEl?.innerText || "";

      const [day, month, year] = dateText.split("/");
      const isoDate = `${year}-${month}-${day}`;

      document.getElementById("title-form").value = titleText;
      document.getElementById("description-form").value = descText;
      document.getElementById("deadline-form").value = isoDate;

      const priorityClass = iconsContainer
        .querySelector(".priority-icon")
        ?.classList.value.match(/priority-(\w+)/);
      if (priorityClass) {
        document.getElementById("priority-form").value = priorityClass[1];
      }

      form.style.display = "grid";
      submitForm.textContent = "Enregistrer";
      taskEdited = li;
    });

    taskEnd.addEventListener("click", () => {
      const isFinished = li.dataset.status === "finished";

      if (isFinished) {
        li.dataset.status = "in-progress";
        li.classList.remove("task-finished");
        taskEnd.setAttribute("name", "checkmark-done-outline");
        taskEnd.title = "Marquer comme terminée";
      } else {
        li.dataset.status = "finished";
        li.classList.add("task-finished");
        taskEnd.setAttribute("name", "refresh-outline");
        taskEnd.title = "Remettre en cours";
      }

      applyFilter();
    });

    deleteIcon.addEventListener("click", () => {
      li.remove();
    });

    iconsContainer.appendChild(priorityIcon);
    iconsContainer.appendChild(deleteIcon);
    iconsContainer.appendChild(editIcon);
    iconsContainer.appendChild(taskEnd);

    li.appendChild(taskContent);
    li.appendChild(iconsContainer);
    taskList.appendChild(li);
  }

  form.reset();
  form.style.display = "none";
  applyFilter();
});

// Filtres : tous, en cours, terminés
filterSelect.addEventListener("change", applyFilter);

function applyFilter() {
  const selectedFilter = filterSelect.value;
  const tasks = document.querySelectorAll("#taskList li");

  tasks.forEach((task) => {
    if (selectedFilter === "all" || task.dataset.status === selectedFilter) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}
