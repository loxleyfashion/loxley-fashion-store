// ============================
// Loxley Fashion Main JS
// ============================

// 🔹 CLEAN IMAGE URL
function cleanImage(url) {
  if (!url) return "";
  return url
    .replace(/\r?\n|\r/g, "")       // remove line breaks
    .trim()                         // remove spaces
    .replace(/^"+|"+$/g, "")        // remove quotes
    .replace(/\.jpg\.jpg$/i, ".jpg")
    .replace(/\.png\.png$/i, ".png");
}

// ============================
// FETCH PRODUCTS FROM GOOGLE SHEET
// ============================
async function getProducts() {
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRP0BOsRW5H8ddhTP_rWI6r1-zFlKKzcXb0GS80Okit145N07tzJ0K_oR274zycv1ZFz8s9I2ldplrq/pub?output=csv";

  const response = await fetch(sheetURL);
  const data = await response.text();

  const rows = data.split("\n").slice(1); // skip header

  return rows.map(row => {
    const cols = row.split(",");

    return {
      id: cols[0]?.trim(),
      name: cols[1]?.trim(),
      price: cols[2]?.trim(),
      images: cols
        .slice(3)
        .map(img => cleanImage(img))
        .filter(Boolean)
    };
  });
}

// ============================
// LOAD PRODUCTS ON SHOP PAGE
// ============================
async function loadShopProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const products = await getProducts();
  grid.innerHTML = "";

  products.forEach(product => {
    if (!product.images.length) return;

    const card = document.createElement("a");
    card.href = `product.html?id=${product.id}`;
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <h3>${product.name}</h3>
        <span>₹${product.price}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ============================
// PRODUCT PAGE LOAD
// ============================
async function loadProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  const products = await getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Set product details
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `₹${product.price}`;
  document.getElementById("formProduct").value = product.name;
  document.getElementById("formPrice").value = product.price;

  // Load images into carousel
  const carousel = document.getElementById("productCarousel");
  carousel.innerHTML = "";
  product.images.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = product.name;
    img.loading = "lazy";
    if (index === 0) img.classList.add("active");
    img.onerror = () => {
      img.src = "images/placeholder.jpg";
    };
    carousel.appendChild(img);
  });

  // ============================
  // CAROUSEL FUNCTIONALITY
  // ============================
  let currentIndex = 0;
  const prevBtn = document.getElementById("prevImg");
  const nextBtn = document.getElementById("nextImg");

  function showImage(index) {
    const imgs = carousel.querySelectorAll("img");
    imgs.forEach((img, i) => img.classList.toggle("active", i === index));
  }

  prevBtn.addEventListener("click", () => {
    const imgs = carousel.querySelectorAll("img");
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    showImage(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    const imgs = carousel.querySelectorAll("img");
    currentIndex = (currentIndex + 1) % imgs.length;
    showImage(currentIndex);
  });

  // Default first image
  showImage(0);

  // ============================
  // SIZE SELECTION
  // ============================
  const sizes = ["S", "M", "L", "XL"];
  const sizeContainer = document.getElementById("sizeContainer");
  sizeContainer.innerHTML = "";

  sizes.forEach(size => {
    const span = document.createElement("span");
    span.className = "size";
    span.textContent = size;

    span.addEventListener("click", () => {
      document.querySelectorAll(".size").forEach(s =>
        s.classList.remove("active")
      );
      span.classList.add("active");
      document.getElementById("formSize").value = size;
    });

    sizeContainer.appendChild(span);
  });

  // Select default size
  sizeContainer.querySelector(".size")?.click();
}

// ============================
// GOOGLE FORM ORDER SUBMIT
// ============================
function setupOrderForm() {
  const form = document.getElementById("orderForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const data = new FormData();
    data.append("entry.2094167033", form.name.value);
    data.append("entry.1365619003", form.phone.value);
    data.append("entry.433871083", form.product.value);
    data.append("entry.2006505239", form.size.value);
    data.append("entry.1455588550", form.price.value);
    data.append("entry.74629137", form.address.value);
    data.append("entry.95104987", form.city.value || "");

    fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLScKUjwd3C46jdW_NDOFTzc1Lobiy2_trqGuc1izN1Y8aMdi6Q/formResponse",
      {
        method: "POST",
        mode: "no-cors",
        body: data
      }
    ).then(() => {
      window.location.href = "success.html";
    });
  });
}

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", () => {
  loadShopProducts();
  loadProductPage();
  setupOrderForm();
});
