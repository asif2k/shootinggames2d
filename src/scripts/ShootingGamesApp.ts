
import * as PIXI from 'pixi.js'


import { AppEngine } from './PIXIAppEngine';
import { TextMenuScene } from './MenuScene';

import { TextureAtlas } from './TextureAtlas';
import { ParticlesSystem } from './ParticlesSystem';
import { InitParticleEffects } from './ShootingGamesParticleEffects';
import { ParallaxScrollingLayer } from './ParallaxScrollingLayer';



export default class ShootingGamesApp extends AppEngine {
    constructor(container: HTMLElement) {
        super(container);
        console.log(this);

    }
    public launch() {

        this.setRequiredFps(60)

        const fpsDisplay = document.createElement('div')
        fpsDisplay.style.position = "absolute";

        fpsDisplay.style.color = "#ffffff";
        fpsDisplay.style.fontSize = "26px"


        this.container.appendChild(fpsDisplay)

        const menu = this.addScene("menu", new TextMenuScene(this)) as TextMenuScene;

        const loader = new PIXI.Loader()

        //const particleSystem: ParticleSystem = new ParticleSystem();

        loader.add('globbalTextureAtlas', 'images/particle-fire.png');
        loader.add('starfield', 'images/starfield.png');
        //particleSystem.addEmitter("fire",new ParticleEmitter())




        menu.add("FULL SCREEN", () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        })







        this.setActiveScene("menu")
        fpsDisplay.style.left = "0";
        fpsDisplay.style.top = "50%";
        fpsDisplay.style.width = "100%";
        fpsDisplay.style.textAlign = "center";


        fpsDisplay.innerHTML = "Loading please wait..."

        window.addEventListener("resize", () => { this.resize() })

        this.initAllScene(loader)
        loader.load((loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {

            const mainTextureAtlas = new TextureAtlas(resources.globbalTextureAtlas?.texture.baseTexture as any)
            mainTextureAtlas.prepareAllFrames("tile", 64, 64)

            console.log(mainTextureAtlas);

            InitParticleEffects(mainTextureAtlas)

            this.buildAllScene(resources)
            fpsDisplay.style.left = "10px";
            fpsDisplay.style.top = "10px";
            fpsDisplay.style.width = "auto";



            const par = new ParticlesSystem();

            console.log(par);
            menu.addChild(par);
            par.x = this.renderer.width * 0.5;
            par.y = this.renderer.height * 0.5;
            par.spawnEmitterInstance("fire", 100, 20);


            const l1 = new ParallaxScrollingLayer(new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height), new PIXI.Point(-55, 0))

            const l2 = new ParallaxScrollingLayer(new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height), new PIXI.Point(0, 145))

            const l3 = new ParallaxScrollingLayer(new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height), new PIXI.Point(-20, 0))


            let i = 0;
            for (i = 0; i < 60; i++) {
                l1.addSprite(new PIXI.Sprite(mainTextureAtlas.allFrames[0]), Math.random() * 800, Math.random() * 600)

            }

            for (i = 0; i < 10; i++) {
                l2.addSprite(new PIXI.Sprite(mainTextureAtlas.allFrames[6]), Math.random() * 800, Math.random() * 600)

            }

            l1.respositionCallback = (sprite: PIXI.Sprite) => {
                sprite.y = Math.random() * this.renderer.height
                sprite.x += Math.random() * 100
            }

            l3.addSprite(new PIXI.Sprite(resources.starfield?.texture), 0, 0)
            const sp1 = l3.addSprite(new PIXI.Sprite(resources.starfield?.texture), 800, 0)
            sp1.tint = 0xFFFFFF

            menu.addChild(l1)
            menu.addChild(l2)
            menu.addChild(l3)

            console.log(this);
            menu.timers.create((time: number): boolean => {


                if (time < 10) return true
                else return false


            }, 0.25)

            menu.addAnimateables(l1, l2, l3, par)

            this.start((timeDelta: number) => {
                // par.update(timeDelta);
                // l1.update(timeDelta)
                // l2.update(timeDelta)
                // l3.update(timeDelta)
            })

            setInterval(() => {
                fpsDisplay.innerHTML = `${this.currentFps} fps`
            }, 200)


        })


    }
}




