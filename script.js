// Sayfa yüklendiğinde görevleri yükle
window.onload = function () {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach((task) => {
    createTaskElement(task.text, task.completed, task.date);
  });
  updateStats();
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

// Görev öğesi oluşturma
function createTaskElement(text, completed, dateText = null) {
  const li = document.createElement("li");

  // Görev içeriği sarmalayıcısı
  const contentWrapper = document.createElement("div");
  contentWrapper.style.display = "flex";
  contentWrapper.style.flexDirection = "column";

  // Görev metni
  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;

  // Görev tarihi
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

  // Görev içeriğini sarmalayıcıya ekle
  contentWrapper.appendChild(taskSpan);
  contentWrapper.appendChild(dateSpan);

  // Silme butonu
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = "🗑";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // li tıklamasını tetiklemesin
    li.remove();
    saveTasks();
  });

  // Görev tamamlandıysa stilini uygula
  if (completed) li.classList.add("completed");

  // Tamamlandı durumunu değiştirme
  li.addEventListener("click", function () {
  li.classList.toggle("completed");
  saveTasks();
  updateStats(); // 👈 Burası eksikse tamamlanan sayısı güncellenmez
});


  // Görev elemanlarını birleştir
  li.appendChild(contentWrapper);
  li.appendChild(deleteBtn);
  document.getElementById("taskList").appendChild(li);

  updateStats(); // görev eklenince istatistik güncelle
}

// Görevleri localStorage’a kaydet
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    const taskText = li.querySelector("span").textContent.trim();
    const taskDate = li.querySelector("small").textContent.trim();
    tasks.push({
      text: taskText,
      completed: li.classList.contains("completed"),
      date: taskDate,
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateStats(); // her kayıttan sonra istatistik güncelle
}

// Enter tuşu ile görev ekleme
document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Görev istatistiklerini güncelle (tamamlanan / toplam)
function updateStats() {
  const total = document.querySelectorAll("#taskList li").length;
  const completed = document.querySelectorAll("#taskList li.completed").length;
  const stats = document.getElementById("task-stats");

  if (stats) {
    stats.textContent = `✔️ Tamamlanan: ${completed} / Toplam: ${total}`;
  }
}

// Filtreleme fonksiyonu
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
