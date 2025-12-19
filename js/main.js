document.getElementById("orderForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const form = this;
  const formData = new FormData(form);

  fetch(
    "https://docs.google.com/forms/d/e/1FAIpQLScKUjwd3C46jdW_NDOFTzc1Lobiy2_trqGuc1izN1Y8aMdi6Q/formResponse",
    {
      method: "POST",
      body: formData,
      mode: "no-cors"
    }
  ).then(() => {
    window.location.href = "success.html";
  });
});
