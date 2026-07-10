const popup=document.getElementById("pop");
const menubtn=document.getElementById("menu");
const back=document.getElementById("back");


menubtn.addEventListener('click',()=>{
    popup.classList.add('show');
});

back.addEventListener('click',()=>{
    popup.classList.remove('show');
});