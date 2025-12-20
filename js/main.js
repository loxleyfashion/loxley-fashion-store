// ============================
// Loxley Fashion Main JS
// ============================


// ============================
// CLEAN IMAGE URL (CRITICAL FIX)
// ============================
function cleanImage(url) {
  if (!url) return "";

  return url
    .replace(/\r?\n|\r/g, "")     // remove line breaks
    .trim()                       // remove spaces
    .replace(/^"+|"+$/g, "")      // remove quotes
    .replace(/\.jpg\.jpg$/i, ".jpg")
    .replace(/\.png\.png$/i, ".png")
    .replace(/\.jpeg\.jpeg$/i, ".jpeg");
}


// ============================
// SAFE CSV PARSER (IMAGE FIX)
// ============================
function parseCSVRow(row) {
  return row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
}


// ============================
// FETCH PRODUCTS FROM GOOGLE SHEET
// ============================
async function getProducts() {
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRP0BOsRW5H8ddhTP_rWI6r1-zFlKKzcXb0GS80Okit145N07tzJ0K_oR274zycv1ZFz8s9I2ldplrq/pub?output=csv";

  const response = await fetch(sheetURL);
  const csvText = await response.text();

  const rows = csvText.split("\n").slice(1); // skip header

  return rows.map(row => {
    const cols = parseCSVRow(row);

    return {
      id: cols[0]?.trim(),
      name: cols[1]?.trim(),
      price: cols[2]?.trim(),
      images: cols
        .slice(3)
        .map(img => cleanImage(img))
        .filter(img => img.startsWith("http"))
    };
  }).filter(p => p.id);
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
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy"
           onerror="this.src='images/placeholder.jpg'">
      <div class="product-info">
        <h3>${product.name}</h3>
        <span>₹${product.price}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}


// ============================
// LOAD PRODUCT PAGE
// ============================
async function loadProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  const products = await getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Text details
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `₹${product.price}`;
  document.getElementById("formProduct").value = product.name;
  document.getElementById("formPrice").value = product.price;

  // Images
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

  // Sizes
  const sizes = ["S", "M", "L", "XL"];
  const sizeContainer = document.getElementById("sizeContainer");
  sizeContainer.innerHTML = "";

  sizes.forEach(size => {
    const span = document.createElement("span");
    span.className = "size";
    span.textContent = size;

    span.onclick = () => {
      document.querySelectorAll(".size").forEach(s => s.classList.remove("active"));
      span.classList.add("active");
      document.getElementById("formSize").value = size;
    };

    sizeContainer.appendChild(span);
  });

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
