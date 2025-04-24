function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  const li = document.createElement("li");
  li.textContent = taskText;

  // ✅ Görev tamamlandı tıklama
  li.addEventListener("click", function () {
    li.classList.toggle("completed");
  });

  // 🗑 Silme butonu oluştur
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = "🗑";
  deleteBtn.classList.add("delete-btn");

  // Silme butonuna tıklanınca liste öğesini sil
  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // li'ye tıklama olayını engelle
    li.remove();
  });

  li.appendChild(deleteBtn);
  document.getElementById("taskList").appendChild(li);
  taskInput.value = "";
}
