2d shooting game developed using pixijs , typescript and webpack


### Requirements
• the game should work on most modern browsers on desktop
• the game should be 800x600 px in size, it is not necessary to handle resizing
• at the start, a Splash screen is shown for 2 seconds, then fades out and the game continues 
to the main screen
• the Main screen contains the following elements:
o background with some animation to make the view more interesting
o 4 buttons placed in the middle, from top to bottom:
GAME1, GAME2, GAME3 and EXIT
o clicking the EXIT button navigates somewhere
o clicking any of the GAME buttons takes the user to the game
o a logo above the buttons
• the Game screen is a simple side scroller Shoot’em up with spaceships
o the player’s spaceship can move around the game area
o it can shoot rockets
o the background moves from right to left, with a parallax scrolling effect
o every 2 seconds, an enemy spaceship arrives
o the enemy spaceships move in some randomized way
o if the projectile of the player's spaceship hits an enemy, its spaceship blows up and 
disappears, emitting particles
o if the player's spaceship collides with an enemy object, it blows up, and the game 
ends, going back to the main menu


### implementation
game developed using typescript , pixijs and webpack , game is divided into different scenes , a application engine is implemented that support any number of scences , for particle animations and particle system is implemented that expandable and more effects can be added, for performance and better memory managment a object pool is heavily used across application , with the help of object pooling we can reuse the objects created before , so we do not have to allocate more new objects for example is particle effects and game character and missile handling, for parrallax scrolling a special object is implemented that be used to create any number of parallax layers and many object can be added to layer.

For better texture memory and speed only one large texture atlas is implemented that stores all the textures used in the game. packing all textures in one big texture is a technique used to games and application , because texture switching in webgl is a expensive operation , but using texture atlas only one texture is used all the time.

Sprite textures are used from https://opengameart.org/

[Game Demo](https://asif2k.github.io/portfolio/spaceshooter2d/)