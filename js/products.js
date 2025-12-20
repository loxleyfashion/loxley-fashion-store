// js/products.js
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRP0BOsRW5H8ddhTP_rWI6r1-zFlKKzcXb0GS80Okit145N07tzJ0K_oR274zycv1ZFz8s9I2ldplrq/pub?output=csv";

async function getProducts() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1); // skip header
  return rows.map(row => {
    const [id, name, price, images] = row.split(",");
    return {
      id: id.trim(),
      name: name.trim(),
      price: price.trim(),
      images: images.split("|").map(img => img.trim()) // multiple images separated by |
    };
  });
}
