
import * as PIXI from 'pixi.js'

import { AppEngine } from './PIXIAppEngine';
import { TextButton } from './TextButton';
import { KEYS } from './keys';

import { PlayerShip, EnemyShip1, EnemyShip2, EnemyShip3, EnemyShip4, EnemyShip } from './GameCharracters';

import ShootingGamesScene from './ShootingGamesScene';

import { Distance2d, EasingsFunc, ObjectsPool } from './utils';


class MissileSprite extends PIXI.Sprite {
    public source: number = 1
    public direction: number = 0;
    public speed: number = 0;

}


export default class Game1Scene extends ShootingGamesScene {

    public player: PlayerShip
    public enemies: EnemyShip[] = []

    public enemiesPool: ObjectsPool;

    public missilesPool: ObjectsPool;
    public missilesTextures: PIXI.Texture[]
    public missiles: MissileSprite[] = []
    public playermissileTime: number = 0;
    public gamePlayPaused: boolean = false
    public activeEnemies: EnemyShip[] = []
    public activeEnemiesCount: number = 0
    public gameOverButton: TextButton
    constructor(engine: AppEngine) {
        super(engine)




        this.enemiesPool = new ObjectsPool(() => {
            let en;
            const type = Math.floor(Math.random() * 4)
            if (type == 1) {
                en = new EnemyShip1(this);
            }
            else if (type == 2) {
                en = new EnemyShip2(this);
            }
            else if (type == 3) {
                en = new EnemyShip3(this);
            }
            else {
                en = new EnemyShip4(this)
            }
            en.renderable = false
            this.enemies.push(en)
            this.addChild(en);
            return en

        }, 20)

        this.missilesPool = new ObjectsPool(() => {
            const b = new MissileSprite();
            this.addChild(b);
            this.missiles.push(b);
            b.renderable = false;
            return b;
        }, 200);




    }


    //right now brute force collision detection , but more optimized and advanced collision detected could be implemented
    //using quad trees or grid positioning system
    public missileEnemiesCollision(missile: MissileSprite) {
        let i = 0;
        let en;
        for (i = 0; i < this.activeEnemiesCount; i++) {
            en = this.activeEnemies[i];
            if (Distance2d(missile.x, missile.y, en.x, en.y) < (en.shipSprite.width * en.scale.x) * 0.5) {
                this.missilesPool.free(missile);
                missile.renderable = false;

                //if there are fewer ships in the game then spawn more ships
                if (this.activeEnemiesCount < 10) this.spawnEnemeyShip()

                this.freeEnemeyShip(en);

                this.particlesSystem.spawnEmitterInstance("explosion", Infinity, 10).setPosition(en.x, en.y);

            }
        }



    }


    //when scene is activated again then restart the game
    public activated() {
        super.activated();
        if (this.player) {
            this.player.renderable = true;
            this.gameOverButton.renderable = false;
            this.gamePlayPaused = false
            this.player.position.set(100, 100)

            for (let i = 0; i < this.activeEnemiesCount; i++) {
                this.freeEnemeyShip(this.activeEnemies[i]);

            }

        }
    }


    //game play loop for this scene

    public gamePlay(timeDelta: number) {

        this.player.update(timeDelta);

        const app = this.engine;
        if (app.keys[KEYS.KEY_UP]) {
            this.player.velY -= this.player.accY;
        }
        else if (app.keys[KEYS.KEY_DOWN]) {
            this.player.velY += this.player.accY;
        }

        if (app.keys[KEYS.KEY_LEFT]) {
            this.player.velX -= this.player.accX;
        }
        else if (app.keys[KEYS.KEY_RIGHT]) {
            this.player.velX += this.player.accX;
        }

        if (app.keys[KEYS.KEY_SPACE]) {
            if (this.engine.clock - this.playermissileTime > 0.15) {
                this.firePlayermissile()
                this.playermissileTime = this.engine.clock
            }

        }

        let en;
        let i = 0;
        this.activeEnemiesCount = 0;
        for (i = 0; i < this.enemies.length; i++) {
            en = this.enemies[i];
            if (en.renderable) {
                en.x -= en.accX * timeDelta;
                en.update(timeDelta);
                if (en.x + en.shipSprite.width < 0) {
                    this.freeEnemeyShip(en)
                }
                else {
                    this.activeEnemies[this.activeEnemiesCount++] = en
                }


            }
        }

        let missile;
        for (i = 0; i < this.missiles.length; i++) {
            missile = this.missiles[i];
            if (missile.renderable) {
                missile.x += Math.sin(missile.direction) * (missile.speed * timeDelta)
                missile.y += Math.cos(missile.direction) * (missile.speed * timeDelta)
                if (missile.x + missile.width < 0 || missile.x - missile.width > this.engine.renderer.width) {
                    this.missilesPool.free(missile);
                    missile.renderable = false;
                }
                else {
                    this.missileEnemiesCollision(missile)
                }
            }

        }

        for (i = 0; i < this.activeEnemiesCount; i++) {
            en = this.activeEnemies[i];
            if (Distance2d(this.player.x, this.player.y, en.x, en.y) < (this.player.shipSprite.width * this.player.scale.x) * 0.75) {



                this.freeEnemeyShip(en);
                this.particlesSystem.spawnEmitterInstance("explosion", Infinity, 10).setPosition(this.player.x, this.player.y);
                this.particlesSystem.spawnEmitterInstance("explosion", Infinity, 10).setPosition(en.x, en.y);
                this.player.renderable = false;
                this.gamePlayPaused = true;
                this.gameOverButton.renderable = true;
            }
        }

    }
    public update(timeDelta: number) {
        super.update(timeDelta)
        if (!this.gamePlayPaused) this.gamePlay(timeDelta)

        if (this.gameOverButton.renderable) {
            let sc = EasingsFunc.BackOut(this.engine.clock % 1) * 1.5;
            sc = Math.max(sc, 1);
            this.gameOverButton.scale.set(sc, sc);
        }
    }

    //free enemy instance and put back in the pool to be reused
    public freeEnemeyShip(en: EnemyShip) {
        if (en.renderable === false) return;
        en.renderable = false;
        en.deActivate()
        this.enemiesPool.free(en);
    }

    //spwan an enemy ship in the game
    public spawnEnemeyShip() {
        const en = this.enemiesPool.get() as EnemyShip

        if (!en) return;
        en.position.set(this.engine.renderer.width, Math.random() * this.engine.renderer.height);
        en.velX = -150;
        en.accX = (Math.random() * 60) + 25;
        en.accY = (Math.random() * 500) + 200;
        en.playerPosition = this.player.position
        en.renderable = true;
        en.activate()
    }

    //fire player missile
    public firePlayermissile() {
        const missile = this.missilesPool.get() as MissileSprite;

        if (!missile) return
        missile.texture = this.missilesTextures[0]
        missile.source = 1;
        missile.anchor.set(0.5, 0.5);

        missile.direction = Math.PI * 0.5;
        missile.renderable = true;
        missile.x = this.player.x;
        missile.y = this.player.y;
        missile.speed = 600;
        missile.scale.set(1, 2)
    }



    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {

        this.player = new PlayerShip(this)
        this.player.position.set(100, 100)

        this.player.accY = 8;
        this.player.accX = 8;

        let i = 0;

        for (i = 0; i < 20; i++) {
            this.enemiesPool.get();
        }
        for (i = 0; i < this.enemies.length; i++) {
            this.enemiesPool.free(this.enemies[i]);
        }

        this.timers.create((time: number) => {
            if (!this.gamePlayPaused) this.spawnEnemeyShip()
            return true

        }, 2);

        this.addChild(this.player);


        this.missilesTextures = this.mainTextureAtlas.getFramesList("missile-0", "missile-1")

        this.gameOverButton = new TextButton("GAME OVER", () => {
            this.engine.setActiveScene("menu");
        })
        this.gameOverButton.renderable = false;
        this.gameOverButton.position.set(this.engine.renderer.width * 0.5, this.engine.renderer.height * 0.5)
        this.addChild(this.gameOverButton);
    }
}