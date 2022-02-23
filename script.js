"use strict";

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

window.addEventListener("DOMContentLoaded", start);

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
  prepareStudents();
}
function prepareStudents() {
  firstName = getFirstName();
  middleName = getMiddleName();
  nickName = getNickName();
  lastName = getLastName();
  gender = getGender();
  house = getHouse();
  profilePic = getProfilePic();
}

function getFirstName() {}
function getMiddleName() {}
function getNickName() {}
function getLastName() {}
function getGender() {}
function getHouse() {}
function getProfilePic() {}
function cleanData() {}
