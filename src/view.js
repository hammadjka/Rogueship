
import volumeOn from './assets/menu/volume-high.svg';
import volumeOff from './assets/menu/volume-off.svg';
import pirateImg from './assets/characters/pidle2.gif'
import vikingImg from './assets/characters/vikingIdle.gif'

import menuMusic from './assets/sounds/GameMusic/Menu.wav'
import levleMusic from './assets/sounds/GameMusic/Level.wav'

import viking1 from './assets/sounds/VikingDialogue/sheildTosheild.wav'
import viking2 from './assets/sounds/VikingDialogue/thorJudge.wav'
import viking3 from './assets/sounds/VikingDialogue/valhallaAdmits.wav'
import viking4 from './assets/sounds/VikingDialogue/leaveMe.wav'

import pirate1 from './assets/sounds/PirateDialogue/allHands1.wav'
import pirate2 from './assets/sounds/PirateDialogue/hoistJelly.wav'
import pirate3 from './assets/sounds/PirateDialogue/meRum.wav'
import pirate4 from './assets/sounds/PirateDialogue/battenHatches.wav'

const GameAudio = (function(){
    const menu = new Audio(menuMusic);
    const stage = new Audio(levleMusic);
    menu.volume = 0.7;

    const V_SelectD1 = new Audio(viking1);
    const V_SelectD2 = new Audio(viking2);
    const V_SelectD3 = new Audio(viking3);
    const V_SelectD4 = new Audio(viking4);

    const P_SelectD1 = new Audio(pirate1);
    const P_SelectD2 = new Audio(pirate2);
    const P_SelectD3 = new Audio(pirate3);
    const P_SelectD4 = new Audio(pirate4);



    const bgMusic = {menu, stage};
    const dialogueObj = {
                        "viking": {V_SelectD1, V_SelectD2, V_SelectD3, V_SelectD4},
                        "pirate": {P_SelectD1, P_SelectD2, P_SelectD3, P_SelectD4}
    }

    const playSelectDialogue = (character)=>{
        stopAllDialogues();
        let audioName;
        for(let ch in dialogueObj){
            if (ch === character){
                const audios = Object.keys(dialogueObj[ch]);
                const randomIndex = Math.floor(Math.random() * audios.length);
                audioName = audios[randomIndex];
            }
        }
        let dialogue =  dialogueObj[character][audioName];
        menu.volume = 0.35;
        dialogue.play()
            .catch((error) => {
                console.log(error);
            });
        dialogue.addEventListener('ended', function() {
            menu.volume = 0.7;
        });
    }
    const stopDialogue = (character, audioName)=>{
        dialogueObj[character][audioName].pause();
        dialogueObj[character][audioName].currentTime = 0;
    }
    const stopAllDialogues = ()=>{
        for (let character in dialogueObj) {
            for(let dialogue in dialogueObj[character]){
                stopDialogue(character, dialogue);
            }
        }
        menu.volume = 0.7;    
    }
    const playBgMusic = (audioName)=>{
        stopAllBgMusic();
        bgMusic[audioName].loop = true;
        bgMusic[audioName].play();
    }
    const stopBgMusic = (audioName)=>{
        bgMusic[audioName].pause();
    }
    const stopAllBgMusic = ()=>{
        for(let audio in bgMusic){
            stopBgMusic(audio);
        }
    }
    return{playSelectDialogue, playBgMusic, stopBgMusic, stopAllDialogues, stopDialogue}
})();

const View = (function() {
    const toggleMenuMusic = (button)=>{
        let img = document.querySelector("#volImg");
        if(button.classList.contains("off")){
            GameAudio.playBgMusic("menu");
            img.src = volumeOn;
            button.classList = [];
            button.classList.add("on");
        }else{
            GameAudio.stopBgMusic("menu");
            img.src = volumeOff;
            button.classList = [];
            button.classList.add("off");
        }
    }
    const fadeIn = (element, duration) => {
        var opacity = 0;
        var interval = 50; // Interval in milliseconds
        var delta = 1 / (duration / interval);
    
        var timer = setInterval(function() {
            opacity += delta;
            element.style.opacity = opacity;
    
            if (opacity >= 1) {
                clearInterval(timer);
            }
        }, interval);
    }
    const resetSelectScreen = ()=>{
        let characterButtons = document.querySelectorAll(".select");
        characterButtons.forEach(button => {
            button.style.backgroundColor = "inherit";
        });
        document.querySelector("#readyButton").classList = [];
        GameAudio.stopAllDialogues();
    }
    const selectCharacter = (character)=>{
        resetSelectScreen();
        character.style.backgroundColor = "#E3E3E3";
        document.querySelector("#readyButton").classList.add("ready");
        if(character.id == "viking"){
            GameAudio.playSelectDialogue("viking");
        }else if(character.id == "pirate"){
            GameAudio.playSelectDialogue("pirate");
        }
    }
    const changeToGameScreen = (characterName)=>{
        resetSelectScreen();
        document.querySelector("#closeModal").click();
        document.querySelector("#content").style.display = "none";
        document.querySelector("#gameScreen").style.display = "grid";
        document.querySelector("#gsBackground").style.display = "block";
        const leftGrid = document.querySelector("#leftGrid");
        const rightGrid = document.querySelector("#rightGrid");
        const topBar = document.querySelector("#topGrid");
        displayCharacters(characterName)
        constructGrid([10,10], leftGrid, "leftCells");
        constructGrid([10,10], rightGrid, "rightCells");
        constructGrid([3,20], topBar, "topCells");
        GameAudio.playBgMusic("stage");
    }
    const displayCharacters = (characterName)=>{
        const playerImg = document.querySelector("#playerImage");
        const oppImg = document.querySelector("#opponentImage");
        if(characterName == "viking"){
            playerImg.src = vikingImg;
            oppImg.src = pirateImg;
        }else{
            playerImg.src = pirateImg;
            oppImg.src = vikingImg;
        }
        oppImg.style.transform = 'scaleX(-1)';
    }
    const constructGrid = (dimensions, parentDiv, cellClass)=>{
        for (let i = 0; i < dimensions[0]; i++) {
            for(let j=0; j<dimensions[1]; j++){
                const div = document.createElement('div');
                div.classList.add("gridCell");
                div.classList.add(cellClass);
                div.classList.add("_" + j + "_" + i);
                parentDiv.appendChild(div);
            }
        }
    }
    return {fadeIn, toggleMenuMusic, selectCharacter, resetSelectScreen, changeToGameScreen}
})();

export default View;