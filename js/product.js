const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const product = products.find(p => p.id === productId);

if (product) {
  document.getElementById("productName").innerText = product.name;
  document.getElementById("productPrice").innerText = product.price;

  const mainImage = document.getElementById("mainImage");
  mainImage.src = product.images[0];

  // Image change on click
  if (product.images.length > 1) {
    product.images.forEach(img => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.style.width = "60px";
      thumb.style.marginRight = "10px";
      thumb.style.cursor = "pointer";

      thumb.onclick = () => mainImage.src = img;
      document.querySelector(".product-images").appendChild(thumb);
    });
  }

  // Size select
  let selectedSize = "";
  document.querySelectorAll(".size").forEach(size => {
    size.onclick = () => {
      document.querySelectorAll(".size").forEach(s => s.classList.remove("active"));
      size.classList.add("active");
      selectedSize = size.innerText;
    };
  });

  // Buy button
  document.getElementById("buyBtn").onclick = () => {
    if (!selectedSize) {
      alert("Please select size");
      return;
    }

    window.location.href =
      `checkout.html?product=${encodeURIComponent(product.name)}&price=${product.price}&size=${selectedSize}`;
  };
}
