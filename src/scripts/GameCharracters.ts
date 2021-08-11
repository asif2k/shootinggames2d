
import * as PIXI from 'pixi.js'


import { PIXIAnimatable } from './PIXIScene';
import { ParticleEmitterInstance } from './ParticlesSystem';
import ShootingGamesScene from './ShootingGamesScene';


//all game characters used in the game are defined here

//base game character class
export class GameCharacter extends PIXI.Sprite implements PIXIAnimatable {



    public velX: number = 0;
    public velY: number = 0;
    public accX: number = 1;
    public accY: number = 1;

    public velDaming: number = 0.035
    public scene: ShootingGamesScene;

    constructor(scene: ShootingGamesScene) {
        super()
        this.scene = scene;
        this.anchor.set(0.5, 0.5)
    }

    public activate() {
    }

    public deActivate() {

    }

    public update(timeDelta: number) {
        this.x += this.velX * timeDelta;
        this.y += this.velY * timeDelta;

        this.velX -= this.velX * this.velDaming;
        this.velY -= this.velY * this.velDaming;
    }

}





//Space ship class to create all space ships in the game
export class SpaceShip extends GameCharacter {

    // space ship might have engine emitters
    public engineEmitter1: ParticleEmitterInstance;
    public engineEmitter2: ParticleEmitterInstance;
    public shipSprite: PIXI.Sprite


    // create engine emitters if required
    public createEngineEmitters() {
        this.engineEmitter1 = this.scene.particlesSystem.spawnEmitterInstance("spaceshipengine", 1)
        this.engineEmitter2 = this.scene.particlesSystem.spawnEmitterInstance("spaceshipengine", 1)

        this.engineEmitter1.host = new PIXI.Container()
        this.engineEmitter2.host = new PIXI.Container()

        this.addChild(this.engineEmitter1.host)
        this.addChild(this.engineEmitter2.host)
    }
}



//special space ship used by player
export class PlayerShip extends SpaceShip {

    constructor(scene: ShootingGamesScene) {

        super(scene)

        this.createEngineEmitters();
        this.engineEmitter1.host.position.set(-9, -30)

        this.engineEmitter2.host.position.set(9, -30)

        this.shipSprite = new PIXI.Sprite(scene.mainTextureAtlas.getFrame(`spaceship-1`))

        this.addChild(this.shipSprite)
        this.shipSprite.anchor.set(0.5, 0.5)
        this.scale.set(0.75, 0.75)
        this.rotation = -Math.PI * 0.5

    }



    public update(timeDelta: number) {

        super.update(timeDelta);
        const width = (this.shipSprite.width * this.scale.x) * 0.5;
        const height = (this.shipSprite.height * this.scale.y) * 0.5;

        if (this.x < width) this.x = width;
        if (this.y < height) this.y = height;

        if (this.x > this.scene.engine.renderer.width - width) this.x = this.scene.engine.renderer.width - width;
        if (this.y > this.scene.engine.renderer.height - height) this.y = this.scene.engine.renderer.height - height;

    }

}



//base class for all enemy space ships
export class EnemyShip extends SpaceShip {

    public movementDelay: number = 1
    public lastMovementClock: number = 0;
    public movementDirection: number = 0;
    public playerPosition: PIXI.Point
    constructor(scene: ShootingGamesScene) {

        super(scene)

        this.scale.set(0.6, 0.6)
        this.rotation = Math.PI * 0.5
        this.accX = 15;
        this.accY = 5;


    }
    public activate() {
        if (this.engineEmitter1) {
            this.engineEmitter1.paused = false;
        }
        if (this.engineEmitter2) {
            this.engineEmitter2.paused = false;
        }
    }

    public deActivate() {
        if (this.engineEmitter1) {
            this.engineEmitter1.paused = true;
        }
        if (this.engineEmitter2) {
            this.engineEmitter2.paused = true;
        }
    }
    public update(timeDelta: number) {
        super.update(timeDelta);


        //ememy random movement logic

        if (this.scene.engine.clock - this.lastMovementClock > this.movementDelay) {
            this.movementDirection = (Math.random() - 0.5)
            this.movementDelay = (Math.random() * 0.5) + 0.75
            this.lastMovementClock = this.scene.engine.clock;
        }

        const height = this.shipSprite.height * 0.5;

        // keep enemy ship inside the view port
        if (this.y + this.velY < height) this.movementDirection = 0.5
        if (this.y + this.velY > this.scene.engine.renderer.height - height) {
            this.movementDirection = -0.5
        }
        this.velY += (this.accY * this.movementDirection) * timeDelta
    }

}



// several enemies ships


export class EnemyShip1 extends EnemyShip {

    constructor(scene: ShootingGamesScene) {

        super(scene)

        this.createEngineEmitters();
        this.engineEmitter1.host.position.set(-7, -10);
        this.engineEmitter2.host.position.set(7, -10);

        this.shipSprite = new PIXI.Sprite(scene.mainTextureAtlas.getFrame(`spaceship-2`))

        this.addChild(this.shipSprite)
        this.shipSprite.anchor.set(0.5, 0.5)
        this.rotation = Math.PI * 0.5

    }


}


export class EnemyShip2 extends EnemyShip {

    constructor(scene: ShootingGamesScene) {

        super(scene)
        if (Math.floor(Math.random() * 2) === 1) {
            this.shipSprite = new PIXI.Sprite(scene.mainTextureAtlas.getFrame(`spaceship-3`))
            this.scale.set(0.65, 0.65)
        }
        else {
            this.shipSprite = new PIXI.Sprite(scene.mainTextureAtlas.getFrame(`spaceship-6`))
            this.scale.set(0.6, 0.6)
        }

        this.addChild(this.shipSprite)
        this.shipSprite.anchor.set(0.5, 0.5)
        this.rotation = Math.PI * 0.5

    }
    public update(timeDelta: number) {
        super.update(timeDelta)

        this.shipSprite.rotation += 6 * timeDelta;
        this.shipSprite.rotation = this.shipSprite.rotation % Math.PI
    }

}

export class EnemyShip3 extends EnemyShip {

    constructor(scene: ShootingGamesScene) {

        super(scene)

        this.createEngineEmitters();
        this.engineEmitter1.host.position.set(0, -10);
        this.engineEmitter2.host.position.set(0, -10);

        this.shipSprite = new PIXI.Sprite(scene.mainTextureAtlas.getFrame('spaceship-4'))

        this.addChild(this.shipSprite)
        this.shipSprite.anchor.set(0.5, 0.5)
        this.rotation = Math.PI * 0.5
        this.scale.set(1, 1)

    }

}

export class EnemyShip4 extends EnemyShip {

    constructor(scene: ShootingGamesScene) {

        super(scene)

        this.createEngineEmitters();
        this.engineEmitter1.host.position.set(9, -20);
        this.engineEmitter2.host.position.set(-9, -20);

        this.shipSprite = new PIXI.Sprite(scene.mainTextureAtlas.getFrame('spaceship-5'))

        this.addChild(this.shipSprite)
        this.shipSprite.anchor.set(0.5, 0.5)
        this.rotation = Math.PI * 0.5
        this.scale.set(0.76, 0.76)

    }

}


