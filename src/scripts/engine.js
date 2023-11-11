const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        winOf: document.getElementById("card-win"),
        loseOf: document.getElementById("card-lose"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    }
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Livro das Artes Secretas",
        type: "Papel",
        img: `${pathImages}livro-das-artes-secretas.webp`,
        WinOf: [1,4],
        LoseOf: [2,3],
    },
    {
        id: 1,
        name: "Soldado de Pedra Gigante",
        type: "Pedra",
        img: `${pathImages}soldado-de-pedra-gigante.webp`,
        WinOf: [2,3],
        LoseOf: [0,4],
    },
    {
        id: 2,
        name: "Tesoura das Almas",
        type: "Tesoura",
        img: `${pathImages}tesoura-das-almas.webp`,
        WinOf: [0,3],
        LoseOf: [1,4],
    },
    {
        id: 3,
        name: "Jacaré Toon",
        type: "Lagarto",
        img: `${pathImages}jacare-toon.webp`,
        WinOf: [4,0],
        LoseOf: [1,2],
    },
    {
        id: 4,
        name: `Exodia, "O Proibido"`,
        type: "Spock",
        img: `${pathImages}exodia.webp`,
        WinOf: [1,2],
        LoseOf: [3,0],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(IdCard);
        });

        cardImage.addEventListener("mouseout", () => {
            hiddenCardDetails();
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();
    
    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId,computerCardId);

    await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton();

}

async function updateScore() {
    state.score.scoreBox.innerText = `Vitórias: ${state.score.playerScore} | Derrotas: ${state.score.computerScore}`;
}

async function drawButton() {
    state.actions.button.innerText = "Próximo Duelo";
    state.actions.button.style.display = "block";
}

async function showMessage(name, title) {
    Swal.fire({
        title: `${title}!`,
        text: `Clique no botão "Próximo Duelo" para ir novas rodadas.`,
        imageUrl: `./src/assets/icons/${name}.webp`,
        imageWidth: 400,
        imageHeight: 300,
        imageAlt: "Imagem de Mensagem",
      });
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "";
    let playerCard = cardData[playerCardId];
    
    if (playerCardId == computerCardId) {
        duelResults = "draw";
        await showMessage(duelResults, "Empate");
    }

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        state.score.playerScore++;
        await showMessage(duelResults, "Venceu");
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose";
        state.score.computerScore++;
        await showMessage(duelResults, "Perdeu");
    }

    playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages() {
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    
}

async function drawSelectedCard(index) {
    let winOf = "";
    cardData[index].WinOf.forEach((e) => winOf = `${winOf},${cardData[e].type}` );
    let loseOf = "";
    cardData[index].LoseOf.forEach((e) => loseOf = `${loseOf},${cardData[e].type}` );
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Tipo: ${cardData[index].type}`;
    state.cardSprites.winOf.innerText = `Ganha contra: ${winOf.substring(1)}`;
    state.cardSprites.loseOf.innerText = `Perde contra: ${loseOf.substring(1)}`;

}

async function drawCardsInField(cardId,computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";
    state.cardSprites.winOf.innerText = "";
    state.cardSprites.loseOf.innerText = "";
}

async function drawCards(cardNumbers, fieldSide) {
    let i = 0;
    let checkRepetitions = [];

    while (i < cardNumbers) {
        let equal = 0;
        const randomIdCard = await getRandomCardId();
        checkRepetitions[i] = randomIdCard;

        for (let j=0; j<i; j++) {
            if (checkRepetitions[j] === checkRepetitions[i]) {
                equal = 1;
            }
        }

        if (equal === 0) {
            const cardImage = await createCardImage(randomIdCard, fieldSide);
            document.getElementById(fieldSide).appendChild(cardImage);
            i++;
        }  
        
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    init();
}

async function playAudio(status) {
    if (status !== "draw") {
        const audio = new Audio(`./src/assets/audios/${status}.wav`);
        audio.volume = 0.2;
        audio.play();    
    }  
}

function init() {

    showHiddenCardFieldsImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.1;
    bgm.play();
}

init();