const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqeus79UjHIdABYDSnbY6yUuow6rl_4BAf1GDqsOUuoZWUBZlDITJnkQ7NnXhLgeeTJNtsuxcwc8Pj/pub?output=csv&t=" + Date.now();

const gallery = document.getElementById("gallery");
const loader = document.getElementById("loader");
const categorySelect = document.getElementById("categorySelect");

let imageData=[], filteredData=[], currentIndex=0;

fetch(sheetURL)
.then(res=>res.text())
.then(csv=>{
 const rows=csv.trim().split("\n").slice(1);
 imageData=rows.reverse().map(r=>{
  const [img,cat]=r.split(",");
  return {image:img.replace(/"/g,"").trim(),category:cat?.trim()||"General"};
 });
 populateCategories();
 renderImages("all");
 loader.style.display="none";
});

function populateCategories(){
 [...new Set(imageData.map(i=>i.category))].forEach(cat=>{
  const o=document.createElement("option");
  o.value=cat;o.textContent=cat;
  categorySelect.appendChild(o);
 });
 categorySelect.onchange=()=>renderImages(categorySelect.value);
}

/* PERFECT LAZY LOADING */
const observer=new IntersectionObserver((entries,obs)=>{
 entries.forEach(e=>{
  if(e.isIntersecting){
   const img=e.target;
   img.src=img.dataset.src;
   img.onload=()=>img.classList.add("loaded");
   obs.unobserve(img);
  }
 });
},{threshold:.15,rootMargin:"100px"});

function renderImages(filter){
 gallery.innerHTML="";
 filteredData=filter==="all"?imageData:imageData.filter(i=>i.category===filter);

 filteredData.forEach((item,i)=>{
  const div=document.createElement("div");
  div.className="image-tile";

  const img=document.createElement("img");
  img.dataset.src=item.image;
  img.src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'></svg>";
  img.onclick=()=>openModal(i);

  observer.observe(img);

  div.appendChild(img);
  gallery.appendChild(div);
 });
}

/* MODAL */
const modal=document.getElementById("modal");
const modalImg=document.getElementById("modal-img");

function openModal(i){
 currentIndex=i;
 modalImg.src=filteredData[i].image;
 modal.style.display="block";
}

function closeModal(){modal.style.display="none";}

document.getElementById("close").onclick=closeModal;

document.getElementById("next").onclick=()=>{
 currentIndex=(currentIndex+1)%filteredData.length;
 modalImg.src=filteredData[currentIndex].image;
}

document.getElementById("prev").onclick=()=>{
 currentIndex=(currentIndex-1+filteredData.length)%filteredData.length;
 modalImg.src=filteredData[currentIndex].image;
}

modal.onclick=e=>{if(e.target===modal)closeModal();}
/* ===== SMART LIVE TICKER ROTATION ===== */

const ticker = document.querySelector(".ticker-pro-move");

const headlines = [
"🔴 BREAKING: Israel declares war on Iran after launching major air strikes — state of emergency announced.",
"⚠️ Iran responds with missile launches toward Israeli territory — air defense systems activated.",
"🌍 Iranian supreme leader Ayatollah Ali Khamenei assassinated.",
"📰 Stay tuned to NewsGrid for latest real-time updates on the Israel–Iran situation."
];

let tickerIndex = 0;

function setHeadline(text){
  ticker.style.animation = "none";   // reset animation
  void ticker.offsetWidth;           // force reflow
  ticker.textContent = text;
  ticker.style.animation = "tickerMove 22s linear infinite"; // slower scroll
}

/* First headline */
setHeadline(headlines[tickerIndex]);

/* Change only after animation duration */
ticker.addEventListener("animationiteration", () => {
  tickerIndex = (tickerIndex + 1) % headlines.length;
  setHeadline(headlines[tickerIndex]);
});
