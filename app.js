const onClickOpenForm = document.getElementById("onClickOpenForm");
const form = document.getElementById("form");
const submitForm = document.getElementById("submitForm");
const closeForm = document.getElementById("closeForm");
const filterSelect = document.querySelector(".filter-list");

let taskEdited = null;

// Affiche le formulaire
// Quand on clique sur le bouton (+), le formulaire apparaît
onClickOpenForm.addEventListener("click", function () {
  form.style.display = "grid";
});

// Ferme et réinitialise le formulaire
// Quand on clique sur fermer, on cache le formulaire et on vide les infos
closeForm.addEventListener("click", function () {
  form.style.display = "none";
  form.reset();
});

// Au clique sur le bouton "Ajouter la tâche" empêche la page de recharger
// On récupère les infos, on vérifie que les champs sont remplis et on ajoute ou modifie la tâche
submitForm.addEventListener("click", function (event) {
  event.preventDefault();

  const formElement = document.getElementById("form");
  if (!formElement.checkValidity()) {
    return formElement.reportValidity();
  }

  const titleForm = document.getElementById("title-form").value;
  const descriptionForm = document.getElementById("description-form").value;
  const dateForm = document.getElementById("deadline-form").value;
  const priorityForm = document.getElementById("priority-form").value;

  // modifie le format de la date en format français
  const dateParts = dateForm.split("-");
  const frenchDate = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];

  // Si on modifie une tâche, on met à jour les infos
  if (taskEdited) {
    const taskContent = taskEdited.querySelector(".task-content");
    const iconsContainer = taskEdited.querySelector(".icons-container");

    const paragraphs = taskContent.querySelectorAll("p");
    paragraphs[0].innerHTML = "<strong>" + titleForm + "</strong>";
    paragraphs[1].textContent = descriptionForm;
    paragraphs[2].textContent = frenchDate;

    // Je supprime l'ancienne icône de priorité
    const oldIcon = iconsContainer.querySelector(".priority-icon");
    if (oldIcon) {
      oldIcon.remove();
    }

    // Je crée une nouvelle icône pour la priorité
    const newPriorityIcon = document.createElement("ion-icon");
    newPriorityIcon.setAttribute("name", "ellipse");
    newPriorityIcon.classList.add("priority-icon");
    newPriorityIcon.classList.add("priority-" + priorityForm);
    newPriorityIcon.dataset.priority = priorityForm;

    iconsContainer.prepend(newPriorityIcon);

    submitForm.textContent = "Ajouter la tâche";
    taskEdited = null;
    // Sinon on crée une nouvelle tâche avec les infos du formulaire
  } else {
    createTaskElement({
      title: titleForm,
      description: descriptionForm,
      date: frenchDate,
      priority: priorityForm,
      status: "in-progress",
    });
  }

  // On vide le formulaire et on le cache
  form.reset();
  form.style.display = "none";
  applyFilter();
  saveTasks();
});

// Filtres : tous, en cours, terminés
// Quand on change le filtre on applique le filtre
filterSelect.addEventListener("change", function () {
  applyFilter();
});

function applyFilter() {
  // Je récupère la valeur du filtre choisi
  const selectedFilter = filterSelect.value;
  const tasks = document.querySelectorAll("#taskList li");

  // Je boucle sur toutes les tâches pour afficher ou cacher selon le filtre
  tasks.forEach(function (task) {
    if (selectedFilter === "all" || task.dataset.status === selectedFilter) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}

function createTaskElement(task) {
  const li = document.createElement("li");
  const taskList = document.getElementById("taskList");
  li.dataset.status = task.status;

  // On crée un conteneur pour le contenu de la tâche
  const taskContent = document.createElement("div");
  taskContent.classList.add("task-content");

  // Puis on ajoute chaque info dans un <p> séparé
  const titleEl = document.createElement("p");
  titleEl.innerHTML = "<strong>" + task.title + "</strong>";

  const descriptionEl = document.createElement("p");
  descriptionEl.textContent = task.description;

  const dateEl = document.createElement("p");
  dateEl.textContent = task.date;

  // Ajout des <p> dans le conteneur
  taskContent.appendChild(titleEl);
  taskContent.appendChild(descriptionEl);
  taskContent.appendChild(dateEl);

  const iconsContainer = document.createElement("div");
  iconsContainer.classList.add("icons-container");

  // Icône de priorité qui change de couleur selon la priorité
  const priorityIcon = document.createElement("ion-icon");
  priorityIcon.setAttribute("name", "ellipse");
  priorityIcon.classList.add("priority-icon");
  priorityIcon.classList.add("priority-" + task.priority);
  priorityIcon.dataset.priority = task.priority;

  // Icône pour supprimer la tâche
  const deleteIcon = document.createElement("ion-icon");
  deleteIcon.setAttribute("name", "trash-outline");
  deleteIcon.style.cursor = "pointer";
  deleteIcon.title = "Supprimer";

  // Icône pour modifier la tâche
  const editIcon = document.createElement("ion-icon");
  editIcon.setAttribute("name", "create-outline");
  editIcon.style.cursor = "pointer";
  editIcon.title = "Modifier la tâche";

  // Icône pour marquer la tâche comme terminée ou non
  const taskEnd = document.createElement("ion-icon");
  if (task.status === "finished") {
    taskEnd.setAttribute("name", "refresh-outline");
  } else {
    taskEnd.setAttribute("name", "checkmark-done-outline");
  }
  taskEnd.style.cursor = "pointer";
  taskEnd.title =
    task.status === "finished" ? "Remettre en cours" : "Marquer comme terminée";

  // Quand on clique sur modifier, on remplit le formulaire avec les infos existantes
  editIcon.addEventListener("click", function () {
    const titleText = titleEl.querySelector("strong")?.innerText || "";
    const descText = descriptionEl.innerText || "";
    const dateText = dateEl.innerText || "";

    const parts = dateText.split("/");
    const isoDate = parts[2] + "-" + parts[1] + "-" + parts[0];

    document.getElementById("title-form").value = titleText;
    document.getElementById("description-form").value = descText;
    document.getElementById("deadline-form").value = isoDate;

    const priorityValue = priorityIcon.dataset.priority || "basse";
    document.getElementById("priority-form").value = priorityValue;

    form.style.display = "grid";
    submitForm.textContent = "Enregistrer";
    taskEdited = li;
  });

  // Clique sur l’icône pour basculer entre tâche terminée et en cours.
  // Met à jour le style et le stockage
  taskEnd.addEventListener("click", function () {
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

    saveTasks();
    applyFilter();
  });

  // Quand on clique sur la poubelle, on supprime la tâche
  deleteIcon.addEventListener("click", function () {
    li.remove();
    saveTasks();
  });

  iconsContainer.appendChild(priorityIcon);
  iconsContainer.appendChild(deleteIcon);
  iconsContainer.appendChild(editIcon);
  iconsContainer.appendChild(taskEnd);

  li.appendChild(taskContent);
  li.appendChild(iconsContainer);

  if (task.status === "finished") {
    li.classList.add("task-finished");
  }

  taskList.appendChild(li);
}

// ****** PARTIE BONUS ****** //
// Sauvegarde les tâches dans localStorage
// On stocke toutes les tâches dans le navigateur pour garder même après rechargement
function saveTasks() {
  const tasks = [];
  const lis = document.querySelectorAll("#taskList li");

  lis.forEach(function (li) {
    const title = li.querySelector(".task-content p strong")?.innerText || "";
    const paragraphs = li.querySelectorAll(".task-content p");
    const description = paragraphs[1]?.innerText || "";
    const date = paragraphs[2]?.innerText || "";
    const priorityIcon = li.querySelector(".priority-icon");
    const priority = priorityIcon?.dataset.priority || "basse";
    const status = li.dataset.status;

    tasks.push({ title, description, date, priority, status });
  });

  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// Recharge les tâches depuis localStorage
// Au lancement, on récupère les tâches sauvegardées et on les affiche
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("myTasks") || "[]");

  savedTasks.forEach(function (task) {
    createTaskElement(task);
  });

  applyFilter();
}

loadTasks();
