import * as PIXI from "pixi.js";

import { ObjectsPool, GuidInteger } from "./utils";

//sprite class for every partical
export class ParticleSprite extends PIXI.Sprite {
    public age: number = 0;
    public time: number = 0;
    public life: number = 0;
    public velX: number = 0;
    public velY: number = 0;
    public gravity: number = 0;
    public lifeDecay: number = 0.1;
    public decay: number = 0;
    public spin: number = 0;
    public pScale: number = 0;
}

type ParticleEmitterCreator = (
    clock: number,
    emitterInstance: ParticleEmitterInstance
) => void;
type ParticleEmitterProcessor = (
    sprite: ParticleSprite,
    emitterInstance: ParticleEmitterInstance
) => void;

export class ParticleEmitter {
    public pool: ObjectsPool;

    public creator: ParticleEmitterCreator;
    public processor: ParticleEmitterProcessor;
    public instances: ParticleEmitterInstance[] = [];

    constructor(
        creator: ParticleEmitterCreator,
        processor: ParticleEmitterProcessor
    ) {
        this.processor = processor;
        this.creator = creator;

        this.pool = new ObjectsPool((maxParticles: number) => {
            const ins = new ParticleEmitterInstance(this, maxParticles);
            this.instances.push(ins);
            return ins;
        });
    }

    public free(ins: ParticleEmitterInstance) {
        this.pool.free(ins);
        ins.active = false;
        ins.prevLink = null;
        ins.nextLink = null;
    }
}

export class ParticleEmitterInstance {
    public emitter: ParticleEmitter;
    public spritePool: ObjectsPool;
    public active: boolean = false;

    public uid: number = 0;
    public lastClock: number = 0;
    public age: number = Infinity;
    public ageDecay: number = 0;
    public activeSpriteCount: number = 0;
    public sprites: ParticleSprite[] = [];
    public prevLink: ParticleEmitterInstance | null = null;
    public nextLink: ParticleEmitterInstance | null = null;
    public host: PIXI.Container;
    public position: PIXI.Point = new PIXI.Point();
    public anchor: PIXI.Sprite | null = null;

    constructor(emitter: ParticleEmitter, maxParticles: number = 10) {
        this.uid = GuidInteger();
        this.emitter = emitter;
        //generate the sprite object when needed
        this.spritePool = new ObjectsPool(() => {
            const spr = new ParticleSprite();
            this.sprites.push(spr);
            this.host.addChild(spr);
            spr.visible = false;
            spr.anchor.set(0.5);

            return spr;
        }, maxParticles);
    }

    public activate() {
        let spr;
        for (let i = 0; i < this.sprites.length; i++) {
            spr = this.sprites[i] as ParticleSprite;
            if (spr.visible) this.freeSprite(spr);
        }
        this.active = true;
        this.lastClock = 0;
    }

    public getSprite(): ParticleSprite {
        const spr = this.spritePool.get();
        if (spr) {
            spr.renderable = true;
            spr.visible = true;
        }
        return spr;
    }
    public freeSprite(spr: ParticleSprite) {
        if (spr.visible) {
            this.spritePool.free(spr);
        }
        spr.visible = false;
        spr.renderable = false;
    }

    public setAge(age: number): ParticleEmitterInstance {
        this.age = age;
        return this;
    }

    public setDecay(ageDecay: number): ParticleEmitterInstance {
        this.ageDecay = ageDecay;
        return this;
    }

    public update(timeDelta: number) {
        //partical animation logic

        if (this.anchor) {
            this.position.x = this.anchor.worldTransform.tx;
            this.position.y = this.anchor.worldTransform.ty;
        }

        this.age -= this.ageDecay * timeDelta;
        let spr;
        this.activeSpriteCount = 0;
        for (let i = 0; i < this.sprites.length; i++) {
            spr = this.sprites[i] as ParticleSprite;

            if (spr.visible) {
                spr.life -= spr.lifeDecay * timeDelta;
                spr.decay = spr.life / spr.age;

                spr.x += spr.velX * timeDelta;
                spr.y += spr.velY * timeDelta;
                spr.velY += spr.gravity * timeDelta;
                spr.rotation += spr.spin * timeDelta;

                this.emitter.processor(spr, this);

                if (spr.life < 0) {
                    this.freeSprite(spr);
                } else this.activeSpriteCount++;
            }
        }
    }
}

export class ParticlesSystem extends PIXI.Container {
    public static emitters = new Map<string, ParticleEmitter>();

    public static createEmitter(
        key: string,
        emitter: ParticleEmitter
    ): ParticleEmitter {
        this.emitters.set(key, emitter);
        console.log(this.emitters);
        return emitter;
    }
    public clock: number = 0;
    public emittersInstances: ParticleEmitterInstance | null;

    public spawnEmitterInstance(
        key: string,
        age: number,
        maxParticles: number = 10
    ): ParticleEmitterInstance {
        const emitter = ParticlesSystem.emitters.get(key) as ParticleEmitter;

        const ins = emitter.pool.get(maxParticles) as ParticleEmitterInstance;
        ins.age = age;
        ins.activate();
        ins.host = this;
        if (this.emittersInstances) {
            ins.nextLink = this.emittersInstances;
            this.emittersInstances = ins;
            ins.nextLink.prevLink = ins;
        } else {
            this.emittersInstances = ins;
        }

        return ins;
    }
    public update(timeDelta: number) {
        let ins = this.emittersInstances;
        let removeIns;

        while (ins) {
            if (ins.age > 0) {
                ins.emitter.creator(this.clock, ins);
                ins.age -= ins.ageDecay;
            }
            ins.update(timeDelta);
            removeIns = ins;
            ins = ins.nextLink;

            if (removeIns.active && removeIns.activeSpriteCount === 0 && removeIns.age < 0) {
                if (removeIns.prevLink) {
                    removeIns.prevLink.nextLink = removeIns.nextLink;
                }
                else {
                    this.emittersInstances = removeIns.nextLink
                }

                if (removeIns.nextLink) {
                    removeIns.nextLink.prevLink = removeIns.prevLink;
                }
                removeIns.emitter.free(removeIns);
            }
        }
        if (this.emittersInstances) {
            if (
                this.emittersInstances.active === false &&
                this.emittersInstances.nextLink === null
            )
                this.emittersInstances = null;
        }

        this.clock += timeDelta;
    }
}
