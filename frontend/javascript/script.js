/*Registration */
const registration=document.getElementById("regi_btn");
const popupoverlay=document.getElementById("popupoverlay");
const close_=document.getElementById("closebtn");
const register=document.getElementById("Registerbtn");

/*Login*/
const login_btn=document.getElementById("login_btn");
const loginpopupoverlay=document.getElementById("loginpopup");
const close_btn=document.getElementById("closebutton");
const login_submit=document.getElementById("logbtn");


/*registration*/
registration.addEventListener('click', ()=>{
    popupoverlay.classList.add('show');
});

close_.addEventListener('click',()=>{
    popupoverlay.classList.remove('show');
});

register.addEventListener('click',()=>{
    /*summmit cha logic*/   
})


/*login*/
login_btn.addEventListener('click',()=>{
    loginpopupoverlay.classList.add('show');
});

close_btn.addEventListener('click',()=>{
    loginpopupoverlay.classList.remove('show');
});

login_submit.addEventListener('click',()=>{
       /*login cha logic*/
});



