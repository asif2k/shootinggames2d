import * as PIXI from 'pixi.js'



import { PIXIScene } from './PIXIScene';





//base application engine that host all scene and handle rendering
export class AppEngine {

    public loader: PIXI.Loader;
    public renderer: PIXI.Renderer;
    public container: HTMLElement
    public active: boolean = true
    public currentScene: PIXIScene | undefined = undefined
    public scenes = new Map<string, PIXIScene>()
    public keys: boolean[] = []
    private requiredTimeDelta: number = 1 / 60
    public currentFps = 0
    public clock = 0;
    constructor(container: HTMLElement) {

        this.container = container
        this.loader = PIXI.Loader.shared;
        this.renderer = PIXI.autoDetectRenderer({ width: 100, height: 100, antialias: true });
        container.appendChild(this.renderer.view);

        setTimeout(() => {
            this.resize();
        }, 10);
        this.setRequiredFps(120)

        // update keys array so when particular key is down or up
        document.addEventListener('keydown', (e) => {
            this.keys[e.keyCode] = true;
        });

        document.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys[e.keyCode] = false;

        });

    }

    public setRequiredFps(fps: number) {
        this.requiredTimeDelta = 1 / fps
    }
    public addScene(name: string, scene: PIXIScene): PIXIScene {
        this.scenes.set(name, scene)
        scene.resize(this.renderer.width, this.renderer.height)
        return scene;
    }
    public setActiveScene(name: string) {
        this.currentScene = this.scenes.get(name)
        this.currentScene?.resize(this.renderer.width, this.renderer.height)
        this.currentScene?.activated()
    }
    public resize() {
        const rect = this.renderer.view.getBoundingClientRect()
        this.renderer.resize(rect.width, rect.height)
        this.scenes.forEach(scene => {
            scene.resize(rect.width, rect.height)
        })
    }

    public initAllScene(loader: PIXI.Loader) {
        this.scenes.forEach(scene => {
            scene.init(loader)
        })
    }

    public buildAllScene(resources: Partial<Record<string, PIXI.LoaderResource>>) {
        this.scenes.forEach(scene => {
            scene.build(resources)
        })
    }


    public start(render: (timeDelta: number) => void) {

        let currentTime = performance.now() * 0.001;
        let lastTime = currentTime
        let lastFpsTime = currentTime
        let currentTimeDelta = 0
        let fpsCounter = 0;
        const tick = () => {

            requestAnimationFrame(tick);

            if (!this.active) return
            currentTime = performance.now() * 0.001;
            currentTimeDelta = currentTime - lastTime;

            if (currentTimeDelta < this.requiredTimeDelta) {
                return
            }

            currentTimeDelta = Math.max(this.requiredTimeDelta, currentTimeDelta)
            currentTimeDelta = Math.min(this.requiredTimeDelta * 2, currentTimeDelta)


            if (currentTime - lastFpsTime > 1) {
                this.currentFps = fpsCounter;
                lastFpsTime = currentTime - ((currentTime - lastFpsTime) % this.requiredTimeDelta);
                fpsCounter = 0;
            }
            fpsCounter++;


            render(currentTimeDelta)
            if (this.currentScene) {
                this.currentScene.update(currentTimeDelta)
                this.renderer.clearBeforeRender = false;
                this.renderer.render(this.currentScene)
            }
            lastTime = currentTime - (currentTimeDelta % this.requiredTimeDelta);
            this.clock += currentTimeDelta
        }
        tick()
    }

}



