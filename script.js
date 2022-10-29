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
        type: "message"
    }
    axios.post(linkPostMessages, ObjMessage)
        .then(getAllMessages)
        .catch(window.location.reload)
    text.value = ""

}

/*
pedir o nome

tenta entrar na sala
    se sim, blz (talvez postar status)
        carrega mensagens
        scrolla pra baixo
    se não, pede outro nome

colocar botão onclick
fazer função enviar mensagem


*/
// console.log(codInterval)


// setTimeout(clearInterval,10000,codInterval)

// console.log(codInterval)





function rendMenssages(resposta) {
    let messages = resposta.data
    // cancel if lastMessage is the same as last call
    if (JSON.stringify(lastMessage) == JSON.stringify(messages[messages.length - 1])) {
        console.log("não precisa imprimir ");
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

            ulMessages.innerHTML += liMessage(classes, messages, i)
        }
    }
    document.querySelector(".list-messages li:last-child")
        .scrollIntoView()

}

function liMessage(classes, messages, i) {
    let inner = " para ";
    let outer = ": "
    if (classes === "status") {
        messages[i].to = "";
        inner = "";
        outer = "";
    } else if (classes === "private_message") {
        inner = " reservadamente" + inner
    }
    return `
            <li class="message ${classes}">
                <span class="time">(${messages[i].time})</span>
                <span class="sender"><strong> ${messages[i].from}</strong>${inner}<strong>${messages[i].to}</strong>${outer}</span>
                <span class="message-content">${messages[i].text}</span>
            </li>
            `;
}
