import './styles.css'
import View from './view.js'
import menuMusic from './assets/sounds/Menu.wav'

const Controller = (function() {
    const bgMusic = new Audio(menuMusic);

    const toggleBgMusic = (button)=>{
        if(button.classList.contains("off")){
            bgMusic.loop = true;
            bgMusic.play();
            View.toggleVolImg();
            button.classList = [];
            button.classList.add("on");
        }else{
            bgMusic.pause();
            // bgMusic.currentTime = 0;  
            View.toggleVolImg();
            button.classList = [];
            button.classList.add("off");
        }
        
    }
    return{toggleBgMusic}
})();

document.addEventListener('DOMContentLoaded', function() {
    let flagGif = document.getElementById('flag');
    let volumeButton = document.getElementById('volBtn');
    volumeButton.addEventListener('click', (e)=>{
        Controller.toggleBgMusic(e.target);
    })
    View.fadeIn(flagGif, 500);
});