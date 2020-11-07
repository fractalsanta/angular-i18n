// What is Typescript?
// Getting started
// npm init - create
// tsc --init puts folder under control of npm, and Typescript (created the tsconfig.json file)
// //COMPILER NOTES
// // http://www.typescriptlang.org/docs/handbook/compiler-options.html
//implicit type assignment
// let myName = 'Louw';
// myName = '100';
// //implicit any type
// let myAge;
// myAge = 12;
// myAge = '12';
// // //array
// let hobbies: any[] = [27, "Gambling"];
// hobbies = [100];
//tuples - arrays with specific types
//let address: [string, number] = ["Vredenburg Ave", 99];
//let address: [string, number] = [99, "Vredenburg Ave"]; //will throw error
// //enums
// enum Color {
//     Purple,
//     Green = 102,
//     Blue
// }
// let myColor: Color = Color.Blue;
// console.log(myColor); //displays 1
// //using types in functions
// function sumOfvalues(value1: number, value2: number): number {
//     return value1 + value2;
// }
// console.log(sumOfvalues(1, 5));
// //Functions as types
// //Creating a function as a type - allows only a function with these types of arguments
// let mySumOfValues: (val1: number, val2: number) => number;
// console.log(mySumOfValues(1, 5));
// //if we try to assign a function that does not have this shape, we get an error
// function hello(): void {
//     console.log('hello');
// }
// //mySumOfValues = hello; //error
// mySumOfValues = (x: number, y: number) => typeof(x);
// mySumOfValues = () => ; //success
//Tip for moving forward: type assignment always before the equals sign, values after
// //Objects
// let person: { name: string, age: number } = {
//     name: "Louw",
//     age: 69
// }
// //Complex objects
// let complexObject: { data: number[], output: (all: boolean) => number[] } = {
//     data: [100, 3.99, 10],
//     output: function (all: boolean): number[] {
//         return this.data;
//     }
// }
// //union types for multiple types allowed
// let myNumber: number | string;
// myNumber = 69;
// console.log(myNumber);
// myNumber = '32432';
// console.log(myNumber);
//myNumber = false; //error
// // Typescript and ES6 (ES6/ECMAScript is what is commonly referred to as Javascript)
// // Commonly used
// // Arrow functions
// const sumValues = function (num1: number, num2: number): number {
//     return num1 + num2;
// }
// const multiplyNumbers = (num1: number, num2: string): number => {
//     return num1 * num2;
// }
// const helloSir = () => {
//     console.log('hello');
// }
// helloSir();
// // Spread operators
// const ages = [7, 99, 13, 29];
// console.log(Math.max(22, 10, 1, 87)); //Math.max method expects a list of values
// //console.log(Math.max(ages)); //array not expected
// // The spread operator spreads values of an array or object - e.g.
// console.log(Math.max(22, 10, 1, 87, ...ages));
// // a few more examples:
// // //any position
// // var list = [1, 2];
// // list = [0, ...list, 4];
// // console.log(list); // [0,1,2,4]
// //Object spread
// const twonumbers = { x: 1, y: 2 };
// const threenumbers = { z: 3, x: 4, ...twonumbers };
// console.log(twonumbers, threenumbers);
// // Rest operator
// function makeArray(...args: number[]) { //What if we want a flexible amount of numbers? Add the rest operator (Same as spread, but turns arguments into array)
//     return args;
// }
// console.log(makeArray(1, 6, 8)); //[1, 6, 8]
// //Template literals
// const myname = "Louw";
// const greeting = `This is a heading
// I'm ${myname}.
// Multi-line yo
// `;
// console.log(greeting);
// // // Classes, inheritance and access modifiers
// class Person {
//     name: string;
//     protected type: string; //only accessible within the class itself
//     protected age: number; //accessible to classes that inherit Person
//     constructor(name: string, public username: string) {
//         this.name = name; //name passed to the constructor
//         this.type = "testing";
//     }
//     printAge() {
//         console.log(this.age);
//     }
//     printUserNAme() {
//         console.log(this.username);
//     }
//     setType(type: string) {
//         this.type = type;
//         console.log(this.type);
//     }
// }
// const guy = new Person("Louw", "louw.visagie");
// console.log(guy);
// console.log(guy.name, guy.username); //IDE does not supply type or age - they are not accessible outside the class
// guy.printAge();
// guy.printUserNAme();
// guy.setType("Human-like");
// // // // Inheritance
// class Baby extends Person {
//     name = "Louw"; //the name property will overwrite the parent class
//     constructor(username: string) {
//         super("LouwVisagie", username); //if a new constructor is defined in the extended class, super method needs to be called - this calls the constructor of the parent
//         this.age = 99;
//         console.log(this.type); //type (private) not available to extended class
//     }
// }
// const me = new Baby("LouwVisagie"); //name will be Louw if the constructor/super is not called in the extended class - the value of the extended class
// console.log(me);
// //getters and setters
// class Plant {
//     private _species: string = "default";
//     get species() {
//         //
//         return this._species;
//     }
//     set species(value: string) {
//         if (value.length > 3) {
//             this._species = value;
//         } else {
//             this._species = "default";
//         }
//     }
// }
// let plant = new Plant();
// console.log(plant.species); //in the case of getters and setters, methods are called like a property
// plant.species = "AB";
// console.log(plant.species); //default
// plant.species = "ABCDEF";
// console.log(plant.species); //ABCDEF, because in the set species method value is longer than 3 chars
// // static properties and methods
// class Helpers {
//     static PI: number = 3.14; //PI and calcCircumference may be used even if no instance of Helpers has been set
//     static calcCircumference(diameter: number): number {
//         return this.PI * diameter;
//     }
// }
// console.log(2 * Helpers.PI);
// console.log(Helpers.calcCircumference(8));
// //abstract classes - may only be inherited from
// abstract class Project {
//     projectName: string = "Default";
//     budget: number = 1200;
//     abstract changeName(name: string): void; //abstract methods do not have a body
//     calcBudget(): number {
//         return this.budget * 2;
//     }
// }
// class ITProject extends Project {
//     changeName(name: string): void {
//         this.projectName = name;
//     }
//     calcBudget(): number {
//         return this.budget * 10;
//     }
// }
// let newProject = new ITProject(); //Project can not be instantiated, however its extended version Project can
// console.log(newProject.calcBudget());
// console.log(newProject); //project with the name of Default
// newProject.changeName("Super IT project");
// console.log(newProject); ////project with the name of Super IT project
//INTERFACES
// //Interfaces:
// //E.g.
// function hi(person: {name: string, age: 30}) {
//     console.log("Hello, " + person.name);
// }
// function greet(person: {name: string, age: 30}) {
//     console.log("Hi again" + person.name);
// }
//Create an interface to define the shape of an object
// interface APerson {
//     name: string;
//     age: number;
// }
// //Then use
// function hi(person: APerson) {
//     console.log("Hello, " + person.name);
// }
// function greet(person: APerson) {
//     console.log("Hi again" + person.name);
// }
// interface NamedPerson {
//     firstName: string;
//     age?: number;
//     [propName: number]: any; //specify unknown property name - [] Typescript variable property
// }
// // With a variable/dynamic property name, objects can be created on the fly without strict checking.
// //Object creates new property even if age is not specified
// const person: NamedPerson = {
//     firstName: 'Louw',
//     30: "never",
//     40: ['Cooking', 'Sports'],
//     50: 10,
// }
// console.log(person);
//compiles successfully even without age property specified
// //Interfaces with methods
// interface NamedPerson {
//     firstName: string;
//     age?: number;
//     [propName: string]: any; //specify unknown property name - [] variable property
//     greet(lastName: string): void;
// }
// const person: NamedPerson = {
//     firstName: 'Louw',
//     hobbies: ['Cooking', 'Sports'],
//     lastName: 'Visagie',
//     greet(lastName: string) {
//         console.log('Hi, I am ' + this.firstName + ' ' + lastName);
//     }
// };
// //Using interfaces with classes:
// class Person implements NamedPerson {
//     firstName: string;
//     greet(lastName: string) {
//         console.log('Hi, I am ' + this.firstName + ' ' + lastName);
//     }
// }
// const myPerson = new Person();
// myPerson.firstName = 'EB';
// myPerson.greet('Visagie');
// // // // Interfaces - Function types
// interface DoubleValueFunc {
//     (number1: number, number2: number): number;
// }
// let myDoubleFunction: DoubleValueFunc;
// myDoubleFunction = function louwsfunction (value1: number, value2: number) {
//     return (value1 + value2) * 2;
// };
// console.log(myDoubleFunction(10, 20));
// // interface inheritance
// interface AgedPerson extends NamedPerson {
//     age: number; //set age to be a required field
// }
// const oldPerson: AgedPerson = {
//     age: 27,
//     firstName: 'Louw',
//     greet(lastName: string) {
//         console.log('Hello ' + this.firstName + ' ' + lastName);
//     }
// };
// console.log(oldPerson);
// // //NOTE: Interfaces do not get compiled to .js - interfaces get completely ignored compile-time
// // //Interfaces assist in writing better, strictly-typed code for compilation.
// // // GENERICS
// // // // Simple generics
// function echo(data: any) {
//     return data;
// }
// console.log(echo('Louw'));
// console.log(echo(34));
// console.log(echo({ name: 'Louw', age: 34 }));
// //Better generic
// function betterEcho<T>(data: T) {
//     return data;
// }
// console.log(betterEcho('Louw'));
// console.log(betterEcho(34));
// console.log(betterEcho({ name: 'Louw', age: 34 }));
// //Generics make typescript aware of the output type. You will notice this when entering
// //betterEcho(34). - the IDE will not predict methods cast on strings, e.g. length
// // //You can specify what type you want to pass to the generic function:
// console.log(betterEcho<number>(34));
// //will error because we specify that we want to pass a number, but we are passing a string
// // // Built-in generics
// const testResults: Array<number> = [1.9, 2.33];
// testResults.push('string'); //error. by explicitly setting the type to number, the array will only accept numbers
// //Arrays
// function printAll<T>(args: T[]) {
//     args.forEach(element => console.log(element));
// }
// printAll<string | number>(['Apple', 24]);
// //Generic Types
// const echo2: <T>(data: T) => T = betterEcho;
// // Handy TS rule: all code before the equals sign is type assignment, everything after describes functionality or setting of values
// // //Generic Class
// class SimpleMathOne {
//     baseValue;
//     multiplyValue;
//     calculate() {
//         return this.baseValue * this.multiplyValue;
//     }
// }
// const simpleMathOne = new SimpleMathOne();
// //make it generic, using extends for multiple type assignment
// class SimpleMath<T, U extends number | string> {
//     baseValue: T;
//     multiplyValue: U;
//     calculate(): number {
//         return +this.baseValue * +this.multiplyValue; //+cast to number
//     }
// }
// const simpleMath = new SimpleMath<string, number>();
// simpleMath.baseValue = '10';
// simpleMath.multiplyValue = 20;
// console.log(simpleMath.calculate());
// // //DECORATORS - Limited support available
// // // // Decorators - basically meta data/functionality for classes, methods and parameters
//An error is displayed when compiling 'Experimental support for decorators is a feature that is subject to change in a future release'
//edit tsconfig.json add "experimentalDecorators": true
// // // //NOTE: a decorator is just a simple function, but its functionality is attached as meta functionality to classes, methods, properties and parameters
function logged(constructorFn) {
    console.log(constructorFn);
}
//Decorator usage
function logging(value) {
    return value ? logged : null; //returns the logged function if value is true, else returns null
}
// @logging(true) //returns the constructor only if true
// class Car {
//     name = 'Louw';
//     constructor() {
//         console.log('hi from class Car');
//     }
// }
// let x = new Car();
// console.log(logging);
// function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
//     return class extends constructor {
//         newProperty = "new property";
//         hello = "override";
//     }
// }
// @classDecorator
// class Greeter {
//     property = "property";
//     hello: string;
//     constructor(m: string) {
//         this.hello = m;
//     }
// }
// console.log(new Greeter("world"));
// // // // //ANOTHER DECORATOR
// function printable(constructorFn: Function) {
//     constructorFn.prototype.print = function () {
//         console.log('hi from the printable method')
//         console.log(this); //each object instantiated by a class with the printable decorator will automatically receive the print() method
//     };
// }
// @logging(false)
// @printable
// class Plant {
//     name = 'Green Plant';
// }
// const plant = new Plant();
// (<any>plant).print(); //existing bug in typescript that requires the any type assignment
// // // // //PARAMETER DECORATORS
// function printInfo(target: any, methodName: string, paramIndex: number) {
//     console.log('Target: ', target);
//     console.log('Method Name: ', methodName);
//     console.log('paramIndex ', paramIndex);
// }
// class Course {
//     name: string;
//     constructor(name: string) {
//         this.name = name;
//     }
//     printStudentNumbers(mode: string, @printInfo printall: boolean) {
//         if (printall) {
//             console.log(10000);
//         } else {
//             console.log(3000);
//         }
//     }
// }
// const course = new Course('Amazing Course');
// course.printStudentNumbers('anythingtrue', true);
// course.printStudentNumbers('anythingfalse', true);
// //JQUERY EXAMPLE TO FOLLOW - USE DEFINITELY TYPED as EXAMPLE
