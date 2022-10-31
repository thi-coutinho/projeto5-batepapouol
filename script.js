const linkGetMessages = "https://mock-api.driven.com.br/api/v6/uol/messages";
const linkPostMessages = linkGetMessages;
const linkPostJoinServer = "https://mock-api.driven.com.br/api/v6/uol/participants";
const linkGetParticipants = linkPostJoinServer;
const linkPostStatus = "https://mock-api.driven.com.br/api/v6/uol/status";
const painelNav = document.querySelector("nav");
let contact = "Todos";
let visibility = "message";
let responseParticipants;
let todosLi = document.querySelector('.list-participants li');
let contactLiSelected = document.querySelector('.list-participants li');
let visibilityLiSelected = document.querySelector('.visibility .selected');
let lastMessage; // para conferir se precisa recarregar a página
let userName;
let user;
let pergunta = "Qual o seu lindo nome?";


function perguntaNome() {
    userName = prompt(pergunta)
    if(userName ==="Todos"){
        pergunta = "Por favor digite outro nome, pois este é inválido";
        perguntaNome()
    }
    pergunta = "Por favor digite outro nome, pois este já está em uso";
    user = { name: userName }
    axios.post(linkPostJoinServer, user)
        .then(enterRoom)
        .catch(perguntaNome)
    // console.log(response)
}

perguntaNome()


function enterRoom() {

    // mantem conexão
    function keepOnline() {
        axios.post(linkPostStatus, user)
            // .then(console.log)
            .catch(console.log)
    }
    setInterval(keepOnline, 5000)
    // renderiza mensagens
    getAllMessages()
    setInterval(getAllMessages, 3000);
    getAllParticipants()
    setInterval(getAllParticipants, 10000);



}

function getAllMessages() {
    axios.get(linkGetMessages)
        .then(rendMenssages)
        .catch(console.log);
}

function getAllParticipants() {
    axios.get(linkGetParticipants)
        .then(rendParticipants)
        .catch(console.log);
}

function rendParticipants(response) {
    responseParticipants = response
    let participants = responseParticipants.data
    let ulParticipants = document.querySelector(".list-participants");
    todosLi = ulParticipants.querySelector("li")
    ulParticipants.innerHTML = todosLi.outerHTML
    if (contactLiSelected.innerText.trim() !== "Todos") {
        ulParticipants.innerHTML += contactLiSelected.outerHTML
    }

    for (let i = 0; i < participants.length; i++) {
        if (participants[i].name !== userName && participants[i].name !== contact) {

            ulParticipants.innerHTML += liParticipants(participants[i].name)
        }
    }
}

function sendMessage() {
    let text = document.querySelector("input");
    let ObjMessage = {
        from: userName,
        to: contact,
        text: text.value,
        type: visibility
    }
    axios.post(linkPostMessages, ObjMessage)
        .then(getAllMessages)
        .catch(window.location.reload)
    text.value = ""

}

function rendMenssages(resposta) {
    let messages = resposta.data
    // cancel if lastMessage is the same as last call
    if (JSON.stringify(lastMessage) == JSON.stringify(messages[messages.length - 1])) {
        return
    }
    // update lastMessage
    lastMessage = messages[messages.length - 1];
    const ulMessages = document.querySelector(".list-messages")


    for (let i = 0; i < messages.length; i++) {
        if (messages[i].to === "Todos" || messages[i].to === userName || messages[i].from === userName) {
            let classes = "";

            classes += messages[i].type === "private_message" ? "private" : "";
            classes += messages[i].type === "status" ? "status" : "";

            ulMessages.insertAdjacentHTML('beforeend', liMessage(classes, messages[i]))
        }
    }
    document.querySelector(".list-messages li:last-child")
        .scrollIntoView()

}

function liMessage(classes, message) {
    let inner = " para";
    let outer = ": "
    if (classes === "status") {
        message.to = "";
        inner = "";
        outer = "";
    } else if (classes === "private") {
        inner = " reservadamente" + inner
    }
    return `<li class="message ${classes}">
                <span class="time">(${message.time})</span>
                <span class="sender">
                    <strong>${message.from}</strong>
                    ${inner}
                    <strong>${message.to}</strong>
                    ${outer + message.text}
                </span>
            </li>`;
}
function liParticipants(participant) {
    return `<li onclick="selectParticipants(this)">
                        <div> <img src="./assets/person-circle-outline.svg" alt="">
                            ${participant}
                        </div>
                        <img class="checkmark" src="./assets/checkmark.svg" alt="">
            </li>`
}
function painelShow(element) {
    if (element.parentNode.classList.contains("sidebar")) return
    painelNav.classList.toggle("escondido")
}

function selectVisibility(element) {
    if (element.classList.contains("selected")) return
    visibilityLiSelected.classList.toggle("selected")
    element.classList.toggle("selected")
    visibilityLiSelected = element
    visibility = (visibility === "message") ? "private_message" : "message"
}

function selectParticipants(element) {
    if (element.innerText.trim() === contactLiSelected.innerText.trim()) { return }
    todosLi = document.querySelector('.list-participants li')
    contactLiSelected = document.querySelector('.list-participants .selected')
    if (element.innerText.trim() !== "Todos") {
        todosLi.classList.remove("selected");
        contactLiSelected.classList.remove("selected")
        element.classList.add("selected")
        contactLiSelected = element
        contact = element.innerText.trim()
    } else {
        todosLi.classList.add("selected")
        contactLiSelected.classList.remove("selected")
        console.log(contactLiSelected.outerHTML)
        console.log(document.querySelector(".list-participants li").outerHTML)
        contact = "Todos"
    }
}