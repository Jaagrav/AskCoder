const databaseRef = firebase.database().ref("AskCoder/questions"),
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
let page = "home",
  inQuestion = "";
document.querySelector(".submit-btn").addEventListener("click", (e) => {
  if (page == "home") {
    if (
      document.querySelector(".input-question-name").value.trim() != "" &&
      document.querySelector(".input-description").value.trim() != "" &&
      document.querySelector(".input-name").value.trim() != ""
    ) {
      databaseRef.push({
        question: document.querySelector(".input-question-name").value.trim(),
        description: document.querySelector(".input-description").value.trim(),
        name:
          document.querySelector(".input-name").value.trim() +
          " • " +
          new Date().getDate() +
          " " +
          months[new Date().getMonth()] +
          ", " +
          new Date().getFullYear(),
      });
      document.querySelector(".input-question-name").value = "";
      document.querySelector(".input-description").value = "";
      document.querySelector(".input-name").value = "";
    } else console.log("Please fill all the fields.");
  } else {
    if (
      document.querySelector(".input-question-name").value.trim() != "" &&
      document.querySelector(".input-description").value.trim() != "" &&
      document.querySelector(".input-name").value.trim() != ""
    ) {
      databaseRef.child(inQuestion + "/answers").push({
        question: document.querySelector(".input-question-name").value.trim(),
        description: document.querySelector(".input-description").value.trim(),
        name:
          document.querySelector(".input-name").value.trim() +
          " • " +
          new Date().getDate() +
          " " +
          months[new Date().getMonth()] +
          ", " +
          new Date().getFullYear(),
      });
      document.querySelector(".input-question-name").value = "";
      document.querySelector(".input-description").value = "";
      document.querySelector(".input-name").value = "";
    } else console.log("Please fill all the fields.");
  }
});

databaseRef.on("child_added", (s) => {
  document.querySelector(".posts").innerHTML +=
    "<div class='post' question='" +
    s.key +
    "'><div class='post-question-name'>" +
    s.val().question +
    "<noofanswers></noofanswers></div></div>";

  document.querySelector(".back-btn").addEventListener("click", () => {
    document.querySelector(".input-question-name-instruct highL").textContent =
      "question?";
    page = "home";
    document.querySelector(".comment-box").innerHTML = "";
    document.querySelector(".post-page").style.display = "none";
    document.querySelector(".posts").style.display = "block";
    databaseRef.child(inQuestion + "/answers").off("value", (ans) => {
      document.querySelector(".comment-box").innerHTML +=
        "<div class='comment'><div class='salutate'>" +
        ans.val().question +
        " • " +
        ans.val().name +
        "</div><div class='text'>" +
        ans.val().description +
        "</div></div>";
    });
  });
  document.querySelectorAll(".post").forEach((q) => {
    q.addEventListener("click", () => {
      databaseRef
        .child(q.getAttribute("question") + "/answers")
        .on("child_added", (ans) => {
          document.querySelector(".comment-box").innerHTML +=
            "<div class='comment'><div class='salutate'>" +
            ans.val().question +
            " • " +
            ans.val().name +
            "</div><div class='text'>" +
            ans.val().description +
            "</div></div>";
        });
      document.querySelector(
        ".input-question-name-instruct highL"
      ).textContent = "answer?";
      page = "!home";
      document.querySelector(".post-page").style.display = "block";
      document.querySelector(".posts").style.display = "none";
      console.log(q.getAttribute("question"));
      databaseRef.child(q.getAttribute("question")).once("value", (qData) => {
        inQuestion = qData.key;
        document.querySelector(
          ".post-page-question-name"
        ).textContent = qData.val().question;
        document.querySelector(".poster").innerHTML =
          "<highL>Asked by </highL>" + qData.val().name;
        document.querySelector(
          ".post-description"
        ).textContent = qData.val().description;
      });
    });
  });
});
