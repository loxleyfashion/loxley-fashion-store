// -------- SHOP PAGE PRODUCT LIST --------
const productList = document.getElementById("productList");

if (productList && typeof products !== "undefined") {
  products.forEach(p => {
    productList.innerHTML += `
      <div class="product-card">
        <img src="${p.images[0]}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <a href="product.html?id=${p.id}">View</a>
      </div>
    `;
  });
}

// -------- PRODUCT PAGE --------
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (productId && typeof products !== "undefined") {
  const p = products.find(x => x.id === productId);

  if (p) {
    // Title & price
    document.getElementById("pName").innerText = p.name;
    document.getElementById("pPrice").innerText = `₹${p.price}`;

    // Image gallery
    const mainImg = document.getElementById("mainImage");
    const thumbs = document.getElementById("thumbs");

    mainImg.src = p.images[0];

    p.images.forEach(img => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.onclick = () => {
        mainImg.classList.add("fade");
        setTimeout(() => {
          mainImg.src = img;
          mainImg.classList.remove("fade");
        }, 150);
      };
      thumbs.appendChild(thumb);
    });

    // Size select
    document.querySelectorAll(".sizes span").forEach(s => {
      s.onclick = () => {
        document.querySelectorAll(".sizes span").forEach(x =>
          x.classList.remove("active")
        );
        s.classList.add("active");
      };
    });

    // Buy button
    document.getElementById("buyBtn").onclick = () => {
      const size = document.querySelector(".sizes .active");
      if (!size) return alert("Please select size");

      localStorage.setItem("product", p.name);
      localStorage.setItem("price", p.price);
      localStorage.setItem("size", size.innerText);

      window.location.href =
        `checkout.html?product=${encodeURIComponent(p.name)}`;
    };
  }
}
