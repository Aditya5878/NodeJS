function greet(name:string) {
    return ( 'Hello ' + name);
}


const greetToConsole = (name : string) =>{
    console.log('Hello '+ name);
}

function greetMultiple(...names: string[]){     // internally it converts : ('Aditya' , 'Verma') into ['Aditya' , 'Verma']
    names.forEach(name =>{
        greetToConsole(name);  
    })
}


greetMultiple('Aditya' , 'Verma')

 