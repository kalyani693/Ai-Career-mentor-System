/*ith aapan direct html cha input variable store kart ahe na ki tyachi 
value karn hi file jevha page load hoil tevhach load hoil mhnje 
starting la empty value store houn jail mhnun */
const fullname=document.getElementById("fullname");
const username=document.getElementById("username");
const email=document.getElementById("email");
const university=document.getElementById("university");
const cgpa=document.getElementById("cgpa");
const resume=document.getElementById("resume");
const careergoal=document.getElementById("careergoal");
const highestclass=document.getElementById("highestclass");
const password=document.getElementById("password");
const register=document.getElementById("Registerbtn");
const formdata=new FormData();/*aapan backend madhe input form madhe ghet ahe mhnun */

let url="http://127.0.0.1:8000/registration";

async function registration(){
    register.disabled=true ;

    let new_element=document.createElement("div");
    new_element.classList.add("loader");
    new_element.textContent="Loading..";
    register.after(new_element);
    let input={
    "Full_Name":fullname.value,
    "Username":username.value,
    "Email":email.value,
    "Password":password.value,
    "Highest_Class":highestclass.value,
    "Career_goal":careergoal.value,
    "University":university.value,
    "CGPA":cgpa.value
    };

    formdata.append("info",JSON.stringify(input));
    formdata.append("resume",resume.files[0]);

    try{
        const response =await fetch(url,{
            method:'POST',
            body:formdata
        });
        const data= await response.json();
        register.disabled=false ;
        new_element.remove();
        let result=document.createElement("h3");
        result.style.color="green";
        result.textContent=data.Result;
        register.after(result);
    }
    catch (error){
        console.error("error:",error);
        new_element.remove();
        let error_msg=document.createElement("h4");
        error_msg.textContent="something went wrong";
        error_msg.style.color="red";
        register.after(error_msg);
    }};

register.addEventListener('click',registration);/* ithe function la jr ( dil tr js page load kraychya vedes 
direct call krel register button click n krta hi)*/
