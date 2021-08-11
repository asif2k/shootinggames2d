
import * as PIXI from 'pixi.js'
import { ObjectsPool } from './utils';
import { ParticlesSystem } from './ParticlesSystem';

import { AppEngine } from './PIXIAppEngine';
type PIXISceneTimerCallback = (time: number) => boolean;

export class PIXISceneTimer {
    public callback: PIXISceneTimerCallback
    public interval: number
    public createdTime: number
    public lastTickClock: number
    public active: boolean

}

//timer objects that work under the scene update loop
export class PIXISceneTimers {

    public allTimers: PIXISceneTimer[] = []
    //pool to manage many timer objects and reuse the objects when they expired
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



//interface to identify animatable objects and update in scene updae
export interface PIXIAnimatable {
    update: (timeDelta: number) => void;
}

//base scene class to manage seperate demos
export class PIXIScene extends PIXI.Container {
    public engine: AppEngine
    public timers: PIXISceneTimers = new PIXISceneTimers()
    public animatables: PIXIAnimatable[] = []
    public particlesSystem: ParticlesSystem = new ParticlesSystem()
    public constructor(engine: AppEngine) {
        super()
        this.engine = engine
        this.addChild(this.particlesSystem)
        this.addAnimateables(this.particlesSystem)
    }
    public activated() {

    }
    public update(timeDelta: number) {
        this.timers.update(this.engine.clock);

        for (let i = 0; i < this.animatables.length; i++) {
            this.animatables[i].update(timeDelta)
        }

    }
    public resize(width: number, height: number) {
    }

    public addChildren(...items: PIXI.Container[]) {

        for (let i = 0; i < items.length; i++)
            this.addChild(items[i])


    }

    public addAnimateables(...items: PIXIAnimatable[]) {
        for (let i = 0; i < items.length; i++)
            this.animatables.push(items[i])
    }

    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {

    }

    public init(loader: PIXI.Loader) {

    }

}
