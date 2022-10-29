const linkGetMessages = "https://mock-api.driven.com.br/api/v6/uol/messages"
const linkPostMessages = linkGetMessages
const linkPostJoinServer = "https://mock-api.driven.com.br/api/v6/uol/participants"
const linkPostStatus = "https://mock-api.driven.com.br/api/v6/uol/status"
let lastMessage; // para conferir se precisa recarregar a página
let userName;
let user;
let pergunta = "Qual o seu lindo nome?";
let to = "Todos";

function perguntaNome(response) {
    userName = prompt(pergunta)
    pergunta = "Por favor digite outro nome, pois este já está em uso"
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

}

function getAllMessages() {
    axios.get(linkGetMessages)
        .then(rendMenssages)
        .catch(console.log);
}

function sendMessage() {
    let text = document.querySelector("input");
    let ObjMessage = {
        from: userName,
        to: "Todos",
        text: text.value,
        type: "private_message"
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
        if (messages[i].to === "Todos" || messages[i].to === userName) {
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
    } else if (classes === "private_message") {
        inner = " reservadamente" + inner
    }
    return `<li class="message ${classes}">
                <span class="time">(${message.time})</span>
                <span class="sender">
                    <strong>${message.from}</strong>
                    ${inner}
                    <strong>${message.to}</strong>
                    ${outer+message.text}
                </span>
            </li>
            `;
}
