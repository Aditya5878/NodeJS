let firstName = "John";
let isAdmin = false;
let age = 30;

let duties = ['write Code' , 'Fix bugs']

let car  = null

let bicycle = undefined

let work = () =>{
    console.log("Working ...")
}


let  salary = 50n;
let logo = Symbol('emerald')

let all = [firstName , isAdmin , age , car , bicycle, duties ,work , salary , logo];

for(let item of all){
    console.log(String(item)+ ' is ' + typeof item);
}
