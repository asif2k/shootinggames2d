
import { ParticleEmitter, ParticlesSystem, ParticleEmitterInstance, ParticleSprite } from './ParticlesSystem';

import { TextureAtlas } from './TextureAtlas';

export function InitParticleEffects(textureAtlas: TextureAtlas) {

    const smokeTextures = textureAtlas.getFramesListByPrefix("smoke");
    const explosionTextures = textureAtlas.getFramesListByPrefix("explosion");


    // several particle effects


    //emitter to display ship engine smoke
    ParticlesSystem.createEmitter("spaceshipengine", new ParticleEmitter(
        (clock: number, emitterInstance: ParticleEmitterInstance) => {

            //emit particle based upon emitter required clock
            if (clock - emitterInstance.lastClock > 0.125 * 0.5) {

                // if there is sprite avaiable in the pool to render particle
                const spr = emitterInstance.getSprite()
                if (spr) {
                    spr.age = 15;
                    spr.life = spr.age;
                    spr.velY = -64;
                    spr.lifeDecay = 40;
                    spr.spin = 0;
                    spr.rotation = 0;
                    spr.x = emitterInstance.position.x;
                    spr.pScale = 1
                    spr.scale.set(1, 0.5)
                    spr.y = emitterInstance.position.y;
                }

                emitterInstance.lastClock = clock;
            }
        }, (spr: ParticleSprite, emitterInstance: ParticleEmitterInstance) => {
            spr.alpha = spr.decay * 0.5;
            spr.texture = smokeTextures[Math.floor((smokeTextures.length - 1) * (1 - spr.decay))];

        }))


    //emitter to render fire
    ParticlesSystem.createEmitter("fire1", new ParticleEmitter(
        (clock: number, emitterInstance: ParticleEmitterInstance) => {
            if (clock - emitterInstance.lastClock > 0.18) {

                const spr = emitterInstance.getSprite()

                if (spr) {


                    spr.age = 25;
                    spr.life = spr.age;
                    spr.velY = -70
                    spr.velX = Math.sin(Math.random() * (Math.PI * 4)) * 20
                    spr.lifeDecay = 10;
                    spr.spin = 0;
                    spr.rotation = 0;
                    spr.x = emitterInstance.position.x;
                    spr.y = emitterInstance.position.y;
                    spr.pScale = 2

                }
                emitterInstance.lastClock = clock;
            }
        }, (spr: ParticleSprite, emitterInstance: ParticleEmitterInstance) => {
            spr.alpha = spr.decay;
            spr.scale.set((2 - spr.decay) * spr.pScale, (2 - spr.decay) * spr.pScale)
            spr.texture = explosionTextures[Math.floor((explosionTextures.length - 1) * (1 - spr.decay))];

        }))



    //emitter to render explosion of ships
    ParticlesSystem.createEmitter("explosion", new ParticleEmitter(
        (clock: number, emitterInstance: ParticleEmitterInstance) => {
            if (clock - emitterInstance.lastClock > 0.125 * 0.5) {
                let rot = 0;
                for (let i = 0; i < emitterInstance.maxParticles; i++) {
                    const spr = emitterInstance.getSprite()
                    if (spr) {
                        rot = (i / emitterInstance.maxParticles) * Math.PI * 2;

                        spr.age = 15;
                        spr.life = spr.age;
                        spr.velY = Math.sin(rot) * ((Math.random() * 50) + 20);
                        spr.velX = Math.cos(rot) * ((Math.random() * 50) + 20);
                        spr.lifeDecay = 20;
                        spr.spin = 0;
                        spr.rotation = 0;
                        spr.x = emitterInstance.position.x;
                        spr.y = emitterInstance.position.y;
                        spr.pScale = 2
                        spr.scale.set(1.25, 1.25)

                    }
                }


                emitterInstance.lastClock = clock;
            }
        }, (spr: ParticleSprite, emitterInstance: ParticleEmitterInstance) => {
            spr.alpha = spr.decay;
            spr.scale.set((spr.decay) * spr.pScale, (spr.decay) * spr.pScale)
            spr.texture = explosionTextures[Math.floor((explosionTextures.length - 1) * (1 - spr.decay))];
            if (spr.alpha <= 0) {
                emitterInstance.age = -1
            }
        }))

}