// ============================
// Loxley Fashion Main JS
// ============================

// Fetch products from products.js or Google Sheet (async safe)
async function getProducts() {
  // If you are loading from static array:
  if (typeof products !== "undefined") return products;

  // Example: Fetch from Google Sheet JSON
  const sheetURL = "https://spreadsheets.google.com/feeds/list/YOUR_SHEET_ID/od6/public/values?alt=json";
  const res = await fetch(sheetURL);
  const data = await res.json();
  
  return data.feed.entry.map((item, index) => ({
    id: "p" + index,
    name: item.gsx$name.$t,
    price: item.gsx$price.$t,
    images: [item.gsx$image1.$t, item.gsx$image2.$t, item.gsx$image3.$t].filter(Boolean)
  }));
}

// ============================
// LOAD PRODUCTS ON SHOP PAGE
// ============================
async function loadShopProducts() {
  const grid = document.getElementById("productGrid");
  const products = await getProducts();
  if (!grid || !Array.isArray(products)) return;
  grid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("a");
    card.href = `product.html?id=${product.id}`;
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.name}">
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
  const products = await getProducts();
  const product = products.find(p => p.id === productId);

  if (!product) return;

  // Set main details
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `₹${product.price}`;
  document.getElementById("formProduct").value = product.name;
  document.getElementById("formPrice").value = product.price;

  // Load Images
  const imageContainer = document.getElementById("productImages");
  product.images.forEach((img, index) => {
    const image = document.createElement("img");
    image.src = img;
    if (index === 0) image.classList.add("active");
    imageContainer.appendChild(image);
  });

  // Size options
  const sizes = ["S","M","L","XL"];
  const sizeContainer = document.getElementById("sizeContainer");
  sizes.forEach(size => {
    const span = document.createElement("span");
    span.className = "size";
    span.textContent = size;
    span.addEventListener("click", () => {
      document.querySelectorAll(".size").forEach(s => s.classList.remove("active"));
      span.classList.add("active");
      document.getElementById("formSize").value = size;
    });
    sizeContainer.appendChild(span);
  });

  // Select default size
  document.querySelector(".size").click();

  // ============================
  // GOOGLE FORM SILENT SUBMIT
  // ============================
  const form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = form.querySelector('input[name="name"]').value;
      const phone = form.querySelector('input[name="phone"]').value;
      const address = form.querySelector('input[name="address"]').value;
      const city = form.querySelector('input[name="city"]').value || "";
      const productName = form.querySelector('input[name="product"]').value;
      const price = form.querySelector('input[name="price"]').value;
      const size = form.querySelector('input[name="size"]').value;

      const data = new FormData();
      data.append("entry.2094167033", name);
      data.append("entry.1365619003", phone);
      data.append("entry.433871083", productName);
      data.append("entry.2006505239", size);
      data.append("entry.1455588550", price);
      data.append("entry.74629137", address);
      data.append("entry.95104987", city);

      fetch("https://docs.google.com/forms/d/e/1FAIpQLScKUjwd3C46jdW_NDOFTzc1Lobiy2_trqGuc1izN1Y8aMdi6Q/formResponse", {
        method: "POST",
        mode: "no-cors",
        body: data
      }).then(() => {
        window.location.href = "success.html";
      });
    });
  }
});

// ============================
// INIT SHOP PAGE
// ============================
document.addEventListener("DOMContentLoaded", loadShopProducts);
