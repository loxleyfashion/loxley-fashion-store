async function getProducts() {
  const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRP0BOsRW5H8ddhTP_rWI6r1-zFlKKzcXb0GS80Okit145N07tzJ0K_oR274zycv1ZFz8s9I2ldplrq/pub?output=csv";
  const response = await fetch(sheetURL);
  const data = await response.text();
  const rows = data.split("\n").slice(1); // skip header
  const products = rows.map(row => {
    const cols = row.split(",");
    return {
      id: cols[0],
      name: cols[1],
      price: cols[2],
      images: cols.slice(3).filter(Boolean)
    };
  });
  return products;
}
