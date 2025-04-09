const sizeMultiplier = 2;
let actualSizeMultiplier = 1;

function setBoardBackground(state) {
    const board = document.getElementById('board');
    if (board) {

        const img = new Image();
        img.src = 'static/assets/images/Map-' + state + '.png';
        img.onload = function() {
            const imageWidth = img.width;
            const imageHeight = img.height;

            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let finalWidth = imageWidth;
            let finalHeight = imageHeight;
            actualSizeMultiplier = 1;

            if (windowWidth >= imageWidth * sizeMultiplier && windowHeight >= imageHeight * sizeMultiplier) {
                finalWidth = imageWidth * sizeMultiplier;
                finalHeight = imageHeight * sizeMultiplier;
                actualSizeMultiplier = sizeMultiplier;
            }

            board.style.width = `${finalWidth}px`;
            board.style.height = `${finalHeight}px`;
            board.style.backgroundImage = `url(${img.src})`;
            board.style.backgroundSize = `${finalWidth}px ${finalHeight}px`;
            board.style.backgroundRepeat = 'no-repeat';
            board.style.backgroundPosition = 'center';

            console.log(`Actual size multiplier used: ${actualSizeMultiplier}`);
            
            if (!document.getElementById('pixel-square')) {
                createSquare();
            }
            
            const boardReadyEvent = new CustomEvent('boardReady', {
                detail: { width: finalWidth, height: finalHeight }
            });
            document.dispatchEvent(boardReadyEvent);
        };
    } else {
        console.log('Board element not found');
    }
}

function createSquare() {
    const existingSquare = document.getElementById('pixel-square');
    if (existingSquare) {
        existingSquare.remove();
    }
    const square = document.createElement('div');
    square.id = 'pixel-square';
    const squareSize = 16 * actualSizeMultiplier;

    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    square.style.backgroundColor = 'red';
    square.style.position = 'absolute';
    
    const board = document.getElementById('board');
    if (board) {
        const boardWidth = parseInt(board.style.width);
        const boardHeight = parseInt(board.style.height);
        
        const initialX = (boardWidth - squareSize) / 2;
        const initialY = (boardHeight - squareSize) / 2;
        
        square.style.left = `${initialX}px`;
        square.style.top = `${initialY}px`;
        
        board.appendChild(square);
        console.log(`Square created with size: ${squareSize}x${squareSize}px at position (${initialX}, ${initialY})`);
    }
}

export { actualSizeMultiplier, setBoardBackground };
