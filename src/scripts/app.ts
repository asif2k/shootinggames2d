
import ShootingGamesApp from './ShootingGamesApp';

window.onload = () => {
    (new ShootingGamesApp(document.getElementById("canvasContainer") as HTMLElement)).launch()
}

//parallax scrolling
