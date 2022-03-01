"use strict";
window.addEventListener("DOMContentLoaded", start);

//student object
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
};

//empty array for students
let allStudents = [];

//url to json data
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

//let hogwartsData;

const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
  searchBy: "",
};

function start() {
  console.log("Hej Hogwarts");
  buttonListener();
}

function buttonListener() {
  //filter buttons
  const filterButtons = document.querySelectorAll(".filter");
  filterButtons.forEach((button) =>
    button.addEventListener("click", selectFilter)
  );

  //sort buttons
  const sortButtons = document.querySelectorAll(".sort");
  sortButtons.forEach((knap) => knap.addEventListener("click", selectSort));

  const searchBar = document.querySelector("#searchBar");
  searchBar.addEventListener("keyup", selectSearch);
  //console.log(event.target.value);

  loadJSON();
}

function expelStudent(student) {
  console.log("expelled bish");
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

/* function rotateArrow() {
  console.log("arrow func");
  //const arrow = document.querySelectorAll(".arrows");

  //arrow.classList.add("rotate");

  selectSort();
} */

async function loadJSON() {
  const jsonData = await fetch(url);
  const hogwartsData = await jsonData.json();
  //show hogwarts data in a table in the console
  //console.table(hogwartsData);
  //call createStudents function
  prepareObjects(hogwartsData);
}

function prepareObjects(hogwartsData) {
  allStudents = hogwartsData.map(prepareStudents);
  buildList();
}
//delegator
function prepareStudents(stud) {
  const student = Object.create(Student);

  /*   student.fullName = getFullName(stud.fullname.trim()); */
  student.firstName = getFirstName(stud.fullname.trim());
  student.middleName = getMiddleName(stud.fullname.trim());
  student.nickName = getNickname(stud.fullname.trim());
  student.lastName = getLastName(stud.fullname.trim());
  student.gender = getGender(stud.gender.trim());
  student.house = getHouse(stud.house.trim());
  student.img = getStudentImg(stud.fullname.trim());
  student.expelled = false;
  student.prefect = false;

  return student;
  //allStudents.push(student);
}

/* function prepareStudents() {
  hogwartsData.forEach((stud) => {
    const student = Object.create(Student);
    student.firstName = getFirstName(stud.fullname.trim());
    student.middleName = getMiddleName(stud.fullname.trim());
    student.nickName = getNickname(stud.fullname.trim());
    student.lastName = getLastName(stud.fullname.trim());
    student.gender = getGender(stud.gender.trim());
    student.house = getHouse(stud.house.trim());
    student.img = getStudentImg(stud.fullname.trim());

    return student;
    //allStudents.push(student);
  });
} */

//filter
function selectFilter(event) {
  //filter on a criteria
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  document.querySelector(".chosen").classList.remove("chosen");
  this.classList.add("chosen");
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  console.log("setfilter");
  buildList();
}

//House filter functions
//gryffindor
function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

//slytherin
function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}
//ravenclaw
function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

//hufflepuff
function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
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
  //get filter depending on data-filter attribute
  if (settings.filterBy === "expelled") {
    list = list.filter(isExpelled);
  } else {
    list = list.filter(isNotExpelled);
    if (settings.filterBy === "gryffindor") {
      list = list.filter(isGryffindor);
    } else if (settings.filterBy === "slytherin") {
      list = list.filter(isSlytherin);
    } else if (settings.filterBy === "ravenclaw") {
      list = list.filter(isRavenclaw);
    } else if (settings.filterBy === "hufflepuff") {
      list = list.filter(isHufflepuff);
    } else if (settings.filterBy === "prefect") {
      list = list.filter(isPrefect);
    }
  }
  return list;
}

function selectSort(event) {
  console.log("click");
  /*   document.querySelector(".arrows").classList.remove("rotate");
  document.querySelector(".arrows").classList.add("rotate"); */
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
  /*   const arrows = document.querySelectorAll(".arrow"); */

  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  /*   if (settings.sortDir === "desc") {
    arrows.textContent = "⭐";
  } else if (settings.sortDir === "asc") {
    arrows.textContent = "☆";
  }
 */
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

/* function getFullName(fullname) {
  let cleanFullName = cleanData(fullname);
  return cleanFullName;
}
 */
function getFirstName(fullname) {
  if (fullname.includes(" ")) {
    let firstName = fullname.slice(0, fullname.indexOf(" "));
    let cleanFirstName = cleanData(firstName);
    return cleanFirstName;
  } else {
    let cleanFirstName = cleanData(fullname);
    return cleanFirstName;
  }
}

function getMiddleName(fullname) {
  const firstSpace = fullname.indexOf(" ");
  const lastSpace = fullname.lastIndexOf(" ");
  const fullMiddleName = fullname.substring(firstSpace + 1, lastSpace).trim();
  if (!fullname.includes('"') && fullname.includes(" ")) {
    let middleName =
      fullMiddleName.substring(0, 1) + fullMiddleName.substring(1);
    const cleanedMiddleName = cleanData(middleName);
    return cleanedMiddleName;
  } else if (fullMiddleName === "") {
    let middleName = null;
    return middleName;
  }
}

function getNickname(fullname) {
  if (fullname.includes('"')) {
    let nickName = fullname.substring(
      fullname.indexOf('"') + 1,
      fullname.lastIndexOf('"')
    );

    let cleanNickname = cleanData(nickName);
    return cleanNickname;
  }
}

function getLastName(fullname) {
  const lastName = fullname.substring(fullname.lastIndexOf(" ") + 1);

  if (lastName.includes("-")) {
    //split lastname into an array
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
    let lastName = "";
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

function getStudentImg(fullname) {
  const firstName = fullname.slice(0, fullname.indexOf(" ")).toLowerCase();
  const lastName = fullname.substring(fullname.lastIndexOf(" ") + 1);

  const imgFirstNameFirstLetter = firstName.substring(0, 1);
  const smallLastName = lastName.toLowerCase();

  if (smallLastName === "patil") {
    const image = `img/${smallLastName}_${firstName}.png`;
    return image;
  } else if (smallLastName.includes("-")) {
    const smallLastNameShort = smallLastName.slice(
      smallLastName.indexOf("-") + 1
    );
    const image = `img/${smallLastNameShort}_${imgFirstNameFirstLetter}.png`;
    return image;
  } else if (smallLastName === "leanne") {
    const image = `img/default.png`;
    return image;
  } else {
    const image = `img/${smallLastName}_${imgFirstNameFirstLetter}.png`;
    return image;
  }
}

function cleanData(data) {
  //capitalize
  const capFirstLetter = data.slice(0, 1).toUpperCase();
  const lowerCaseRest = data.slice(1).toLowerCase();
  const cleanData = capFirstLetter + lowerCaseRest;
  return cleanData;
}

function buildList() {
  const searchList = searchFunction(allStudents);
  const currentList = studentFilter(searchList);
  const sortedList = sortedStudents(currentList);

  displayList(sortedList);
  //const searchList = searchFunction(currentList);

  /*   const searchList = searchFunction(allStudents);
  const currentList = studentFilter(searchList);
  //const searchList = searchFunction(currentList);
  const sortedList = sortedStudents(currentList); */
}

function displayList(studentList) {
  // clear the list
  document.querySelector("#student_container").innerHTML = "";
  // build a new list
  studentList.forEach(displayStudent);
}

function displayStudent(student) {
  //create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  //set clone data
  clone.querySelector(".firstname").textContent = student.firstName;
  clone.querySelector(".lastname").textContent = student.lastName;
  clone.querySelector("img.student_img").src = student.img;
  //clone.querySelector(".house").textContent = student.house;

  //show prefect badge on article
  if (student.prefect === true) {
    clone.querySelector(".prefect_badge").src = "billeder/prefect_true.png";
  } else {
    clone.querySelector(".prefect_badge").src = "";
  }
  //popup button
  clone
    .querySelector("#upper_article")
    .addEventListener("click", () => showPopup(student));

  //showhouse but as image and also different color name for each house
  if (student.house === "Gryffindor") {
    (clone.querySelector(".article_house").src = "billeder/gryffindor_1.png"),
      clone.querySelector(".fullname").classList.add("text_color_gryf");
  } else if (student.house === "Slytherin") {
    (clone.querySelector(".article_house").src = "billeder/slytherin.png"),
      clone.querySelector(".fullname").classList.add("text_color_slyth");
  } else if (student.house === "Ravenclaw") {
    (clone.querySelector(".article_house").src = "billeder/ravenclaw.png"),
      clone.querySelector(".fullname").classList.add("text_color_raven");
  } else if (student.house === "Hufflepuff") {
    (clone.querySelector(".article_house").src = "billeder/hufflepuff.png"),
      clone.querySelector(".fullname").classList.add("text_color_huffle");
  }

  //if student is expelled: hide expel button + remove as prefect + remove prefect badge
  if (student.expelled === true) {
    clone.querySelector(".expel_button").classList.add("hidden"),
      (student.prefect = false),
      (clone.querySelector(".prefect_badge").src = "");
  }

  //expel button
  clone
    .querySelector(".expel_button")
    .addEventListener("click", () => expelStudent(student));

  document.querySelector("#student_container").appendChild(clone);
}

//popup details for students
function showPopup(studentData) {
  const popup = document.querySelector("#popup");
  popup.style.display = "block";
  popup.querySelector(".popup_studentimg").src = studentData.img;
  popup.querySelector(".popup_firstname").textContent = studentData.firstName;
  popup.querySelector(".popup_middlename").textContent = studentData.middleName;
  popup.querySelector(".popup_nickname").textContent = studentData.nickName;
  popup.querySelector(".popup_lastname").textContent = studentData.lastName;
  popup.querySelector(".popup_gender").textContent =
    "Gender: " + studentData.gender;
  //FOR BLOODTYPE
  //popup.querySelector(".popup_bloodtype").textContent ="Blood Type: " + studentData.bloodtype;

  console.log(studentData);

  //make close button
  document
    .querySelector(".popup_closebutton #close_popup")
    .addEventListener("click", closePopup);

  function closePopup() {
    document.querySelector("#popup").style.display = "none";

    //fjern listener fra prefect button
    popup
      .querySelector("#toggle_prefect")
      .removeEventListener("click", clickPrefect);
    //remove all classes and img that are house based
    popup.querySelector(".popup_house").src = "";
    popup.querySelector(".popup_fullname").classList.remove("text_color_gryf");
    popup.querySelector(".popup_bg_color").classList.remove("bg_color_gryf");
    popup.querySelector(".popup_fullname").classList.remove("text_color_slyth");
    popup.querySelector(".popup_bg_color").classList.remove("bg_color_slyth");
    popup.querySelector(".popup_fullname").classList.remove("text_color_raven"),
      popup.querySelector(".popup_bg_color").classList.remove("bg_color_raven");
    popup
      .querySelector(".popup_fullname")
      .classList.remove("text_color_huffle"),
      popup
        .querySelector(".popup_bg_color")
        .classList.remove("bg_color_huffle");
  }

  //remove buttons on expelled studens
  if (studentData.expelled === true) {
    popup.querySelector(".popup_makebuttons").classList.add("hide");
  } else {
    popup.querySelector(".popup_makebuttons").classList.remove("hide");
  }

  //showhouse: image, name color and bg color
  if (studentData.house === "Gryffindor") {
    (popup.querySelector(".popup_house").src = "billeder/gryffindor_1.png"),
      popup.querySelector(".popup_fullname").classList.add("text_color_gryf");
    popup.querySelector(".popup_bg_color").classList.add("bg_color_gryf");
  } else if (studentData.house === "Slytherin") {
    (popup.querySelector(".popup_house").src = "billeder/slytherin.png"),
      popup.querySelector(".popup_fullname").classList.add("text_color_slyth"),
      popup.querySelector(".popup_bg_color").classList.add("bg_color_slyth");
  } else if (studentData.house === "Ravenclaw") {
    (popup.querySelector(".popup_house").src = "billeder/ravenclaw.png"),
      popup.querySelector(".popup_fullname").classList.add("text_color_raven"),
      popup.querySelector(".popup_bg_color").classList.add("bg_color_raven");
  } else if (studentData.house === "Hufflepuff") {
    (popup.querySelector(".popup_house").src = "billeder/hufflepuff.png"),
      popup.querySelector(".popup_fullname").classList.add("text_color_huffle"),
      popup.querySelector(".popup_bg_color").classList.add("bg_color_huffle");
  }

  //set expelled image on load up
  if (studentData.expelled === false) {
    popup.querySelector(".popup_expelled").src = "billeder/expelled_false.png";
  } else {
    popup.querySelector(".popup_expelled").src = "billeder/expelled_true.png";
  }
  //set prefect image on load up of popup
  if (studentData.prefect === true) {
    popup.querySelector("#prefect_img").src = "billeder/prefect_true.png";
  } else {
    popup.querySelector("#prefect_img").src = "billeder/prefect_false.png";
  }

  //listen to click on toggle prefect
  popup
    .querySelector("#toggle_prefect")
    .addEventListener("click", clickPrefect);

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
      popup.querySelector("#prefect_img").src = "billeder/prefect_true.png";
    } else {
      popup.querySelector("#prefect_img").src = "billeder/prefect_false.png";
    }
    //showPopup(studentData);
    //buildList();
  }

  function tryToMakePrefect(selectedStudent) {
    //array for prefects
    const prefects = [];
    //find prefects and add to array
    allStudents.filter((student) => {
      if (student.house === selectedStudent.house && student.prefect === true) {
        prefects.push(student);
      }
    });

    //new array for prefect gender
    const otherPrefectGender = [];
    //filter for gender and add
    prefects.filter((student) => {
      if (student.gender === selectedStudent.gender) {
        otherPrefectGender.push(student);
      }
    });
    //if theres more than 1 of the same gender in the same house get option to remove

    if (otherPrefectGender.length >= 1) {
      console.log("There is already a prefect of this house and this gender");
      removeOther(otherPrefectGender[0]);
    } else {
      makePrefect(selectedStudent);
    }

    //ask user to ignore or remove other
    function removeOther(otherPrefect) {
      //show warning popup removeother
      document.querySelector("#warning_remove_other").classList.remove("hide");
      //add listener to close button
      document
        .querySelector("#warning_remove_other .close_removeother")
        .addEventListener("click", closeWarningOther);
      //add listener to remove other prefect
      document
        .querySelector("#warning_remove_other #removeotherbutton")
        .addEventListener("click", clickRemoveOther);

      //show name of current prefect
      document.querySelector(
        "#warning_remove_other [data-field=otherprefect]"
      ).textContent = otherPrefect.firstName + " " + otherPrefect.lastName;

      //if ignore do nothing
      function closeWarningOther() {
        //close warning and remove eventlistener
        document.querySelector("#warning_remove_other").classList.add("hide");
        document
          .querySelector("#warning_remove_other #removeotherbutton")
          .removeEventListener("click", clickRemoveOther);
        document
          .querySelector("#warning_remove_other #removeotherbutton")
          .removeEventListener("click", clickRemoveOther);
      }
      //remove the other prefect
      function clickRemoveOther() {
        console.log(selectedStudent);
        removePrefect(otherPrefect);
        makePrefect(selectedStudent);
        closePopup();
        showPopup(selectedStudent);
        buildList();
        closeWarningOther();
      }
    }

    function removePrefect(student) {
      student.prefect = false;
    }

    function makePrefect(student) {
      student.prefect = true;
    }
  }
}
