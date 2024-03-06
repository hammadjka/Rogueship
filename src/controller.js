import './styles.css'
import './gsStyles.css'
import View from './view.js'

const Controller = (function() {

})();

document.addEventListener('DOMContentLoaded', function() {
    const flagGif = document.getElementById('flag');
    View.fadeIn(flagGif, 500);

    const volumeButton = document.getElementById('volBtn');
    volumeButton.addEventListener('click', (e)=>{
        View.toggleMenuMusic(e.target);
    })

    const characterButtons = document.querySelectorAll(".select");
    characterButtons.forEach(button => {
        button.addEventListener('click', (e)=>{
            View.selectCharacter(e.target);
        })
    })

    const closeModalBtn = document.querySelector("#closeModal");
    closeModalBtn.addEventListener('click', View.resetSelectScreen);

    const modal = document.querySelector('#modal');
    modal.addEventListener('click', function(event) {
        let isClickInsideModal = document.querySelector('.modal-content').contains(event.target);
        if (!isClickInsideModal) {
           View.resetSelectScreen();
        }
    });

});

document.body.addEventListener("click", function(event) {
    if (event.target.classList.contains("ready")) {
        View.changeToGameScreen();
    }
});