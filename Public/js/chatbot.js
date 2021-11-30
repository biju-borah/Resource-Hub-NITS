// DATA

const data = [
  {
    question: "What do you need?",
    options: [
      {
        key: "question",
        value: "Question Paper",
      },
      { key: "note", value: "Notes" },
    ],
  },
  {
    question: "Which branch?",
    options: [
      { key: "CSE", value: "Computer Science" },
      { key: "ECE", value: "Electronics" },
      { key: "EE", value: "Electrical" },
      { key: "ME", value: "Mechanical" },
      { key: "CE", value: "Civil" },
      { key: "EIE", value: "E & I" },
    ],
  },
  {
    question: "Which semester?",
    options: [
      { key: "1", value: "I" },
      { key: "2", value: "II" },
      { key: "3", value: "III" },
      { key: "4", value: "IV" },
      { key: "5", value: "V" },
      { key: "6", value: "VI" },
      { key: "7", value: "VII" },
      { key: "8", value: "VIII" },
    ],
  },
];

const chatbox = document.querySelector(".chatbot");
const chatboxIcon = document.querySelector(".chatbot-icon");

let userAction = 0;
const userInput = [];

console.log(data[userAction].question);

const createChatMessage = (action) => {
  const chatSection = document.createElement("div");
  chatSection.classList.add("question");
  const questionH2 = document.createElement("h2");
  questionH2.innerText = data[action].question;
  const options = document.createElement("div");
  options.classList.add("options");
  data[action].options.forEach((opt) => {
    const option = document.createElement("input");
    option.type = "button";
    option.value = opt.value;
    option.name = opt.key;
    options.appendChild(option);
  });
  const chatboxActions = document.createElement("div");
  chatboxActions.classList.add("chatbot-actions");
  if(action>0){
    const mainMenu = document.createElement("button");
    mainMenu.innerText = "Back to Main Menu";
    mainMenu.classList.add("main-menu");
    chatboxActions.appendChild(mainMenu);
    const prevMenu = document.createElement("button");
    prevMenu.innerText = "Previous Menu";
    prevMenu.classList.add("prev-menu");
    chatboxActions.appendChild(prevMenu);
  }
  chatSection.appendChild(questionH2);
  chatSection.appendChild(options);
  chatSection.appendChild(chatboxActions);
  chatbox.appendChild(chatSection);
};

const createNotesLinks = (result) => {
  const chatbotNotesRes = document.createElement("div");
  chatbotNotesRes.classList.add("chatbot-notes-res");
  const chatbotNotes = document.createElement("div");
  chatbotNotes.classList.add("chatbot-notes");
  const chatbotNotesMsg = document.createElement("h3");
  chatbotNotesMsg.innerText = result.message;
  chatbotNotes.appendChild(chatbotNotesMsg);
  if(result.notes.length){
    result.notes.forEach((note) => {
      const chatbotNotesList = document.createElement("div");
      chatbotNotesList.classList.add("chatbot-notes-list");
      const chatbotNoteLink = document.createElement("a");
      chatbotNoteLink.href = note.url;
      chatbotNoteLink.target = "_blank";
      chatbotNoteLink.innerText = note.subject;
      const chatbotNoteProf = document.createElement("span");
      chatbotNoteProf.innerText = ` - ${note.profName}`;
      chatbotNotesList.appendChild(chatbotNoteLink);
      chatbotNotesList.appendChild(chatbotNoteProf);
      chatbotNotes.appendChild(chatbotNotesList);
    })
  }
  const chatboxActions = document.createElement("div");
  chatboxActions.classList.add("chatbot-actions");
  const mainMenu = document.createElement("button");
  mainMenu.innerText = "Back to Main Menu";
  mainMenu.classList.add("main-menu");
  chatboxActions.appendChild(mainMenu);
  const prevMenu = document.createElement("button");
  prevMenu.innerText = "Previous Menu";
  prevMenu.classList.add("prev-menu");
  chatboxActions.appendChild(prevMenu);
  chatbotNotesRes.appendChild(chatbotNotes);
  chatbotNotesRes.appendChild(chatboxActions);
  chatbox.appendChild(chatbotNotesRes);
}

const deleteChatMessage = () => {
  document.querySelector(".question")?.remove();
  document.querySelector(".chatbot-notes-res")?.remove();
};

// Event listeners

chatboxIcon.addEventListener("click", () => {
  chatbox.classList.toggle("showChatbot");
  deleteChatMessage();
  if (userAction < 3) {
    createChatMessage(userAction);
  }
});

chatbox.addEventListener("click", (e) => {
  if (e.target.parentNode.className === "options" && userAction < 3) {
    userInput.push({
      key: e.target.name,
      value: e.target.value,
    });
    deleteChatMessage();
    userAction++;
    if (userAction < 3) {
      createChatMessage(userAction);
    }else{
      fetch("/api/chatbot",{
        method: "POST",
        body: JSON.stringify({
          noteType: userInput[0].key,
          branch: userInput[1].key,
          semester: userInput[2].key
        }),
        headers: {"Content-Type": "application/json"}
      })
      .then(res => res.json())
      .then(data => {
        deleteChatMessage();
        createNotesLinks(data);
      })
      .catch(err => console.log(err));
    }
  } else if (e.target.parentNode.className === "chatbot-actions") {
    if (e.target.className === "main-menu") {
      deleteChatMessage();
      userAction = 0;
      createChatMessage(userAction);
      userInput.splice(userAction, userInput.length);
    } else if (e.target.className === "prev-menu") {
      deleteChatMessage();
      userAction--;
      createChatMessage(userAction);
      userInput.splice(userAction, userInput.length);
    }
  }
  console.log(userInput);
});
