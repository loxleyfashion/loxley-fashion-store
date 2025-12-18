// SIZE SELECT
document.querySelectorAll(".sizes span").forEach(s=>{
  s.onclick=()=>{
    document.querySelectorAll(".sizes span").forEach(x=>x.classList.remove("active"));
    s.classList.add("active");
  }
});

// BUY BUTTON
const buyBtn=document.getElementById("buyBtn");
if(buyBtn){
buyBtn.onclick=()=>{
const size=document.querySelector(".sizes .active")?.innerText;
localStorage.setItem("product","Loxley Black Tee");
localStorage.setItem("size",size);
localStorage.setItem("price","799");
window.location.href="../checkout.html";
};
}

// CHECKOUT → GOOGLE SHEET
const form=document.getElementById("orderForm");
if(form){
document.getElementById("product").value=localStorage.getItem("product");
document.getElementById("size").value=localStorage.getItem("size");
document.getElementById("price").value=localStorage.getItem("price");

form.onsubmit=e=>{
e.preventDefault();
const data=new FormData();

data.append("entry.2094167033",name.value);
data.append("entry.1365619003",phone.value);
data.append("entry.433871083",address.value);
data.append("entry.2006505239",product.value);
data.append("entry.1455588550",price.value);
data.append("entry.74629137",size.value);

fetch("https://docs.google.com/forms/d/e/1FAIpQLScKUjwd3C46jdW_NDOFTzc1Lobiy2_trqGuc1izN1Y8aMdi6Q/formResponse",
{method:"POST",mode:"no-cors",body:data})
.then(()=>{localStorage.clear();window.location="success.html"});
};
}
