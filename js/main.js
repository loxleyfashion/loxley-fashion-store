let currentSlide = 0;

// ================= IMAGE CLEAN =================
function cleanImage(url) {
  return url
    .replace(/\r?\n|\r/g, "")
    .trim()
    .replace(/\.jpg\.jpg$/i, ".jpg")
    .replace(/\.png\.png$/i, ".png");
}

// ================= CSV PARSER =================
function parseCSVRow(row) {
  return row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
}

// ================= FETCH PRODUCTS =================
async function getProducts() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRP0BOsRW5H8ddhTP_rWI6r1-zFlKKzcXb0GS80Okit145N07tzJ0K_oR274zycv1ZFz8s9I2ldplrq/pub?output=csv";
  const res = await fetch(url);
  const text = await res.text();
  const rows = text.split("\n").slice(1);

  return rows.map(r => {
    const c = parseCSVRow(r);
    return {
      id: c[0],
      name: c[1],
      price: c[2],
      images: c.slice(3).map(cleanImage).filter(i => i.startsWith("http"))
    };
  });
}

// ================= LOAD PRODUCT PAGE =================
async function loadProductPage() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  const products = await getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = "₹" + product.price;
  document.getElementById("formProduct").value = product.name;
  document.getElementById("formPrice").value = product.price;

  const carousel = document.getElementById("productCarousel");
  carousel.innerHTML = "";

  product.images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    if (i === 0) img.classList.add("active");
    carousel.appendChild(img);
  });

  setupCarousel();
  setupSizes();
}

// ================= CAROUSEL LOGIC =================
function setupCarousel() {
  const images = document.querySelectorAll("#productCarousel img");
  if (!images.length) return;

  document.getElementById("nextBtn").onclick = () => {
    images[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % images.length;
    images[currentSlide].classList.add("active");
  };

  document.getElementById("prevBtn").onclick = () => {
    images[currentSlide].classList.remove("active");
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    images[currentSlide].classList.add("active");
  };
}

// ================= SIZE =================
function setupSizes() {
  const sizes = ["S", "M", "L", "XL"];
  const box = document.getElementById("sizeContainer");
  box.innerHTML = "";

  sizes.forEach(size => {
    const s = document.createElement("span");
    s.className = "size";
    s.textContent = size;
    s.onclick = () => {
      document.querySelectorAll(".size").forEach(x => x.classList.remove("active"));
      s.classList.add("active");
      document.getElementById("formSize").value = size;
    };
    box.appendChild(s);
  });

  box.firstChild.click();
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadProductPage);
