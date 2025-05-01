// Sayfa yüklendiğinde görevleri yükle
window.onload = function () {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  storedTasks.forEach((task) => {
    createTaskElement(task.text, task.completed, task.date);
  });
};

// Görev ekleme fonksiyonu
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  createTaskElement(taskText, false);
  taskInput.value = "";

  saveTasks();
}

// Görev öğesi oluşturma fonksiyonu
function createTaskElement(text, completed, dateText = null) {
  const li = document.createElement("li");

  // Görev metni
  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;

  // Tarih bilgisi
  const dateSpan = document.createElement("small");
  dateSpan.classList.add("date");

  if (dateText) {
    dateSpan.textContent = dateText;
  } else {
    const now = new Date();
    dateSpan.textContent = now.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Tamamlandıysa class ekle
  if (completed) li.classList.add("completed");

  // Tıklanırsa tamamlandı olarak işaretle
  li.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
  });

  // Silme butonu
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = "🗑";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // li'ye tıklanmasını engelle
    li.remove();
    saveTasks();
  });

  // HTML yapısına yerleştir
  li.appendChild(taskSpan);
  li.appendChild(dateSpan);
  li.appendChild(deleteBtn);
  document.getElementById("taskList").appendChild(li);
}

// Görevleri kaydet
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach((li) => {
    const taskText = li.querySelector("span").textContent.trim();
    const taskDate = li.querySelector("small").textContent.trim();
    tasks.push({
      text: taskText,
      completed: li.classList.contains("completed"),
      date: taskDate,
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Enter tuşuyla görev ekleme
document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});
