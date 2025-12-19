// SHOP PAGE
const list = document.getElementById("productList");
if (list) {
  PRODUCTS.forEach(p => {
    list.innerHTML += `
      <div class="product-card">
        <img src="images/${p.image}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <a href="product.html?id=${p.id}">View</a>
      </div>`;
  });
}

// PRODUCT PAGE
const params = new URLSearchParams(location.search);
const pid = params.get("id");

if (pid) {
  const p = PRODUCTS.find(x => x.id === pid);
  if (p) {
    document.getElementById("pImg").src = `images/${p.image}`;
    document.getElementById("pName").innerText = p.name;
    document.getElementById("pPrice").innerText = `₹${p.price}`;

    document.querySelectorAll(".sizes span").forEach(s => {
      s.onclick = () => {
        document.querySelectorAll(".sizes span").forEach(x => x.classList.remove("active"));
        s.classList.add("active");
      };
    });

    document.getElementById("buyBtn").onclick = () => {
      const size = document.querySelector(".sizes .active");
      if (!size) return alert("Select size");

      localStorage.setItem("product", p.name);
      localStorage.setItem("price", p.price);
      localStorage.setItem("size", size.innerText);

      location.href = "checkout.html";
    };
  }
}

// CHECKOUT PAGE
const info = document.getElementById("orderInfo");
if (info) {
  const product = localStorage.getItem("product");
  const size = localStorage.getItem("size");
  const price = localStorage.getItem("price");

  if (!product) location.href = "shop.html";

  info.innerText = `${product} | Size ${size} | ₹${price}`;
}

const form = document.getElementById("orderForm");
if (form) {
  form.onsubmit = e => {
    e.preventDefault();

    const data = new FormData();
    data.append("entry.2094167033", name.value);
    data.append("entry.1365619003", phone.value);
    data.append("entry.433871083", address.value);
    data.append("entry.2006505239", localStorage.getItem("product"));
    data.append("entry.1455588550", localStorage.getItem("price"));
    data.append("entry.74629137", localStorage.getItem("size"));

    fetch("https://docs.google.com/forms/d/e/1FAIpQLScKUjwd3C46jdW_NDOFTzc1Lobiy2_trqGuc1izN1Y8aMdi6Q/formResponse",
    { method: "POST", mode: "no-cors", body: data })
    .then(() => {
      localStorage.clear();
      location.href = "success.html";
    });
  };
  }
