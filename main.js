import { levels, GameManager } from './levels.js';

import { ctx } from './constants.js';

window.gameManager = new GameManager(levels);

const buttonsContainer = document.getElementById('levelButtons');

function renderButtons() 
{
    ctx.imageSmoothingEnabled = false;

    buttonsContainer.replaceChildren();

    levels.forEach((lvl, i) => {
        const btn = document.createElement('button');
        btn.textContent = `Level ${i + 1}`;
        
        if (i > 0 && (!levels[i - 1].passed)) btn.disabled = true;

        btn.onclick = () => {
            gameManager.deleteLevel();
            gameManager.startLevel(i);
            renderButtons();
        };

        buttonsContainer.appendChild(btn);
    });
}

renderButtons();