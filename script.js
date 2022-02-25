"use strict";

const Student = {
  firstName: "",
  lastName: "",
  middleName: undefined,
  nickName: "",
  gender: "",
  profilePic: "",
  house: "",
};
const settings = {
  filterBy: "all",
  sortBy: "first_name",
  sortDir: "asc",
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

  buttonListener();
  loadJSON();
}

//hent json data with async function
async function loadJSON() {
  const jsonData = await fetch(url);
  hogwartsData = await jsonData.json();
  //show hogwarts data in a table in the console
  console.table(hogwartsData);
  //call prepareStudents function
  prepareStudents(hogwartsData);
}
function prepareStudents() {
  hogwartsData.forEach((stud) => {
    const student = Object.create(Student);
    student.firstName = getFirstName(stud.fullname.trim());
    student.middleName = getMiddleName(stud.fullname.trim());
    student.nickName = getNickName(stud.fullname.trim());
    student.lastName = getLastName(stud.fullname.trim());
    student.gender = getGender(stud.gender.trim());
    student.house = getHouse(stud.house.trim());
    student.profilePic = getProfilePic(stud.fullname.trim());
    allStudents.push(student);
  });
  displayList(allStudents);
}

function getFirstName(fullname) {
  //find first name
  if (fullname.includes(" ")) {
    let firstName = fullname.substring(
      fullname.indexOf(0),
      fullname.indexOf(" ")
    );
    const cleanedFirstName = cleanData(firstName);
    return cleanedFirstName;
  } else {
    const cleanedFirstName = cleanData(fullname);
    return cleanedFirstName;
  }
}

function getMiddleName(fullname) {
  const middleSpace = fullname.slice(
    fullname.indexOf(" ") + 1,
    fullname.lastIndexOf(" ")
  );

  if (!fullname.includes('"') && fullname.includes(" ")) {
    let middleName = middleSpace;
    const cleanedMiddleName = cleanData(middleName);
    return cleanedMiddleName;
  } else if (middleSpace === "") {
    let middleName = null;
    return middleName;
  }
}
function getNickName(fullname) {
  if (fullname.includes('"')) {
    let nickName = fullname.substring(
      fullname.indexOf('"') + 1,
      fullname.lastIndexOf('"')
    );
    const cleanedNickName = cleanData(nickName);
    return cleanedNickName;
  }
}
function getLastName(fullname) {
  const lastName = fullname.substring(fullname.lastIndexOf(" ") + 1);

  if (lastName.includes("-")) {
    //split middleName into an array
    const lastNameArray = lastName.split("");

    lastNameArray.forEach((element, index, array) => {
      // if the element contains a "-" or space make the letter afterwards uppercase
      if (element === "-" || element === " ") {
        array[index + 1] = array[index + 1].toUpperCase();
      }
    });

    //then join the array into a new string by concat all elements in the array
    let result = lastNameArray.join("");
    return result;
  } else if (!fullname.includes(" ")) {
    let lastName = null;
    return lastName;
  } else {
    const cleanedLastName = cleanData(lastName);
    return cleanedLastName;
  }
}
function getGender(gender) {
  const cleanGender = cleanData(gender);
  return cleanGender;
}
function getHouse(house) {
  const cleanHouse = cleanData(house);
  return cleanHouse;
}

function getProfilePic(fullname) {
  const lastNameLowerCase = fullname
    .substring(fullname.lastIndexOf(" ") + 1)
    .toLowerCase();
  const firstName = fullname.substring(
    fullname.indexOf(0),
    fullname.indexOf(" ")
  );
  const firstNameLowerCase = firstName.toLowerCase();

  const smallFirstLetterOfFirstName = firstNameLowerCase
    .slice(0, 1)
    .toLowerCase();

  if (lastNameLowerCase === "patil") {
    const profilePic = `images/${lastNameLowerCase}_${firstNameLowerCase}.png`;
    return profilePic;
  } else if (lastNameLowerCase.includes("-")) {
    const secondLastNameLowerCase = lastNameLowerCase.slice(
      lastNameLowerCase.indexOf("-") + 1
    );
    const profilePic = `images/${secondLastNameLowerCase}_${smallFirstLetterOfFirstName}.png`;
    return profilePic;
  } else if (lastNameLowerCase === "leanne") {
    const profilePic = `images/default.png`;
    return profilePic;
  } else {
    const profilePic = `images/${lastNameLowerCase}_${smallFirstLetterOfFirstName}.png`;
    return profilePic;
  }
}

function cleanData(data) {
  //trim + capitalize
  const capitalizeFirstLetter = data.slice(0, 1).toUpperCase();
  const lowercaseTheRest = data.slice(1).toLowerCase();
  const cleanedData = capitalizeFirstLetter + lowercaseTheRest;

  return cleanedData;
}

function buttonListener() {
  const filterButtons = document.querySelectorAll('[data-action="filter"]');
  const sortButtons = document.querySelectorAll("[data-action='sort']");
  const searchBar = document.querySelector("#searchBar");

  searchBar.addEventListener("keyup", searchFunction);

  filterButtons.forEach((button) =>
    button.addEventListener("click", selectFilter)
  );
  sortButtons.forEach((knap) => knap.addEventListener("click", selectSort));
}
function selectFilter(event) {
  //filter on a criteria
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  console.log("setfilter");
  buildList();
}
function studentFilter(filteredList) {
  //let filteredList = allAnimals;
  //get filter depending on data-filter attribute
  //filter allAnimals with correct filter function  and put it into filteredAnimals
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  }
  return filteredList;
  //displayList(filteredList);
}
function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}
function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}
function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}
function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}
function sortedStudents(sortedList) {
  //let sortedList = allAnimals;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(a, b) {
    console.log("clicked");
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}
function buildList() {
  const currentList = studentFilter(allStudents);
  console.log(currentList);
  const sortedList = sortedStudents(currentList);

  displayList(sortedList);
}

function searchFunction(element) {
  const searchString = element.target.value.toLowerCase();
  const filteredStudents = allStudents.filter((student) => {
    return student.firstName.toLowerCase().includes(searchString);
  });
  displayList(filteredStudents);
}

function displayList(students) {
  document.querySelector("#container").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("#loop_template")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("#firstname").textContent = student.firstName;
  clone.querySelector("#lastname").textContent = student.lastName;
  clone.querySelector("#gender").textContent = student.gender;
  clone.querySelector("#house").textContent = student.house;
  clone.querySelector("img").src = student.profilePic;
  clone
    .querySelector("#more_info")
    .addEventListener("click", () => showDetails(student));

  document.querySelector("#container").appendChild(clone);
}

function showDetails(studentData) {
  const popup = document.querySelector("#popup");
  popup.classList.remove("hide");
  popup.querySelector("#popup_firstname").textContent = studentData.firstName;
  popup.querySelector("#popup_nickname").textContent = studentData.nickName;
  popup.querySelector("#popup_middlename").textContent = studentData.middleName;
  popup.querySelector("#popup_lastname").textContent = studentData.lastName;
  popup.querySelector("#popup_gender").textContent = studentData.gender;
  popup.querySelector("#popup_house").textContent = studentData.house;
  popup.querySelector("img").src = studentData.profilePic;
}
document
  .querySelector("#close")
  .addEventListener("click", () => popup.classList.add("hide"));
