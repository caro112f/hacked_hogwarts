"use strict";

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  profilePic: "",
  house: "",
  expelled: false,
  prefect: false,
  bloodstatus: "",
  InqSquad: false,
  hacker: false,
};
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};
//make an empty array that can contain all students
const allStudents = [];

let hacked = false;

//In this assignment we need to link to a json file / API link
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

const url2 = "https://petlatkea.dk/2021/hogwarts/families.json";

//fetched data / global variables
let hogwartsData;

let bloodData;

window.addEventListener("DOMContentLoaded", start);

//start function, calls to load JSON function
async function start() {
  await loadJSON();
  await loadJSONFamilies();
  prepareStudents();
  buttonListener();
}

//hent json data with async function
async function loadJSON() {
  const jsonData = await fetch(url);
  hogwartsData = await jsonData.json();
  //show hogwarts data in a table in the console
  console.table(hogwartsData);
  //call prepareStudents function
}

async function loadJSONFamilies() {
  const jsonBlood = await fetch(url2);
  bloodData = await jsonBlood.json();
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
    student.bloodstatus = getBloodStatus(student);
    student.InqSquad = false;
    allStudents.push(student);
  });
  //displayList(allStudents);
  buildList();
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

function getBloodStatus(student) {
  if (bloodData.half.includes(student.lastName)) {
    return "Halfblood";
  } else if (bloodData.pure.includes(student.lastName)) {
    return "Pureblood";
  } else {
    return "Muggleborn";
  }
}

function buttonListener() {
  const filterButtons = document.querySelectorAll('[data-action="filter"]');
  const sortButtons = document.querySelectorAll('[data-action="sort"]');
  document
    .querySelector("#hack_button")
    .addEventListener("click", hackTheSystem);

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
  document.querySelector(".chosen").classList.remove("chosen");
  this.classList.add("chosen");
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}
function studentFilter(list) {
  if (settings.filterBy === "expelled") {
    list = allStudents.filter(isExpelled);
  } else {
    list = allStudents.filter(isNotExpelled);
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
    } else if (settings.filterBy === "InqSquad") {
      list = list.filter(isSquadMember);
    }
    //displayList(filteredList);
  }
  return list;
}

function isSquadMember(student) {
  return student.InqSquad;
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
function isExpelled(student) {
  return student.expelled;
}
function isNotExpelled(student) {
  return !student.expelled;
}

function isPrefect(student) {
  return student.prefect;
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
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(a, b) {
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

  // Number of students expelled
  let numOfExpelledStudents = allStudents.filter(
    (student) => student.expelled
  ).length;

  document.querySelector("#num_expelled_students").textContent =
    "Expelled students: " + numOfExpelledStudents;

  //Total number active students (not expelled)

  const activeStudents = allStudents.length - numOfExpelledStudents;

  document.querySelector("#num_active_students").textContent =
    "Active students: " + activeStudents;

  // Number of students currently displayed

  let numCurrentDisplay = students.length;

  document.querySelector("#num_current_display").textContent =
    "Currently displayed: " + numCurrentDisplay;

  //Number of students in each house
  let numOfActiveStudents = [];

  numOfActiveStudents = allStudents.filter((student) => {
    if (!student.expelled) {
      return true;
    } else {
      return false;
    }
  });

  let numStudentsGryffindor = numOfActiveStudents.filter(isGryffindor).length;

  document.querySelector("#num_gryffindor").textContent =
    "Gryffindors: " + numStudentsGryffindor;

  let numStudentsHufflepuff = numOfActiveStudents.filter(isHufflepuff).length;

  document.querySelector("#num_hufflepuff").textContent =
    "Hufflepuffs: " + numStudentsHufflepuff;

  let numStudentsSlytherin = numOfActiveStudents.filter(isSlytherin).length;

  document.querySelector("#num_slytherin").textContent =
    "Slytherins: " + numStudentsSlytherin;

  let numStudentsRavenclaw = numOfActiveStudents.filter(isRavenclaw).length;

  document.querySelector("#num_ravenclaw").textContent =
    "Ravenclaws: " + numStudentsRavenclaw;
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

  clone
    .querySelector("#expel_student")
    .addEventListener("click", () => expelStudent(student));

  if (student.prefect === true) {
    clone.querySelector("#prefect_status").classList.remove("hide");
  } else {
    clone.querySelector("#prefect_status").classList.add("hide");
  }

  if (student.InqSquad === true) {
    clone.querySelector("#isMember").classList.remove("hide");
  } else {
    clone.querySelector("#isMember").classList.add("hide");
  }

  if (student.house === "Gryffindor") {
    clone.querySelector("#loopview_article").style.backgroundColor =
      "rgba(155, 44, 44, 0.616)";
    clone.querySelector("#loopview_article").style.color = "#fff";
  } else if (student.house === "Hufflepuff") {
    clone.querySelector("#loopview_article").style.backgroundColor =
      "#db954a9c";
    clone.querySelector("#loopview_article").style.color = "#000";
  } else if (student.house === "Slytherin") {
    clone.querySelector("#loopview_article").style.backgroundColor =
      "#296b1a85";
    clone.querySelector("#loopview_article").style.color = "#fff";
  } else if (student.house === "Ravenclaw") {
    clone.querySelector("#loopview_article").style.backgroundColor =
      "#362d8083";
    clone.querySelector("#loopview_article").style.color = "#fff";
  }

  document.querySelector("#container").appendChild(clone);

  //   const expelButton = document.querySelector("#expel_student");
  //   expelButton.forEach((button) =>
  //     button.addEventListener("click", expelStudent(student))
  //   );
}

function expelStudent(student) {
  if (student.hacker === false) {
    student.expelled = true;
  } else {
    student.expelled = false;
    warningHacking();
  }
  buildList();
}

function warningHacking() {
  document.querySelector("#hacking_warning_section").classList.remove("hide");
  document
    .querySelector("#close_hacking_warning")
    .addEventListener("click", closeHackingWarning);

  function closeHackingWarning() {
    document.querySelector("#hacking_warning_section").classList.add("hide");
    document
      .querySelector("#close_hacking_warning")
      .removeEventListener("click", closeHackingWarning);
  }
}

function showDetails(student) {
  //document.querySelector("#close").removeEventListener("click", closePopup);

  const popup = document.querySelector("#popup");
  popup.style.display = "block";
  //henter informationer om studerende
  popup.querySelector("#popup_firstname").textContent = student.firstName;
  popup.querySelector("#popup_nickname").textContent = student.nickName;
  popup.querySelector("#popup_middlename").textContent = student.middleName;
  popup.querySelector("#popup_lastname").textContent = student.lastName;
  popup.querySelector("#popup_house").textContent =
    "House:" + " " + student.house;
  popup.querySelector("#popup_gender").textContent =
    "Gender:" + " " + student.gender;
  popup.querySelector("#bloodstatus").textContent =
    "Bloodstatus:" + " " + student.bloodstatus;
  popup.querySelector("img").src = student.profilePic;

  if (student.prefect === true) {
    document.querySelector('[data-field="prefect"]').textContent = "⭐ Prefect";
    // document.querySelector("#prefect_status").classList.remove("hide");
  } else {
    document.querySelector('[data-field="prefect"]').textContent =
      "★ Not prefect";
    //document.querySelector("#prefect_status").classList.add("hide");
  }

  if (student.InqSquad === true) {
    document.querySelector('[data-field="InqSquad"]').textContent =
      "💎 Inquisitorial Member";
    //document.querySelector("#isMember").classList.remove("hide");
  } else {
    document.querySelector('[data-field="InqSquad"]').textContent =
      "♦ Not Inquisitorial Member";
    //document.querySelector("#isMember").classList.add("hide");
  }

  if (student.house === "Gryffindor") {
    document.querySelector("#article_popup").style.backgroundColor = "#7B1702";
    document.querySelector("#article_popup").style.color = "#fff";
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#article_popup").style.backgroundColor = "#EBAD6B";
    document.querySelector("#article_popup").style.color = "#000";
  } else if (student.house === "Slytherin") {
    document.querySelector("#article_popup").style.backgroundColor = "#145405";
    document.querySelector("#article_popup").style.color = "#fff";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#article_popup").style.backgroundColor = "#1C145A";
    document.querySelector("#article_popup").style.color = "#fff";
  }

  popup.querySelector("#close").addEventListener("click", closePopup);
  document
    .querySelector('[data-field="prefect"]')
    .addEventListener("click", clickPrefectCallBack);

  document
    .querySelector('[data-field="InqSquad"]')
    .addEventListener("click", clickInqSquadCallBack);

  function clickPrefectCallBack(event) {
    clickPrefect(student);
  }
  function clickInqSquadCallBack(event) {
    clickInqSquad(student);
  }
  function closePopup() {
    document.querySelector("#close").removeEventListener("click", closePopup);

    document.querySelector("#popup").style.display = "none";

    const popup = document.querySelector("#popup");

    popup
      .querySelector('[data-field="prefect"]')
      .removeEventListener("click", clickPrefectCallBack);
    popup
      .querySelector('[data-field="InqSquad"]')
      .removeEventListener("click", clickInqSquadCallBack);
  }
  //   popup.querySelector("#make_prefect").addEventListener("click", clickPrefect);
}
function clickPrefect(student) {
  if (student.prefect === true) {
    student.prefect = false;
    // document.querySelector('[data-field="prefect"]').textContent = "★ prefect";
    // document.querySelector("#prefect_status").classList.add("hide");
  } else {
    tryToMakePrefect(student);
  }
  buildList();
  if (student.prefect === true) {
    document.querySelector('[data-field="prefect"]').textContent = "⭐ Prefect";
    //document.querySelector("#prefect_status").classList.remove("hide");
  } else {
    document.querySelector('[data-field="prefect"]').textContent =
      "★ Not prefect";
    //document.querySelector("#prefect_status").classList.add("hide");
  }
}

function clickInqSquad(student) {
  if (student.InqSquad === true) {
    student.InqSquad = false;
    document.querySelector('[data-field="InqSquad"]').textContent =
      "♦ Not Inquisitorial Member";
    //document.querySelector("#isMember").classList.add("hide");
    console.log("not a member anymore");
  } else {
    console.log("not member now, try to make one");
    tryToMakeMember(student);
  }
  console.log("STUDENT IS MEMBER", student.InqSquad);
  buildList();
  if (student.InqSquad === true) {
    document.querySelector('[data-field="InqSquad"]').textContent =
      "💎 Inquisitorial Member";
    //document.querySelector("#isMember").classList.remove("hide");
  } else {
    document.querySelector('[data-field="InqSquad"]').textContent =
      "♦ Not Inquisitorial Member";
    //document.querySelector("#isMember").classList.add("hide");
  }
}

function tryToMakePrefect(selectedStudent) {
  //make new array
  const prefects = allStudents.filter((student) => {
    if (student.house === selectedStudent.house && student.prefect === true) {
      return true;
    } else {
      return false;
    }
  });

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

  if (isOtherPrefectOfSameGender) {
    console.log("there is already a prefect of this house and this gender");
    //remove 1s in array
    showWarning(selectedStudent, otherPrefect);
  } else {
    makePrefect(selectedStudent);
  }
}

function makePrefect(student) {
  student.prefect = true;
  //   document.querySelector('[data-field="prefect"]').textContent = "⭐ prefect";
  //   document.querySelector("#prefect_status").classList.remove("hide");
  console.log(student);
}
function showWarning(student, otherPrefect) {
  //ask user to ignore or remove other
  document.querySelector("#warning_section").classList.remove("hide");

  document
    .querySelector("#close_warning")
    .addEventListener("click", closeWarning);

  document.querySelector("#this_prefect_name").textContent =
    "This prefects name: " + student.firstName + " " + student.lastName;

  document.querySelector("#other_prefect_name").textContent =
    "Other prefects name: " +
    otherPrefect.firstName +
    " " +
    otherPrefect.lastName;

  document
    .querySelector("#remove_the_other")
    .addEventListener("click", onClickRemove);

  function onClickRemove(event) {
    otherPrefect.prefect = false;
    makePrefect(student);
    closeWarning();
    document
      .querySelector("#remove_the_other")
      .removeEventListener("click", onClickRemove);
  }
}
function closeWarning() {
  //close warning and remove eventlistener
  document.querySelector("#warning_section").classList.add("hide");

  document
    .querySelector("#close_warning")
    .removeEventListener("click", closeWarning);
}

function tryToMakeMember(student) {
  if (student.house === "Slytherin" || student.bloodstatus === "Pureblood") {
    student.InqSquad = true;

    if (hacked === true) {
      setTimeout(cancelMembership, 2000, student);
      function cancelMembership(student) {
        student.InqSquad = false;
        document.querySelector('[data-field="InqSquad"]').textContent =
          "♦ Not Inquisitorial Member";
        console.log("not member anymore");
        buildList();
      }
    }
  } else {
    student.InqSquad = false;
    showClubWarning();
  }
}

function showClubWarning() {
  document.querySelector("#club_warning_section").classList.remove("hide");
  document
    .querySelector("#close_club_warning")
    .addEventListener("click", closeClubWarning);

  function closeClubWarning() {
    document.querySelector("#club_warning_section").classList.add("hide");
    document
      .querySelector("#close_club_warning")
      .removeEventListener("click", closeClubWarning);
  }
}

function hackTheSystem() {
  hacked = true;
  document
    .querySelector("#hack_button")
    .removeEventListener("click", hackTheSystem);

  document.querySelector("h1").style.color = "#FF0000";
  document.querySelector("#hack_button").style.backgroundColor = "#FF0000";
  document.querySelector("#hack_button").textContent = "YOU ARE HACKED";

  console.log("system hacked");
  const newStudent = {
    firstName: "Caroline",
    middleName: "Holm",
    nickName: "Caro",
    gender: "Girl",
    lastName: "Nielsen",
    profilePic: "images/default.png",
    house: "Gryffindor",
    prefect: false,
    expelled: false,
    bloodstatus: "Muggleborn",
    InqSquad: false,
    hacker: true,
  };

  allStudents.unshift(newStudent);
  randomizeBloodStatus();

  //   document
  //     .querySelector('[data-field="club"]')
  //     .addEventListener("click", removeMembership(newStudent));

  buildList();
}
function randomizeBloodStatus() {
  allStudents.forEach((student) => {
    if (student.bloodstatus === "Muggleborn") {
      student.bloodstatus = "Pureblood";
    } else if (student.bloodstatus === "Halfblood") {
      student.bloodstatus = "Pureblood";
    } else {
      let bloodStatusRandom = Math.floor(Math.random() * 3);
      if (bloodStatusRandom === 0) {
        student.bloodstatus = "Pureblood";
      } else if (bloodStatusRandom === 1) {
        student.bloodstatus = "Halfblood";
      } else {
        student.bloodstatus = "Muggleborn";
      }
    }
    console.log("bloodstatus randomized");
  });
}
