const colorButton = document.querySelector('input[type="color"]');
const normalButton = document.querySelector('button.normal');
const rainbowButton = document.querySelector('button.rainbow');
const scaleButton = document.querySelector('button.scale');
const eraseButton = document.querySelector('button.eraser');
const gridLinesButton = document.querySelector('button.lines');

const buttonsArray = [normalButton, rainbowButton, scaleButton, eraseButton];

const board = document.querySelector('.board');

const clearButton = document.querySelector('button.clear');
const slider = document.querySelector('input[type="range"]');
const boardSize = document.querySelector('span');

let currentSize = 16;
let mode = "Normal"
let currentColor = "black";
let mousePressed = false;

function getDarkerColor(rgbString) {

    let rgbArray = rgbString.replace(/r|g|b|\(|\)|\ /g,'').split(',');
    
    let r = Number(rgbArray[0]);
    let g = Number(rgbArray[1]);
    let b = Number(rgbArray[2]);

    r /= 255;
    g /= 255;
    b /= 255;

    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
    : 0;

    let hslArray = [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2
  ];

  hslArray[2] -= 10;

    return `hsl(${hslArray[0]},${hslArray[1]}%,${hslArray[2]}%)`;
}

function getRainbowColor() {
    
    let colors = ["indigo", "blue", "green", "yellow", "violet", "orange", "red"];
    let randomNumber = Math.floor(Math.random() * 10) % 7;

    return colors[randomNumber];
}

function createEvents() {

    colorButton.addEventListener('change', (e) => currentColor = e.target.value);

    normalButton.addEventListener('click', () => mode = "Normal");

    rainbowButton.addEventListener('click', () => mode = "Rainbow");

    scaleButton.addEventListener('click', () => mode = "Scale");

    eraseButton.addEventListener('click', () => mode = "Erase");

    clearButton.addEventListener('click', () => {
        createGrid(currentSize);
    });
    
    slider.addEventListener('input', (e) => {
        boardSize.textContent = `${e.target.value}`;
    });
    
    slider.addEventListener('change', (e) => {
        currentSize = e.target.value;
        createGrid(currentSize);
    });

    document.body.addEventListener('mousedown', () => mousePressed = true);
    document.body.addEventListener('mouseup', () => mousePressed = false);

    for( btn of buttonsArray) {
        btn.addEventListener('click', (e) => {
            for(buttons of buttonsArray)
                buttons.classList.remove('clicked');
            e.target.classList.add('clicked');
        });
    }

    gridLinesButton.addEventListener('click', () => {
        let allDivs = document.querySelectorAll('.board div');

        allDivs.forEach( (el) => {
             el.classList.toggle('bordered');
            console.log('sal');
        });
    });

}

function createGrid(n) {

    board.innerHTML = "";

    const pixelWidth = 100 / n;

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {

            const newPixel = document.createElement('div');
            newPixel.classList.add('pixel');
            newPixel.setAttribute('style',`min-width: ${pixelWidth}%`);  
            board.appendChild(newPixel);

            newPixel.addEventListener('mouseover', () => {
               
                if(mousePressed) {

                    switch(mode) {

                        case "Normal": 
                            newPixel.style.backgroundColor = currentColor;
                            break;
    
                        case "Erase":
                            newPixel.style.backgroundColor = "white";
                            break;
    
                        case "Rainbow":
                            newPixel.style.backgroundColor = getRainbowColor();
                            break;
    
                        case "Scale":
                            newPixel.style.backgroundColor = getDarkerColor(window.getComputedStyle(newPixel).getPropertyValue('background-color').toString());
                            break;
                    }

                }
                    
            });
        }  
    }
}


createEvents();
createGrid(currentSize);



