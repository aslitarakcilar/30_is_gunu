// Sayfa yüklendiğinde görevleri yükle
window.onload = function () {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach((task) => {
    createTaskElement(task.text, task.completed, task.date);
  });
  updateStats();
  updateChart(); // 📊 Sayfa açıldığında grafik güncelle
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

  // Animasyon ekle
  li.classList.add("task-enter");
  setTimeout(() => {
    li.classList.add("task-enter-active");
  }, 10);
  setTimeout(() => {
    li.classList.remove("task-enter");
    li.classList.remove("task-enter-active");
  }, 300);

  // Görev içeriği sarmalayıcısı
  const contentWrapper = document.createElement("div");
  contentWrapper.style.display = "flex";
  contentWrapper.style.flexDirection = "column";

  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;

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

  contentWrapper.appendChild(taskSpan);
  contentWrapper.appendChild(dateSpan);

  // Silme butonu
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = "🗑";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // li'ye tıklanmasını engelle
    li.remove();
    saveTasks();
  });

  if (completed) li.classList.add("completed");

  li.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
    updateStats();
    updateChart(); // ✅ Görev tamamlandığında grafik güncelle
  });

  li.appendChild(contentWrapper);
  li.appendChild(deleteBtn);
  document.getElementById("taskList").appendChild(li);

  updateStats();
  updateChart(); // ✅ Yeni görev eklendiğinde grafik güncelle
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
  updateStats();
  updateChart(); // ✅ Kaydettikten sonra grafik güncelle
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

  // ayrıca tamamlanan sayısını ayrı ID'den gösteriyorsan:
  const completedSpan = document.getElementById("completedCount");
  if (completedSpan) {
    completedSpan.textContent = completed;
  }
}

// 📊 Chart.js ile görev grafiğini güncelle
function updateChart() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completed = tasks.filter(t => t.completed).length;
  const uncompleted = tasks.length - completed;

  const ctx = document.getElementById("taskChart").getContext("2d");
  if (window.taskChartInstance) {
    window.taskChartInstance.destroy(); // Eski grafik varsa sil
  }

  window.taskChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Tamamlanan", "Kalan"],
      datasets: [{
        label: "Görev Sayısı",
        data: [completed, uncompleted],
        backgroundColor: ["#66bb6a", "#ef5350"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// 🔍 Filtreleme fonksiyonu (isteğe bağlı)
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
