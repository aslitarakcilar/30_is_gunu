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

  // Sol taraf: görev metni ve tarih için kapsayıcı
  const contentWrapper = document.createElement("div");
  contentWrapper.style.display = "flex";
  contentWrapper.style.flexDirection = "column";

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

  // Sol kapsayıcıya ekle
  contentWrapper.appendChild(taskSpan);
  contentWrapper.appendChild(dateSpan);

  // Silme butonu (sağ taraf)
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = "🗑";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // li'ye tıklanmasını engelle
    li.remove();
    saveTasks();
  });

  // Tamamlandıysa class ekle
  if (completed) li.classList.add("completed");

  // Tıklanırsa tamamlandı olarak işaretle
  li.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
  });

  // HTML yapısına yerleştir: solda içerik, sağda silme butonu
  li.appendChild(contentWrapper);
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
  function filterTasks(type) {
  const tasks = document.querySelectorAll("#taskList li");
  tasks.forEach((task) => {
    const isCompleted = task.classList.contains("completed");

    if (type === "all") {
      task.style.display = "flex";
    } else if (type === "completed" && isCompleted) {
      task.style.display = "flex";
    } else if (type === "incomplete" && !isCompleted) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}

});
