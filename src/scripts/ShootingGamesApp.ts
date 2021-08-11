
import * as PIXI from 'pixi.js'


import { AppEngine } from './PIXIAppEngine';
import { MainMenuScene } from './MenuScene';

import { TextureAtlas } from './TextureAtlas';

import { InitParticleEffects } from './ShootingGamesParticleEffects';
import { ParallaxScrollingLayer } from './ParallaxScrollingLayer';
import Game1Scene from './Game1Scene';
import ShootingGamesScene from './ShootingGamesScene';

//main shooting game application class that create and launch all the scene and manage global game loop

export default class ShootingGamesApp extends AppEngine {

    constructor(container: HTMLElement) {
        super(container);
    }
    public launch() {

        this.setRequiredFps(60)

        const fpsDisplay = document.createElement('div')
        fpsDisplay.style.position = "absolute";

        fpsDisplay.style.color = "#ffffff";
        fpsDisplay.style.fontSize = "22px"


        this.container.appendChild(fpsDisplay)

        const menu = this.addScene("menu", new MainMenuScene(this)) as MainMenuScene;
        const game1 = this.addScene("game1", new Game1Scene(this)) as Game1Scene;



        const loader = new PIXI.Loader()



        loader.add('mainTextureAtlas', 'images/texture-atlas.png');


        // activate menu scene in the start
        this.setActiveScene("menu")


        fpsDisplay.style.left = "0";
        fpsDisplay.style.top = "50%";
        fpsDisplay.style.width = "100%";
        fpsDisplay.style.textAlign = "center";


        fpsDisplay.innerHTML = "Loading please wait..."

        window.addEventListener("resize", () => { this.resize() })

        this.initAllScene(loader)
        loader.load((loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {

            // load texture atlas and all required texture frames are parsed
            // a more shopisticated texture atlas management could be implemented with more time
            const mainTextureAtlas = new TextureAtlas(resources.mainTextureAtlas?.texture.baseTexture as any)
            mainTextureAtlas.addFrame("startfield", 0, 128, 256, 192)
            mainTextureAtlas.addFramesList("asteroid", 0, 0, 24, 24, 46, 24);
            mainTextureAtlas.addFramesList("smoke", 46, 0, 24, 24, 24 * 14, 24);
            mainTextureAtlas.addFrame("button", 32, 32, 92, 32)
            mainTextureAtlas.addFrame("logo", 128, 32, 92, 32)
            mainTextureAtlas.addFramesList("missile", 0, 24, 24, 12, 24, 24);
            mainTextureAtlas.addFrame("splash", 32 * 9, 64, 32 * 7, 32 * 7);
            mainTextureAtlas.addFramesList("spaceship", 0, 384, 64, 64, 512, 64);
            mainTextureAtlas.addFramesList("explosion", 0, 480, 32, 32, 512, 32);


            //initialize global particle effects and their emitters
            InitParticleEffects(mainTextureAtlas)


            game1.mainTextureAtlas = mainTextureAtlas
            menu.mainTextureAtlas = mainTextureAtlas



            this.buildAllScene(resources)

            // setup a background scene to display animated starfield using parallax scrolling layer
            const backgroundScene = new ShootingGamesScene(this);
            const startfieldLayer = new ParallaxScrollingLayer(new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height), new PIXI.Point(-20, 0))

            const startfieldTexture = mainTextureAtlas.getFrame("startfield")

            startfieldLayer.addSprite(new PIXI.Sprite(startfieldTexture), 0, 0).scale.set(4, 4)
            startfieldLayer.addSprite(new PIXI.Sprite(startfieldTexture), 800, 0).scale.set(4, 4)

            const asteroidLayer1 = new ParallaxScrollingLayer(new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height), new PIXI.Point(-30, 0))
            const asteroidLayer2 = new ParallaxScrollingLayer(new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height), new PIXI.Point(-40, 0))

            asteroidLayer1.addSpritesRandom(mainTextureAtlas.getFrame("asteroid-0"), 30);
            asteroidLayer2.addSpritesRandom(mainTextureAtlas.getFrame("asteroid-1"), 30);
            backgroundScene.addChildren(startfieldLayer, asteroidLayer1, asteroidLayer2)
            backgroundScene.addAnimateables(startfieldLayer, asteroidLayer1, asteroidLayer2);


            //start the game loop
            this.start((timeDelta: number) => {
                this.renderer.clearBeforeRender = true;

                //update and render the background scene
                backgroundScene.update(timeDelta);
                this.renderer.render(backgroundScene)


            });

            fpsDisplay.style.left = "10px";
            fpsDisplay.style.top = "10px";
            fpsDisplay.style.width = "auto";
            setInterval(() => {
                fpsDisplay.innerHTML = `${this.currentFps} fps`
            }, 200)




        })


    }
}




