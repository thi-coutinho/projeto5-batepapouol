const linkGetMessages = "https://mock-api.driven.com.br/api/v6/uol/messages"
const linkPostJoinServer = "https://mock-api.driven.com.br/api/v6/uol/participants"
const linkPostStatus = "https://mock-api.driven.com.br/api/v6/uol/status"
let userName;
let user;
let pergunta = "Qual o seu lindo nome?";

function perguntaNome(response) {
    userName = prompt(pergunta)
    pergunta = "Por favor digite outro nome, pois este já está em uso"
    user = { name: userName }
    console.log(user)
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
    axios.get(linkGetMessages)
        .then(rendMenssages)
        .catch(console.log)

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
    const ulMessages = document.querySelector(".list-messages")
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].to === "Todos" || messages[i].to === userName) {
            let classes = "";
            
            classes+= messages[i].to === userName? " private" :"";
            classes+= messages[i].type === "status"? " status": "";
            
            ulMessages.innerHTML += `
            <li class="message${classes}">
                <span class="time">(${messages[i].time})</span>
                <span class="sender">  <strong> ${messages[i].from}</strong>  ${messages[i].text}</span>
                <span class="message-content"></span>
            </li>
            `
        }
    }
    const lastMessage = document.querySelector(".list-messages li:last-child")
    console.log(lastMessage)
    lastMessage.scrollIntoView()

}