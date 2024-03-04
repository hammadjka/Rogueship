
import volumeOn from './assets/menu/volume-high.svg';
import volumeOff from './assets/menu/volume-off.svg';

const View = (function() {
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
    const toggleVolImg = ()=>{
        let img = document.querySelector("#volImg");
        if (img.classList.contains("off")){
            img.classList = [];
            img.classList.add("on");
            img.src = volumeOn;
        }else{
            img.classList = [];
            img.classList.add("off");
            img.src = volumeOff;
        }
    }
    return {fadeIn, toggleVolImg}
})();

export default View;