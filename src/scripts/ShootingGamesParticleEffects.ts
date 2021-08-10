
import { ParticleEmitter, ParticlesSystem, ParticleEmitterInstance, ParticleSprite } from './ParticlesSystem';

import { TextureAtlas } from './TextureAtlas';
import { EasingsFunc } from './utils';

function prepareFireEffects(textureAtlas: TextureAtlas) {
    const fireTextures = textureAtlas.allFrames;



    ParticlesSystem.createEmitter("fire", new ParticleEmitter(
        (clock: number, emitterInstance: ParticleEmitterInstance) => {
            if (clock - emitterInstance.lastClock > 0.125 * 0.5) {
                const spr = emitterInstance.getSprite()
                if (spr) {
                    spr.age = 15;
                    spr.life = spr.age;
                    //  spr.velX = (Math.random() - 1) * 30;
                    spr.velY = -64;
                    spr.velY = 0;
                    //spr.gravity = 10;
                    // spr.scale.set(1, 1)
                    spr.lifeDecay = 15;
                    spr.spin = 0;
                    spr.rotation = 0;
                    spr.x = emitterInstance.position.x + (Math.random() - 0.5) * 600;
                    spr.pScale = Math.random() * 6 + 2

                    spr.y = emitterInstance.position.y + (Math.random() - 0.5) * 600;
                }

                emitterInstance.lastClock = clock;
            }
        }, (spr: ParticleSprite, emitterInstance: ParticleEmitterInstance) => {
            spr.scale.set((1 - spr.decay) * spr.pScale, (1 - spr.decay) * spr.pScale)
            //  spr.alpha = spr.decay;
            spr.texture = fireTextures[Math.floor((fireTextures.length - 1) * (1 - spr.decay))];
            spr.rotation = EasingsFunc.BounceOut(spr.decay) * 20;


            return

            // spr.rotation = 0;
            spr.x = -EasingsFunc.BackOut(1 - spr.decay) * 70;

            // spr.velY = -EasingsFunc.BounceOut(spr.decay) * 20;
        }))


}


export function InitParticleEffects(textureAtlas: TextureAtlas) {

    prepareFireEffects(textureAtlas)



}