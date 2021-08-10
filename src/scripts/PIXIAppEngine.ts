import * as PIXI from 'pixi.js'
import { ObjectsPool } from './utils';


type PIXISceneTimerCallback = (time: number) => boolean;

export class PIXISceneTimer {
    public callback: PIXISceneTimerCallback
    public interval: number
    public createdTime: number
    public lastTickClock: number
    public active: boolean

}


export class PIXISceneTimers {

    public allTimers: PIXISceneTimer[] = []
    public timersPool = new ObjectsPool(() => {
        const timer = new PIXISceneTimer()
        this.allTimers.push(timer);
        return timer
    });

    public create(callback: PIXISceneTimerCallback, interval: number = 1) {


        const timer = this.timersPool.get() as PIXISceneTimer

        timer.active = true;
        timer.interval = interval;
        timer.callback = callback
        timer.lastTickClock = 0
        timer.createdTime = -1;

    }

    public update(clock: number) {
        let timer;
        for (let i = 0; i < this.allTimers.length; i++) {
            timer = this.allTimers[i];
            if (timer.active) {
                if (timer.createdTime === -1) timer.createdTime = clock
                if (clock - timer.lastTickClock >= timer.interval) {
                    if (timer.callback(clock - timer.createdTime) !== true) {
                        timer.active = false;
                        this.timersPool.free(timer)
                    }
                    timer.lastTickClock = clock
                }
            }



        }

    }

}

//base scene class to manage seperate demos
export class PIXIScene extends PIXI.Container {
    public engine: AppEngine
    public timers: PIXISceneTimers = new PIXISceneTimers()


    public constructor(engine: AppEngine) {
        super()
        this.engine = engine
    }
    public activated() {

    }
    public update(timeDelta: number) {
        this.timers.update(this.engine.clock)
    }
    public resize(width: number, height: number) {
    }


    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {

    }

    public init(loader: PIXI.Loader) {

    }

}




//base application engine that host all scene and handle rendering
export class AppEngine {

    public loader: PIXI.Loader;
    public renderer: PIXI.Renderer;
    public container: HTMLElement

    public currentScene: PIXIScene | undefined = undefined
    public scenes = new Map<string, PIXIScene>()
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
            currentTime = performance.now() * 0.001;
            currentTimeDelta = currentTime - lastTime;
            if (currentTimeDelta < this.requiredTimeDelta) {
                return
            }
            if (currentTime - lastFpsTime > 1) {
                this.currentFps = fpsCounter;
                lastFpsTime = currentTime - ((currentTime - lastFpsTime) % this.requiredTimeDelta);
                fpsCounter = 0;
            }
            fpsCounter++;


            render(currentTimeDelta)
            if (this.currentScene) {
                this.currentScene.update(currentTimeDelta)
                this.renderer.render(this.currentScene)
            }
            lastTime = currentTime - (currentTimeDelta % this.requiredTimeDelta);
            this.clock += currentTimeDelta
        }
        tick()
    }

}



