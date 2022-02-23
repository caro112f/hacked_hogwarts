"use strict";
window.addEventListener("DOMContentLoaded", start);

//create a new Student object that will contain all the needed data in an orderly fashion

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  profilePic: "",
  house: "",
};

//make an empty array that can contain all students
const allStudents = [];

//In this assignment we need to link to a json file / API link
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

//fetched data / global variables
let hogwartsData;

//start function, calls to load JSON function
function start() {
  console.log("hej Hogwarts");
  loadJSON();
}

//hent json data with async function
async function loadJSON() {
  const jsonData = await fetch(url);
  hogwartsData = await jsonData.json();
  //show hogwarts data in a table in the console
  console.table(hogwartsData);
  //call createStudents function
  createStudents();
}

function createStudents() {
  hogwartsData.forEach((stud) => {
    const student = Object.create(Student);

    //trimmed data + consts
    const fullName = stud.fullname.trim();

    const firstSpace = fullName.indexOf(" ");
    const lastSpace = fullName.lastIndexOf(" ");

    const fullMiddleName = fullName.substring(firstSpace + 1, lastSpace).trim();
    const house = stud.house.trim();
    const gender = stud.gender.trim();

    //find firstname

    if (fullName.includes(" ")) {
      student.firstName =
        fullName.substring(0, 1).toUpperCase() +
        fullName.substring(1, firstSpace).toLowerCase();
    } else {
      student.firstName =
        fullName.substring(0, 1).toUpperCase() + fullName.substring(1);
    }

    //find middlename + nickname
    //if middlename includes "" make it a nickname instead
    if (fullName.includes('"')) {
      student.nickName = fullName.substring(
        fullName.indexOf('"') + 1,
        fullName.lastIndexOf('"')
      );
    } else if (!fullName.includes('"')) {
      student.middleName =
        fullMiddleName.substring(0, 1).toUpperCase() +
        fullMiddleName.substring(1).toLowerCase();
    }

    if (fullMiddleName === "") {
      student.middleName = null;
    }

    //find lastname and make the first letter upper space + the rest lowercase
    student.lastName =
      fullName.substring(lastSpace + 1, lastSpace + 2).toUpperCase() +
      fullName.substring(lastSpace + 2).toLowerCase();

    //find gender
    student.gender =
      gender.substring(0, 1).toUpperCase() + gender.substring(1).toLowerCase();

    //find profilePic
    //to find pic we have set names to lowercase
    //and we have to have the first letter of firstname
    const smallLastName = fullName.substring(lastSpace + 1).toLowerCase();
    const firstLetterOfName = fullName.substring(0, 1).toLowerCase();
    //find the file under images and take the small lastname + "_" + first letter of first name
    student.profilePic = `images/${smallLastName}_${firstLetterOfName}.png`;

    //find house
    student.house =
      house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();

    //put student in the allStudents array
    allStudents.push(student);
  });
  //show data in a table in the console
  console.table(allStudents);
}
