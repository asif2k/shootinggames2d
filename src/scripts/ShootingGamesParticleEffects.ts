
import { ParticleEmitter, ParticlesSystem, ParticleEmitterInstance, ParticleSprite } from './ParticlesSystem';

import { TextureAtlas } from './TextureAtlas';
import { EasingsFunc } from './utils';

function prepareFireEffects(textureAtlas: TextureAtlas) {
    const fireTextures = textureAtlas.allFrames;



    ParticlesSystem.createEmitter("fire", new ParticleEmitter(
        (clock: number, emitterInstance: ParticleEmitterInstance) => {
            if (clock - emitterInstance.lastClock > 0.25) {
                const spr = emitterInstance.getSprite()
                if (spr) {
                    spr.age = 25;
                    spr.life = spr.age;
                    //  spr.velX = (Math.random() - 1) * 30;
                    spr.velY = -64;
                    //spr.gravity = 10;
                    // spr.scale.set(1, 1)
                    spr.lifeDecay = 15;
                    spr.spin = 0;
                    spr.rotation = 0;
                    spr.x = emitterInstance.position.x;

                    spr.y = emitterInstance.position.y;
                }

                emitterInstance.lastClock = clock;
            }
        }, (spr: ParticleSprite, emitterInstance: ParticleEmitterInstance) => {
            spr.scale.set((1 - spr.decay) * 4, (1 - spr.decay) * 4)
            spr.alpha = spr.decay;
            spr.texture = fireTextures[Math.floor((fireTextures.length - 1) * (1 - spr.decay))];
            return
            spr.rotation = EasingsFunc.BounceOut(spr.decay) * 20;

            // spr.rotation = 0;
            spr.x = -EasingsFunc.BackOut(1 - spr.decay) * 70;

            // spr.velY = -EasingsFunc.BounceOut(spr.decay) * 20;
        }))


}


export function InitParticleEffects(textureAtlas: TextureAtlas) {

    prepareFireEffects(textureAtlas)



}