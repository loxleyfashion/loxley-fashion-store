// ============================
// Loxley Fashion Main JS (FIXED)
// ============================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRP0BOsRW5H8ddhTP_rWI6r1-zFlKKzcXb0GS80Okit145N07tzJ0K_oR274zycv1ZFz8s9I2ldplrq/pub?output=csv";

// ============================
// CLEAN IMAGE URL
// ============================
function cleanImage(url) {
  if (!url) return "";
  return url
    .trim()
    .replace(/^"+|"+$/g, "")   // remove quotes
    .replace(/\.jpg\.jpg$/i, ".jpg")
    .replace(/\.png\.png$/i, ".png");
}

// ============================
// FETCH PRODUCTS
// ============================
async function getProducts() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();
  const rows = text.split("\n").slice(1);

  return rows
    .map(row => {
      const cols = row.split(",");

      const images = cols
        .slice(3)
        .map(cleanImage)
        .filter(img => img.startsWith("http"));

      return {
        id: cols[0]?.trim(),
        name: cols[1]?.trim(),
        price: cols[2]?.trim(),
        images
      };
    })
    .filter(p => p.id && p.name);
}

// ============================
// LOAD SHOP PAGE
// ============================
async function loadShopProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const products = await getProducts();
  grid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("a");
    card.href = `product.html?id=${product.id}`;
    card.className = "product-card";

    const imgSrc = product.images[0] || "images/placeholder.jpg";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" loading="lazy">
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
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) return;

  const products = await getProducts();
  const product = products.find(p => p.id === productId);

  if (!product) return;

  // Product info
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `₹${product.price}`;
  document.getElementById("formProduct").value = product.name;
  document.getElementById("formPrice").value = product.price;

  // Images
  const imageContainer = document.getElementById("productImages");
  imageContainer.innerHTML = "";

  (product.images.length ? product.images : ["images/placeholder.jpg"])
    .forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      if (i === 0) img.classList.add("active");
      img.onerror = () => (img.src = "images/placeholder.jpg");
      imageContainer.appendChild(img);
    });

  // Sizes
  const sizes = ["S", "M", "L", "XL"];
  const sizeContainer = document.getElementById("sizeContainer");

  sizes.forEach(size => {
    const s = document.createElement("span");
    s.className = "size";
    s.textContent = size;
    s.onclick = () => {
      document.querySelectorAll(".size").forEach(x => x.classList.remove("active"));
      s.classList.add("active");
      document.getElementById("formSize").value = size;
    };
    sizeContainer.appendChild(s);
  });

  document.querySelector(".size")?.click();

  // ============================
  // GOOGLE FORM SUBMIT
  // ============================
  const form = document.getElementById("orderForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const data = new FormData(form);

    fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLScKUjwd3C46jdW_NDOFTzc1Lobiy2_trqGuc1izN1Y8aMdi6Q/formResponse",
      { method: "POST", mode: "no-cors", body: data }
    ).then(() => {
      window.location.href = "success.html";
    });
  });
});

// ============================
// INIT SHOP
// ============================
document.addEventListener("DOMContentLoaded", loadShopProducts);
