// //Interfaces:
// //E.g.
// interface NamedPerson {
//   firstName: string;
//   age?: number;
//   [propName: string]: any; //specify unknown property name - [] variable property
// }
// // With a variable/dynamic property name, objects can be created on the fly without strict checking.
// //Object creates new property even if age is not specified
// // const person: NamedPerson = {
// // 	firstName: 'Louw',
// // 	hobbies: ['Cooking', 'Sports']
// // }
// //compiles successfully even without age property specified
// //Interfaces with methods
// interface NamedPerson {
//   firstName: string;
//   age?: number;
//   [propName: string]: any; //specify unknown property name - [] variable property
//   greet(lastName: string): void;
// }
// const person: NamedPerson = {
//   firstName: 'Louw',
//   hobbies: ['Cooking', 'Sports'],
//   greet(lastName: string) {
//     console.log('Hi, I am ' + this.firstName + ' ' + lastName);
//   }
// };
// //Using interfaces with classes:
// class Person implements NamedPerson {
//   firstName: string;
//   greet(lastName: string) {
//     console.log('Hi, I am ' + this.firstName + ' ' + lastName);
//   }
// }
// const myPerson = new Person();
// myPerson.firstName = 'Louw';
// myPerson.greet('Visagie');
// // Interfaces - Function types
// interface DoubleValueFunc {
//   (number1: number, number2: number): number;
// }
// let myDoubleFunction: DoubleValueFunc;
// myDoubleFunction = function(value1: number, value2: number) {
//   return (value1 + value2) * 2;
// };
// console.log(myDoubleFunction(10, 20));
// // interface inheritance
// interface AgedPerson extends NamedPerson {
//   age: number; //set age to be a required field
// }
// const oldPerson: AgedPerson = {
//   age: 27,
//   firstName: 'Louw',
//   greet(lastName: string) {
//     console.log('Hello');
//   }
// };
// console.log(oldPerson);
// //NOTE: Interfaces do not get compiled to .js - interfaces get completely ignored compile-time
// //Interfaces assist in writing better, strictly-typed code for compilation.
// // GENERICS
// // Simple generics
// function echo(data: any) {
//   return data;
// }
// console.log(echo('Louw'));
// console.log(echo(34));
// console.log(echo({ name: 'Louw', age: 34 }));
// //Better generic
// function betterEcho<T>(data: T) {
//   return data;
// }
// //Generics make typescript aware of the output type. You will notice this when entering
// //betterEcho(34). - the IDE will not predict methods cast on strings, e.g. length
// console.log(betterEcho('Louw'));
// console.log(betterEcho(34));
// console.log(betterEcho({ name: 'Louw', age: 34 }));
// //You can specify what type you want to pass to the generic function:
// //console.log(betterEcho<number>(“34”))’
// //will error because we specify that we want to pass a number, but we are passing a string
// // Built-in generics
// const testResults: Array<number> = [1.9, 2.33];
// testResults.push('string'); //error. by explicitly setting the type to number, the array will only accept numbers
// //Arrays
// function printAll<T>(args: T[]) {
//   args.forEach(element => console.log(element));
// }
// printAll<string>(['Apple', 'banana']);
// //Generic Types
// const echo2: <T>(data: T) => T = betterEcho;
// // Typescript rule: all code before the equals sign is type assignment, everything after describes functionality or setting of values
// //Generic Class
// class SimpleMathOne {
//   baseValue;
//   multiplyValue;
//   calculate() {
//     return this.baseValue * this.multiplyValue;
//   }
// }
// const simpleMathOne = new SimpleMathOne();
// //make it generic, using extends for multiple type assignment
// class SimpleMath<T, U extends number | string> {
//   baseValue: T;
//   multiplyValue: U;
//   calculate(): number {
//     return +this.baseValue * +this.multiplyValue; //+cast to number
//   }
// }
// const simpleMath = new SimpleMath<string, number>();
// simpleMath.baseValue = '10';
// simpleMath.multiplyValue = 20;
// console.log(simpleMath.calculate());
// //DECORATORS - Limited support available
// // Decorators - basically meta data/functionality for classes
// function logged(constructorFn: Function) {
//   console.log(constructorFn);
// }
// @logged //attaches the logged function to the Person class as an implicit constructor
// class AnotherPerson {}
// //An error is displayed when compiling 'Experimental support for decorators is a feature that is subject to change in a future release'
// //edit tsconfig.json add "experimentalDecorators": true
// //Decorator Factory
// function logging(value: boolean) {
//   return value ? logged : null; //returns the logged function if value is true, else returns null
// }
// @logging(true) //returns the function constructor only if true
// class Car {}
// //A MORE USEFUL DECORATOR
// function printable(constructorFn: Function) {
//   constructorFn.prototype.print = function() {
//     console.log(this); //each object instantiated by a class with the printable decorator will automatically receive the print() method
//   };
// }
// @logging(true)
// @printable
// class Plant {
//   name = 'Green Plant';
// }
// const plant = new Plant();
// <any>plant.print(); //existing bug in typescript that requires the any type assignment
// //NOTE: a decorator is just a simple function, but its functionality is attached as meta functionality to classes, methods or properties
// //METHOD DECORATORS
// function editable(value: boolean) {
//   //usage of the Object.defineProperty JS method
//   return function(target: any, propName: string, descriptor: PropertyDescriptor) {
//     descriptor.writable = value; //alows the user to set whether the calcBudget method is editable or not
//   };
// }
// class Project {
//   //when using property decorators
//   //@overwritable(false)
//   projectName: string;
//   constructor(name: string) {
//     this.projectName = name;
//   }
//   @editable(false) //prevents the user from editing the functionality of the calcBudget method
//   calcBudget() {
//     console.log(1000);
//   }
// }
// const project = new Project("Louw's project");
// project.calcBudget();
// project.calcBudget = function() {
//   console.log(2000);
// };
// project.calcBudget(); //prints 2000 instead of 1000
// //PROPERTY DECORATORS - TECHNICAL LIMITATIONS OF TS below
// function overwritable(value: boolean) {
//   //usage of the Object.defineProperty JS method - Typescript cannot access the PropertyDescriptor as done above
//   return function(target: any, propName: string): any {
//     const newdescriptor: PropertyDescriptor = {
//       writable: value
//     };
//     return newdescriptor;
//   };
// }
// //PARAMETER DECORATORS
// function printInfo(target: any, methodName: string, paramIndex: number) {
//   console.log('Target: ', target);
//   console.log('Method Name: ', methodName);
//   console.log('paramIndex ', paramIndex);
// }
// class Course {
//   name: string;
//   constructor(name: string) {
//     this.name = name;
//   }
//   printStudentNumbers(mode: string, @printInfo printall: boolean) {
//     if (printall) {
//       console.log(10000);
//     } else {
//       console.log(3000);
//     }
//   }
// }
// const course = new Course('Amazing Course');
// course.printStudentNumbers('anything', true);
// course.printStudentNumbers('anything', false);
