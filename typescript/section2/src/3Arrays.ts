// const duties: string[] = ['wrtie Code']
//  or 

const duties : Array<string> = ['write code']

duties.push('fix bug')

for (let item of duties){
    console.log(item)
}

duties.map(duty =>{
    console.log(duty.toUpperCase())
});