"use strict";
window.addEventListener("DOMContentLoaded", start);

const Student = {
  firstName: "",
  lastName: "",
  middleName: undefined,
  nickName: "",
  gender: "",
  profilePic: "",
  house: "",
  expelled: false,
  prefect: false,
};

//make an empty array that can contain all students
let allStudents = [];

//In this assignment we need to link to a json file / API link
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

// //fetched data / global variables
let hogwartsData;

const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
  searchBy: "",
};

//start function, calls to load JSON function
function start() {
  console.log("hej Hogwarts");

  buttonListener();
}
function buttonListener() {
  const filterButtons = document.querySelectorAll('[data-action="filter"]');
  const sortButtons = document.querySelectorAll("[data-action='sort']");
  const searchBar = document.querySelector("#searchBar");

  filterButtons.forEach((button) =>
    button.addEventListener("click", selectFilter)
  );
  sortButtons.forEach((knap) => knap.addEventListener("click", selectSort));
  searchBar.addEventListener("keyup", searchFunction);

  loadJSON();
}

function expelStudent(student) {
  console.log("student expelled");
  student.expelled = true;
  buildList();
}

function selectSearch(event) {
  const searchFilter = event.target.value;
  setSearch(searchFilter);
}

function setSearch(searchFilter) {
  settings.searchBy = searchFilter;
  buildList();
}

function searchFunction(searchedStudents) {
  searchedStudents = allStudents.filter((student) => {
    return (
      student.firstName.toLowerCase().includes(settings.searchBy) ||
      student.lastName.toLowerCase().includes(settings.searchBy)
    );
  });
  return searchedStudents;
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

function prepareObjects(hogwartsData) {
  allStudents = hogwartsData.map(prepareStudents);
  buildList();
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
    student.expelled = false;
    student.prefect = false;
    allStudents.push(student);
    return student;
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

function isPrefect(student) {
  return student.prefect;
}

function isNotExpelled(student) {
  return !student.expelled;
}

function isExpelled(student) {
  return student.expelled;
}

function studentFilter(list) {
  if (settings.filterBy === "expelled") {
    list = list.filter(isExpelled);
  } else {
    list = list.filter(isNotExpelled);
    if (settings.filterBy === "gryffindor") {
      list = list.filter(isGryffindor);
    } else if (settings.filterBy === "hufflepuff") {
      list = list.filter(isHufflepuff);
    } else if (settings.filterBy === "ravenclaw") {
      list = list.filter(isRavenclaw);
    } else if (settings.filterBy === "slytherin") {
      list = list.filter(isSlytherin);
    } else if (settings.filterBy === "prefect") {
      list = list.filter(isPrefect);
    }
  }
  return list;
  //displayList(filteredList);
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
  const searchList = searchFunction(allStudents);
  const currentList = studentFilter(searchList);
  const sortedList = sortedStudents(currentList);

  displayList(sortedList);
}

// function searchFunction(element) {
//   const searchString = element.target.value.toLowerCase();
//   const filteredStudents = allStudents.filter((student) => {
//     return student.firstName.toLowerCase().includes(searchString);
//   });
//   displayList(filteredStudents);
// }

function displayList(studentList) {
  document.querySelector("#container").innerHTML = "";

  // build a new list
  studentList.forEach(displayStudent);
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

  if (student.prefect === true) {
    clone.querySelector("#prefect_status").textContent = "True";
  } else {
    clone.querySelector("#prefect_status").textContent = "False";
  }

  clone
    .querySelector("#more_info")
    .addEventListener("click", () => showPopup(student));

  if (student.expelled === true) {
    clone.querySelector("#expel_student").classList.add("hide"),
      (student.prefect = false);
  }

  clone
    .querySelector("#expel_student")
    .addEventListener("click", () => expelStudent(student));

  document.querySelector("#container").appendChild(clone);

  //   const expelButton = document.querySelector("#expel_student");
  //   expelButton.forEach((button) =>
  //     button.addEventListener("click", expelStudent(student))
  //   );
}

function showPopup(studentData) {
  console.log("show details");
  const popup = document.querySelector("#popup");
  popup.style.display = "block";
  //henter informationer om studerende
  popup.querySelector("#popup_firstname").textContent = studentData.firstName;
  popup.querySelector("#popup_nickname").textContent = studentData.nickName;
  popup.querySelector("#popup_middlename").textContent = studentData.middleName;
  popup.querySelector("#popup_lastname").textContent = studentData.lastName;
  popup.querySelector("#popup_house").textContent =
    "House:" + " " + studentData.house;
  popup.querySelector("#popup_gender").textContent =
    "Gender:" + " " + studentData.gender;
  popup.querySelector("img").src = studentData.profilePic;

  console.log(studentData);

  //eventlisteners på #close button

  popup.querySelector("#close").addEventListener("click", closePopup);

  function closePopup() {
    document.querySelector("#popup").style.display = "none";
    document.querySelector("#close").removeEventListener("click", closePopup);

    popup.querySelector("#prefect").removeEventListener("click", clickPrefect);
  }
  popup.querySelector("#prefect").addEventListener("click", clickPrefect);

  function clickPrefect() {
    console.log("clicked");
    if (studentData.prefect === true) {
      studentData.prefect = false;
    } else {
      tryToMakePrefect(studentData);
    }
    buildList();

    //after the click check if prefect status and change image according to that
    if (studentData.prefect === true) {
      popup.querySelector("#popup_prefect_status").textContent = " " + "True";
    } else {
      popup.querySelector("#popup_prefect_status").textContent = " " + "False";
    }
    //showPopup(studentData);
    //buildList();
  }

  function tryToMakePrefect(selectedStudent) {
    //make new array
    console.log("trying to make prefect");
    const prefects = allStudents.filter((student) => {
      if (student.house === selectedStudent.house && student.prefect === true) {
        return true;
      } else {
        return false;
      }
    });
    console.log("prefects", prefects);

    //there should only be one of each gender for each house
    //if theres more than one, give an option to remove one student
    let otherPrefect;
    let isOtherPrefectOfSameGender = prefects.some((student) => {
      if (selectedStudent.gender === student.gender) {
        otherPrefect = student;
        return true;
      } else {
        return false;
      }
    });
    console.log("isOtherPrefectOfSameGender", isOtherPrefectOfSameGender);
    console.log("otherPrefect", otherPrefect);

    if (isOtherPrefectOfSameGender) {
      console.log("there is already a prefect of this house and this gender");
      //remove 1s in array
      removeOther(otherPrefect);
    } else {
      makePrefect(selectedStudent);
    }

    console.log("selectedStudent", selectedStudent);

    function removeOther(otherPrefect) {
      //ask user to ignore or remove other
      document.querySelector("#warning_section").classList.remove("hide");
      document
        .querySelector("#close_warning_other")
        .addEventListener("click", closeWarningOther);
      document
        .querySelector("#remove_the_other")
        .addEventListener("click", clickRemoveOther(otherPrefect));

      document.querySelector("#other_prefect_name").textContent =
        otherPrefect.firstName + " " + otherPrefect.lastName;
    }
    function closeWarningOther() {
      //close warning and remove eventlistener
      document.querySelector("#warning_remove_other").classList.add("hide");
      document
        .querySelector("#remove_the_other")
        .removeEventListener("click", clickRemoveOther);
    }
    function clickRemoveOther() {
      console.log(selectedStudent);
      removePrefect(otherPrefect);
      makePrefect(selectedStudent);
      closePopup();
      showPopup(selectedStudent);
      buildList();
      closeWarningOther();
    }
    function removePrefect(student) {
      student.prefect = false;
    }
    function makePrefect(student) {
      student.prefect = true;
      console.log("student is now prefect");
    }
  }
}

//------------- uden gender-----------
//makePrefect(selectedStudent);

/*   if (prefects.length >= 2) {
    console.log("there can only be 2 prefects from each house!");
    //removeOther(prefects[0]);
  } else {
    console.log("you can make student prefect");
    //tryToMakePrefect(selectedStudent);
  } */
//-----------------------------------
