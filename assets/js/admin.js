/**
 * EMİRCAN KAYDU - DİALOG CADDE ADMIN PANELİ
 * Tüm fonksiyonlar ve açıklamalarıyla birlikte
 */

// 1. DEĞİŞKENLER ve YAPILANDIRMA
const ADMIN_PASSWORD = "admin123"; // Basit şifre (production'da daha güvenli yöntem kullanın)
let isEditing = false;
let currentEditId = null;

// 2. SAYFA YÜKLENDİĞİNDE ÇALIŞACAK KODLAR
document.addEventListener("DOMContentLoaded", function () {
  checkLoginStatus();
  setupEventListeners();
  loadProperties();
});

// 3. TEMEL FONKSİYONLAR

// Giriş durumunu kontrol et
function checkLoginStatus() {
  if (localStorage.getItem("adminLoggedIn") === "true") {
    showAdminPanel();
  } else {
    showLoginSection();
  }
}

// Event listener'ları kur
function setupEventListeners() {
  // Giriş butonu
  document.getElementById("loginBtn").addEventListener("click", login);

  // İlan formu
  document
    .getElementById("propertyForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (isEditing) {
        updateProperty();
      } else {
        saveProperty();
      }
    });

  // Vazgeç butonu (opsiyonel)
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", resetForm);
  }
}

// 4. GİRİŞ/KAYIT İŞLEMLERİ

function login() {
  const password = document.getElementById("adminPass").value;

  if (password === ADMIN_PASSWORD) {
    localStorage.setItem("adminLoggedIn", "true");
    showAdminPanel();
  } else {
    alert("Hatalı şifre! Varsayılan şifre: " + ADMIN_PASSWORD);
  }
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  showLoginSection();
}

// 5. PANEL GÖSTERİM FONKSİYONLARI

function showLoginSection() {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("adminPanel").style.display = "none";
  document.getElementById("adminPass").value = "";
}

function showAdminPanel() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
}

// 6. İLAN YÖNETİM FONKSİYONLARI

function loadProperties() {
  const properties = PropertyManager.getProperties();
  const tbody = document.getElementById("propertiesList");
  tbody.innerHTML = "";

  properties.forEach((property) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${property.title}</td>
            <td>${property.location}</td>
            <td>${property.type}</td>
            <td>${property.price}</td>
            <td>
                <button onclick="startEdit(${property.id})" class="edit-btn">Düzenle</button>
                <button onclick="deleteProperty(${property.id})" class="delete-btn">Sil</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

function saveProperty() {
  const newProperty = {
    id: Date.now(),
    title: document.getElementById("title").value,
    location: document.getElementById("location").value,
    type: document.getElementById("type").value,
    price: document.getElementById("price").value,
    image:
      document.getElementById("image").value || "assets/images/default.jpg",
  };

  const properties = PropertyManager.getProperties();
  properties.push(newProperty);
  PropertyManager.saveProperties(properties);

  showSuccess("İlan başarıyla eklendi!");
  resetForm();
  loadProperties();
}

function startEdit(id) {
  const properties = PropertyManager.getProperties();
  const property = properties.find((p) => p.id === id);

  if (!property) return;

  // Formu doldur
  document.getElementById("title").value = property.title;
  document.getElementById("location").value = property.location;
  document.getElementById("type").value = property.type;
  document.getElementById("price").value = property.price;
  document.getElementById("image").value = property.image;

  // Düzenleme moduna geç
  isEditing = true;
  currentEditId = id;
  document.getElementById("formTitle").textContent = "İlanı Düzenle";
  document.getElementById("submitBtn").textContent = "Güncelle";
}

function updateProperty() {
  const properties = PropertyManager.getProperties();
  const index = properties.findIndex((p) => p.id === currentEditId);

  if (index === -1) return;

  properties[index] = {
    id: currentEditId,
    title: document.getElementById("title").value,
    location: document.getElementById("location").value,
    type: document.getElementById("type").value,
    price: document.getElementById("price").value,
    image:
      document.getElementById("image").value || "assets/images/default.jpg",
  };

  PropertyManager.saveProperties(properties);

  showSuccess("İlan başarıyla güncellendi!");
  cancelEdit();
  loadProperties();
}

function deleteProperty(id) {
  if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;

  let properties = PropertyManager.getProperties();
  properties = properties.filter((property) => property.id !== id);

  PropertyManager.saveProperties(properties);
  showSuccess("İlan silindi!");
  loadProperties();
}

// 7. YARDIMCI FONKSİYONLAR

function resetForm() {
  document.getElementById("propertyForm").reset();
  document.getElementById("formTitle").textContent = "Yeni İlan Ekle";
  document.getElementById("submitBtn").textContent = "Kaydet";
}

function cancelEdit() {
  isEditing = false;
  currentEditId = null;
  resetForm();
}

function showSuccess(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert success";
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// 8. PropertyManager BAĞLANTISI
// Not: properties.js dosyasında tanımlı olmalı
if (typeof PropertyManager === "undefined") {
  console.error("PropertyManager tanımlı değil! properties.js yüklenmedi mi?");
}
