import {
    theWidthOfTheCanvasBehold,
    theHeightOfTheCanvasSoBold,
    theGravityForceThatIsFound,
    thePowerOfJumpingInFlight,
    theSizeOfTheQuillPixelsBright,
    theXPositionWhereQuillStandsInLight,
    theSpeedOfTheScrollScrollingKeen,
    theRateAtWhichObstaclesAdd
} from './constants.js';

// === THE RHYME COLLECTOR: MAIN LOGIC ===

// We gather the elements from the DOM tree
const theCanvasElement = document.getElementById('theCanvasWhereHeroesDoFly');
const theDrawingContext = theCanvasElement.getContext('2d');
const theStartButton = document.getElementById('theButtonToStartTheGameNew');
const theScoreDisplay = document.getElementById('theScoreDisplayShownToTheEye');

// Set canvas dimensions to what we decreed
theCanvasElement.width = theWidthOfTheCanvasBehold;
theCanvasElement.height = theHeightOfTheCanvasSoBold;

// Load images with promises, waiting for load
function loadTheImageFromPathOnTheRoad(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
    });
}

// The assets we need for the game to look fine
let theImageOfQuillThatIsDivine;
let theImageOfScrollThatWePine;
let theImageOfInkThatIsMalign;
let theImageOfBackgroundLine;

// The sounds that will play when the actions occur
const theSoundWhenWeJumpWithABlur = new Audio('jump_sound.mp3');
const theSoundWhenWeCollectWithAPurr = new Audio('collect_sound.mp3');
const theMusicThatPlaysWhileWeStir = new Audio('game_music.mp3');
theMusicThatPlaysWhileWeStir.loop = true;

// The state of the game, changing frame after frame
let isTheGameRunningCurrentlySame = false;
let theCountOfFramesSinceWeCame = 0;
let theScoreOfStanzasWeClaim = 0;

// The Hero object, defined with great care
let theHeroWhoLeapsThroughTheAir = {
    y: 200,
    velocity: 0,
    grounded: false
};

// Arrays to hold entities spawning in view
let theObstaclesMessyAndNew = [];
let theCollectiblesShinyAndTrue = [];

// === FUNCTIONS OF ACTION AND LOGIC ===

// A function to reset all variables straight
function resetTheWorldToItsInitialState() {
    theHeroWhoLeapsThroughTheAir.y = theHeightOfTheCanvasSoBold - 100;
    theHeroWhoLeapsThroughTheAir.velocity = 0;
    theObstaclesMessyAndNew = [];
    theCollectiblesShinyAndTrue = [];
    theScoreOfStanzasWeClaim = 0;
    theCountOfFramesSinceWeCame = 0;
    theScoreDisplay.innerText = "Stanzas: 0";
    isTheGameRunningCurrentlySame = true;
    theStartButton.style.display = 'none';
    
    // Play the music that loops without end
    theMusicThatPlaysWhileWeStir.currentTime = 0;
    theMusicThatPlaysWhileWeStir.play().catch(e => console.log("Audio needs interaction, my friend"));
    
    // Begin the loop!
    requestAnimationFrame(theLoopThatRunsForeverAndEver);
}

// The input handler for jumping so high
function handleTheInputFromUserNigh(e) {
    if ((e.code === 'Space' || e.type === 'touchstart') && isTheGameRunningCurrentlySame) {
        if (theHeroWhoLeapsThroughTheAir.grounded) {
            theHeroWhoLeapsThroughTheAir.velocity = thePowerOfJumpingInFlight;
            theHeroWhoLeapsThroughTheAir.grounded = false;
            
            // Clone the sound to play overlaps
            const soundClone = theSoundWhenWeJumpWithABlur.cloneNode();
            soundClone.play();
        }
    }
}

// Add listeners to window for control
window.addEventListener('keydown', handleTheInputFromUserNigh);
window.addEventListener('touchstart', handleTheInputFromUserNigh);
theStartButton.addEventListener('click', resetTheWorldToItsInitialState);

// The main loop where the magic takes place
function theLoopThatRunsForeverAndEver() {
    if (!isTheGameRunningCurrentlySame) return;

    // 1. UPDATE
    
    // Apply gravity's pull to our friend
    theHeroWhoLeapsThroughTheAir.velocity += theGravityForceThatIsFound;
    theHeroWhoLeapsThroughTheAir.y += theHeroWhoLeapsThroughTheAir.velocity;

    // Check if hitting the floor at the end
    const floorY = theHeightOfTheCanvasSoBold - 80; // Floor offset
    
    if (theHeroWhoLeapsThroughTheAir.y > floorY - theSizeOfTheQuillPixelsBright) {
        theHeroWhoLeapsThroughTheAir.y = floorY - theSizeOfTheQuillPixelsBright;
        theHeroWhoLeapsThroughTheAir.velocity = 0;
        theHeroWhoLeapsThroughTheAir.grounded = true;
    }

    // Spawn obstacles at regular time
    theCountOfFramesSinceWeCame++;
    if (theCountOfFramesSinceWeCame % theRateAtWhichObstaclesAdd === 0) {
        // Chance for obstacle or collectable item
        if (Math.random() > 0.4) {
            theObstaclesMessyAndNew.push({
                x: theWidthOfTheCanvasBehold,
                y: floorY - 40,
                width: 40,
                height: 40
            });
        } else {
            theCollectiblesShinyAndTrue.push({
                x: theWidthOfTheCanvasBehold,
                y: floorY - 100 - (Math.random() * 100), // Random height
                width: 40,
                height: 40
            });
        }
    }

    // Move obstacles left across the screen
    for (let i = 0; i < theObstaclesMessyAndNew.length; i++) {
        theObstaclesMessyAndNew[i].x -= theSpeedOfTheScrollScrollingKeen;
    }
    
    // Move collectibles left across the screen
    for (let i = 0; i < theCollectiblesShinyAndTrue.length; i++) {
        theCollectiblesShinyAndTrue[i].x -= theSpeedOfTheScrollScrollingKeen;
    }

    // Cleanup off-screen items to save memory space
    theObstaclesMessyAndNew = theObstaclesMessyAndNew.filter(o => o.x > -100);
    theCollectiblesShinyAndTrue = theCollectiblesShinyAndTrue.filter(c => c.x > -100);

    // Collision Detection Logic - A Rhyme of Destruction
    
    // Check Ink Blots (Game Over)
    const quillRect = {
        x: theXPositionWhereQuillStandsInLight + 10, // Padding
        y: theHeroWhoLeapsThroughTheAir.y + 10,
        w: theSizeOfTheQuillPixelsBright - 20,
        h: theSizeOfTheQuillPixelsBright - 20
    };

    for (let obs of theObstaclesMessyAndNew) {
        if (quillRect.x < obs.x + obs.width &&
            quillRect.x + quillRect.w > obs.x &&
            quillRect.y < obs.y + obs.height &&
            quillRect.h + quillRect.y > obs.y) {
            
            // Collision! Game Over!
            isTheGameRunningCurrentlySame = false;
            theStartButton.style.display = 'inline-block';
            theStartButton.innerText = "Try Again, Poet!";
            theMusicThatPlaysWhileWeStir.pause();
        }
    }

    // Check Scrolls (Points)
    for (let i = theCollectiblesShinyAndTrue.length - 1; i >= 0; i--) {
        const col = theCollectiblesShinyAndTrue[i];
        if (quillRect.x < col.x + col.width &&
            quillRect.x + quillRect.w > col.x &&
            quillRect.y < col.y + col.height &&
            quillRect.h + quillRect.y > col.y) {
            
            // Collected!
            theCollectiblesShinyAndTrue.splice(i, 1);
            theScoreOfStanzasWeClaim++;
            theScoreDisplay.innerText = "Stanzas: " + theScoreOfStanzasWeClaim;
            
            const soundClone = theSoundWhenWeCollectWithAPurr.cloneNode();
            soundClone.play();
        }
    }

    // 2. RENDER

    // Clear the canvas entirely now
    theDrawingContext.clearRect(0, 0, theWidthOfTheCanvasBehold, theHeightOfTheCanvasSoBold);
    
    // Draw the background texture if loaded fine
    if (theImageOfBackgroundLine) {
        // Simple parallax or just static draw
        theDrawingContext.drawImage(theImageOfBackgroundLine, 0, 0, theWidthOfTheCanvasBehold, theHeightOfTheCanvasSoBold);
    }

    // Draw the floor line (simple drawing)
    theDrawingContext.beginPath();
    theDrawingContext.moveTo(0, floorY);
    theDrawingContext.lineTo(theWidthOfTheCanvasBehold, floorY);
    theDrawingContext.strokeStyle = '#5d4037';
    theDrawingContext.lineWidth = 4;
    theDrawingContext.stroke();

    // Draw the Hero (Quill)
    if (theImageOfQuillThatIsDivine) {
        theDrawingContext.drawImage(
            theImageOfQuillThatIsDivine, 
            theXPositionWhereQuillStandsInLight, 
            theHeroWhoLeapsThroughTheAir.y, 
            theSizeOfTheQuillPixelsBright, 
            theSizeOfTheQuillPixelsBright
        );
    } else {
        // Fallback rectangle
        theDrawingContext.fillStyle = 'gold';
        theDrawingContext.fillRect(
            theXPositionWhereQuillStandsInLight, 
            theHeroWhoLeapsThroughTheAir.y, 
            theSizeOfTheQuillPixelsBright, 
            theSizeOfTheQuillPixelsBright
        );
    }

    // Draw Obstacles (Ink)
    for (let obs of theObstaclesMessyAndNew) {
        if (theImageOfInkThatIsMalign) {
            theDrawingContext.drawImage(theImageOfInkThatIsMalign, obs.x, obs.y, obs.width, obs.height);
        } else {
            theDrawingContext.fillStyle = 'black';
            theDrawingContext.fillRect(obs.x, obs.y, obs.width, obs.height);
        }
    }

    // Draw Collectibles (Scrolls)
    for (let col of theCollectiblesShinyAndTrue) {
        if (theImageOfScrollThatWePine) {
            theDrawingContext.drawImage(theImageOfScrollThatWePine, col.x, col.y, col.width, col.height);
        } else {
            theDrawingContext.fillStyle = 'red';
            theDrawingContext.fillRect(col.x, col.y, col.width, col.height);
        }
    }

    // Loop again!
    requestAnimationFrame(theLoopThatRunsForeverAndEver);
}

// === INITIALIZATION ===

async function initializeTheGameWithGrace() {
    // Load all the art to the proper place
    theImageOfQuillThatIsDivine = await loadTheImageFromPathOnTheRoad('quill_hero.png');
    theImageOfScrollThatWePine = await loadTheImageFromPathOnTheRoad('parchment_scroll.png');
    theImageOfInkThatIsMalign = await loadTheImageFromPathOnTheRoad('ink_blot.png');
    theImageOfBackgroundLine = await loadTheImageFromPathOnTheRoad('background_paper.png');
    
    // Render one frame so it's not empty space
    theDrawingContext.clearRect(0, 0, theWidthOfTheCanvasBehold, theHeightOfTheCanvasSoBold);
    if (theImageOfBackgroundLine) {
        theDrawingContext.drawImage(theImageOfBackgroundLine, 0, 0, theWidthOfTheCanvasBehold, theHeightOfTheCanvasSoBold);
    }
    
    // Draw text to say "Ready"
    theDrawingContext.fillStyle = '#3e2723';
    theDrawingContext.font = "30px Courier New";
    theDrawingContext.fillText("The Quill Awaits...", 250, 200);
}

// Start the loading process now
initializeTheGameWithGrace();