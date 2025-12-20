// =====================================
// EASY PRODUCT MODE – GOOGLE SHEET
// =====================================

const SHEET_URL =
  "https://opensheet.elk.sh/2PACX-1vRP0BOsRW5H8ddhTP_rWI6r1-zFlKKzcXb0GS80Okit145N07tzJ0K_oR274zycv1ZFz8s9I2ldplrq/products";

let products = [];

// Fetch products from Google Sheet
fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => {
    products = data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      images: [
        item.image1,
        item.image2,
        item.image3
      ].filter(Boolean)
    }));

    // Trigger shop load if exists
    if (typeof loadShopProducts === "function") {
      loadShopProducts();
    }
  })
  .catch(err => {
    console.error("Product Sheet Error:", err);
  });
