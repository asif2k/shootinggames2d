
import * as PIXI from 'pixi.js'


import { AppEngine } from './PIXIAppEngine';
import { TextMenuScene } from './MenuScene';

import { TextureAtlas } from './TextureAtlas';
import { ParticlesSystem } from './ParticlesSystem';
import { InitParticleEffects } from './ShootingGamesParticleEffects';



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

            menu.timers.create((time: number): boolean => {
                par.spawnEmitterInstance("fire", 300, 6).setDecay(Math.random() + 0.2).position.set(
                    (Math.random() - 0.5) * 500,
                    (Math.random() - 0.5) * 500
                )

                if (time < 15) return true
                else return false


            }, 1)

            this.start((timeDelta: number) => {
                par.update(timeDelta)
            })

            setInterval(() => {
                fpsDisplay.innerHTML = `${this.currentFps} fps`
            }, 200)


        })


    }
}




