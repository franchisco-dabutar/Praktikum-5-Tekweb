const hasilEl = document.getElementById("hasil");
const ekspresiEl = document.getElementById("ekspresi");

const simbol = { "+": "+", "-": "−", "*": "×", "/": "÷" };

let sekarang = "0";     // angka yang sedang diketik
let sebelumnya = null;  // angka pertama
let operator = null;    // operasi yang dipilih
let timpa = false;      // true = angka berikutnya menimpa layar
let error = false;

function tampilkan() {
  hasilEl.classList.remove("error");
  if (error) {
    hasilEl.textContent = "Tidak bisa dibagi nol";
    hasilEl.classList.add("error");
    return;
  }
  hasilEl.textContent = sekarang.replace(".", ",");
  hasilEl.classList.toggle("kecil", sekarang.length > 10);
}

function hitung(a, b, op) {
  let hasil;
  if (op === "+") hasil = a + b;
  if (op === "-") hasil = a - b;
  if (op === "*") hasil = a * b;
  if (op === "/") {
    if (b === 0) return null;
    hasil = a / b;
  }
  return parseFloat(hasil.toFixed(10));
}

function format(angka) {
  return String(angka).replace(".", ",");
}

function resetSemua() {
  sekarang = "0";
  sebelumnya = null;
  operator = null;
  timpa = false;
  error = false;
  ekspresiEl.textContent = "";
}

function tekanAngka(digit) {
  if (error) resetSemua();
  if (timpa || sekarang === "0") {
    sekarang = digit;
    timpa = false;
  } else if (sekarang.length < 15) {
    sekarang += digit;
  }
  tampilkan();
}

function tekanKoma() {
  if (error) resetSemua();
  if (timpa) {
    sekarang = "0.";
    timpa = false;
  } else if (!sekarang.includes(".")) {
    sekarang += ".";
  }
  tampilkan();
}

function tekanOperator(op) {
  if (error) return;

  // Ganti operator kalau belum mengetik angka kedua
  if (operator !== null && timpa) {
    operator = op;
    ekspresiEl.textContent = format(sebelumnya) + " " + simbol[op];
    return;
  }

  // Hitung dulu kalau sudah ada operasi sebelumnya (contoh: 2 + 3 +)
  if (operator !== null) {
    const hasil = hitung(sebelumnya, parseFloat(sekarang), operator);
    if (hasil === null) {
      error = true;
      ekspresiEl.textContent = "";
      tampilkan();
      return;
    }
    sebelumnya = hasil;
    sekarang = String(hasil);
  } else {
    sebelumnya = parseFloat(sekarang);
  }

  operator = op;
  timpa = true;
  ekspresiEl.textContent = format(sebelumnya) + " " + simbol[op];
  tampilkan();
}

function tekanSama() {
  if (error || operator === null) return;

  const b = parseFloat(sekarang);
  const hasil = hitung(sebelumnya, b, operator);

  if (hasil === null) {
    error = true;
    ekspresiEl.textContent = "";
    tampilkan();
    return;
  }

  ekspresiEl.textContent = format(sebelumnya) + " " + simbol[operator] + " " + format(b) + " =";
  sekarang = String(hasil);
  sebelumnya = null;
  operator = null;
  timpa = true;
  tampilkan();
}

function tekanHapus() {
  if (error) { resetSemua(); tampilkan(); return; }
  if (timpa) return;
  sekarang = sekarang.slice(0, -1);
  if (sekarang === "" || sekarang === "-") sekarang = "0";
  tampilkan();
}

function tekanPersen() {
  if (error) return;
  sekarang = String(parseFloat((parseFloat(sekarang) / 100).toFixed(10)));
  tampilkan();
}

function tekanTanda() {
  if (error || sekarang === "0") return;
  sekarang = sekarang.startsWith("-") ? sekarang.slice(1) : "-" + sekarang;
  tampilkan();
}

// Menghubungkan semua tombol
document.querySelectorAll("button").forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (btn.dataset.angka !== undefined) tekanAngka(btn.dataset.angka);
    else if (btn.dataset.operasi) tekanOperator(btn.dataset.operasi);
    else if (btn.dataset.aksi === "koma") tekanKoma();
    else if (btn.dataset.aksi === "sama") tekanSama();
    else if (btn.dataset.aksi === "hapus") tekanHapus();
    else if (btn.dataset.aksi === "persen") tekanPersen();
    else if (btn.dataset.aksi === "tanda") tekanTanda();
    else if (btn.dataset.aksi === "clear") { resetSemua(); tampilkan(); }
  });
});

// Dukungan keyboard
document.addEventListener("keydown", function (e) {
  if (e.key >= "0" && e.key <= "9") tekanAngka(e.key);
  else if (e.key === "." || e.key === ",") tekanKoma();
  else if ("+-*/".includes(e.key)) tekanOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); tekanSama(); }
  else if (e.key === "Backspace") tekanHapus();
  else if (e.key === "Escape") { resetSemua(); tampilkan(); }
});