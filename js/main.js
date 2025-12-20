async function loadShopProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const products = await getProducts();
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

document.addEventListener("DOMContentLoaded", loadShopProducts);

// ============================
// GOOGLE FORM SILENT SUBMIT
// ============================
const form = document.getElementById("orderForm");

if (form) {
  const params = new URLSearchParams(window.location.search);
  const productName = params.get("product");
  const price = params.get("price");
  const size = params.get("size");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]').value;
    const phone = form.querySelector('input[name="phone"]').value;
    const address = form.querySelector('input[name="address"]').value;
    const city = form.querySelector('input[name="city"]') 
      ? form.querySelector('input[name="city"]').value 
      : "";

    const data = new FormData();
    data.append("entry.2094167033", name);
    data.append("entry.1365619003", phone);
    data.append("entry.433871083", productName);
    data.append("entry.2006505239", size);
    data.append("entry.1455588550", price);
    data.append("entry.74629137", address);
    data.append("entry.95104987", city);

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
