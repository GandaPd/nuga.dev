// Nilai DOM dideklarasikan di awal agar browser tidak mendata ulang setiap kali scroll
const header = document.querySelector("header");
const toTop = document.querySelector("#to-top");
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");
const darkToggle = document.querySelector("#dark-toggle");
const html = document.querySelector("html");

// Jarak offset header dari atas dokumen
const fixedNav = header.offsetTop;

// 1. Navbar Fixed & Back to Top
window.onscroll = function () {
  // Menggunakan window.scrollY sebagai standar modern pengganti pageYOffset
  if (window.scrollY > fixedNav) {
    header.classList.add("navbar-fixed");
    toTop.classList.remove("hidden");
    toTop.classList.add("flex");
  } else {
    header.classList.remove("navbar-fixed");
    toTop.classList.remove("flex");
    toTop.classList.add("hidden");
  }
};

// 2. Hamburger Menu Toggle
hamburger.addEventListener("click", function (e) {
  // Mencegah bubbling agar tidak langsung memicu event klik window di bawah
  e.stopPropagation();
  hamburger.classList.toggle("hamburger-active");
  navMenu.classList.toggle("hidden");
});

// 3. Klik di luar hamburger & menu untuk menutup (Menggunakan metode .contains agar lebih aman)
window.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    hamburger.classList.remove("hamburger-active");
    navMenu.classList.add("hidden");
  }
});

// 4. Darkmode Toggle Event
darkToggle.addEventListener("click", function () {
  if (darkToggle.checked) {
    html.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    html.classList.remove("dark");
    localStorage.theme = "light";
  }
});

// 5. Sinkronisasi Posisi Toggle & Tema saat Halaman Dimuat
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  darkToggle.checked = true;
  html.classList.add("dark"); // Memastikan class dark langsung aktif di html jika kondisinya terpenuhi
} else {
  darkToggle.checked = false;
  html.classList.remove("dark");
}

// 6. Integrasi Form Kontak ke Email via Web3Forms + Notifikasi
const contactForm = document.querySelector("#contact-form");
const formResult = document.querySelector("#form-result");
const btnSubmit = document.querySelector("#btn-submit");

if (contactForm && formResult) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah reload halaman

    // Mengubah text tombol saat loading
    btnSubmit.innerText = "Mengirim...";
    btnSubmit.disabled = true;

    const formData = new FormData(contactForm);

    // Mengonversi data form menjadi JSON
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Mengirim data ke API Web3Forms di latar belakang
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(async (response) => {
        let res = await response.json();
        if (response.status == 200) {
          // JIKA SUKSES: Tampilkan notifikasi hijau
          formResult.classList.remove(
            "hidden",
            "bg-red-500/20",
            "text-red-600",
          );
          formResult.classList.add(
            "bg-emerald-500/20",
            "text-emerald-600",
            "dark:text-emerald-400",
          );
          formResult.innerText = "Terima kasih! Pesan Anda berhasil dikirim.";
          contactForm.reset(); // Mengosongkan form kembali
        } else {
          // JIKA GAGAL DARI SERVER: Tampilkan pesan error
          formResult.classList.remove(
            "hidden",
            "bg-emerald-500/20",
            "text-emerald-600",
          );
          formResult.classList.add(
            "bg-red-500/20",
            "text-red-600",
            "dark:text-red-400",
          );
          formResult.innerText = res.message;
        }
      })
      .catch((error) => {
        // JIKA GAGAL JARINGAN
        formResult.classList.remove(
          "hidden",
          "bg-emerald-500/20",
          "text-emerald-600",
        );
        formResult.classList.add(
          "bg-red-500/20",
          "text-red-600",
          "dark:text-red-400",
        );
        formResult.innerText =
          "Oops! Terjadi kesalahan jaringan. Coba lagi nanti.";
      })
      .then(() => {
        // Mengembalikan status tombol utama setelah proses selesai
        btnSubmit.innerText = "Kirim Pesan";
        btnSubmit.disabled = false;

        // Sembunyikan notifikasi otomatis setelah 5 detik
        setTimeout(() => {
          formResult.classList.add("hidden");
        }, 5000);
      });
  });
}
