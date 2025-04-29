// Görevleri yükle
window.onload = function () {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  storedTasks.forEach((task) => {
    createTaskElement(task.text, task.completed);
  });
};

// Görev ekleme
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  createTaskElement(taskText, false);
  taskInput.value = "";

  saveTasks();
}

// Görev elemanı oluşturma
function createTaskElement(text, completed) {
  const li = document.createElement("li");
  li.textContent = text;
  if (completed) li.classList.add("completed");

  // Tamamlama
  li.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
  });

  // Silme
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = "🗑";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    li.remove();
    saveTasks();
  });

  li.appendChild(deleteBtn);
  document.getElementById("taskList").appendChild(li);
}

// localStorage’a görevleri kaydet
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.firstChild.textContent.trim(),
      completed: li.classList.contains("completed"),
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Enter tuşu ile ekleme
document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});
