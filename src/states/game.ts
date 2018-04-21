import * as Phaser from 'phaser-ce'
import Player from '../sprites/actors/player';
import { Tile, TILE, isBlocker } from '../tile';
import { SIGHT_RANGE, ACTIONS_PER_TURN, INTERACTION } from '../config';
import Wall from '../sprites/tiles/wall';
import EmptyTile from '../sprites/tiles/empty';
import SelectedActionsPanel from '../sprites/ui/selected-actions-panel';
import AvailableActionsPanel from '../sprites/ui/available-actions-panel';
import { ACTION } from '../action';
import { moveForward, moveBack } from '../move';
import { turn, TURN, ROTATION } from '../rotation';
import Actor, { TAG } from '../actor';
import Enemy from '../sprites/actors/enemy';
import TestDummy from '../sprites/actors/test-dummy';

export class GameState extends Phaser.State {


    actionsPerTurn = 4;

    selectedActionsPanel: SelectedActionsPanel;
    availableActionsPanel: AvailableActionsPanel;
    UILayer: Phaser.Group;
    tilesLayer: Phaser.Group;
    actorsLayer: Phaser.Group;
    tilesSprites: Phaser.Sprite[] = [];
    tiles: Tile[] = [];
    renderedTiles: [number, number][] = [];

    player: Player;
    enemies: Enemy[] = [];

    isOver = false;


    init() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.refresh();

        window['game'] = this;
    }
    preload() { }

    create() {
        this.tilesLayer = new Phaser.Group(this.game);
        this.actorsLayer = new Phaser.Group(this.game);
        this.UILayer = new Phaser.Group(this.game);

        this.add.existing(this.tilesLayer);
        this.add.existing(this.actorsLayer);
        this.add.existing(this.UILayer);

        this.initUI();
        this.initPlayer();
        this.initEnemies();
        this.initTiles();
        this.updateTilesSprites();
    }

    render() {


    }

    initPlayer() {
        this.player = new Player(this.game, 3, 3);
        this.actorsLayer.add(this.player);

        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON);

        this.player.events.onKilled.add(() => {
            this.isOver = true;
            console.log('   -----     GAME OVER   ------   ');
        })

        window['player'] = this.player;
    }

    initTiles() {
        this.tiles.push(
            {
                x: 1,
                y: 2,
                type: TILE.WALL
            },
            {
                x: 3,
                y: 0,
                type: TILE.WALL
            }
        );
    }

    initEnemies() {
        this.addEnemy(TestDummy, 1, 0, ROTATION.S);
        this.addEnemy(TestDummy, 3, 2, ROTATION.E);
        this.addEnemy(TestDummy, 3, 1, ROTATION.E);
        this.addEnemy(TestDummy, 5, 3, ROTATION.N);
        this.addEnemy(TestDummy, 10, 4, ROTATION.W);
    }

    addEnemy(enemyClass, x: number, y: number, rotation: ROTATION) {
        let enemy = new enemyClass(this.game, x, y, rotation) as Enemy;

        this.actorsLayer.add(enemy);
        this.enemies.push(enemy);
    }

    updateTilesSprites() {
        for (let i = this.player.mapX - SIGHT_RANGE; i <= this.player.mapX + SIGHT_RANGE; i++)
            for (let j = this.player.mapY - SIGHT_RANGE; j <= this.player.mapY + SIGHT_RANGE; j++) {
                if (this.renderedTiles.find(rt => {
                    return rt[0] === i && rt[1] === j;
                })) continue;

                let tile = this.tiles.find(t => {
                    return t.x === i && t.y === j;
                });

                let sprite: Phaser.Sprite;
                if (tile) {
                    switch (tile.type) {
                        case TILE.WALL:
                            sprite = new Wall(this.game, i, j);
                            break;
                    }
                }

                if (!sprite) {
                    sprite = new EmptyTile(this.game, i, j);
                }

                this.tilesLayer.add(sprite);
                this.tilesSprites.push(sprite)

                this.renderedTiles.push([i, j]);
            }
    }

    initUI() {
        this.selectedActionsPanel = new SelectedActionsPanel(this.game);
        this.availableActionsPanel = new AvailableActionsPanel(this.game);

        this.UILayer.add(this.selectedActionsPanel);
        this.UILayer.add(this.availableActionsPanel);

        this.selectedActionsPanel.y = 200;
        this.availableActionsPanel.y = 300;

        this.availableActionsPanel.onSelected.add((action: ACTION) => {
            this.selectedActionsPanel.addAction(action);
        })

        this.selectedActionsPanel.onConfirmed.add((actions: ACTION[]) => {
            this.player.actions = actions
            this.selectedActionsPanel.clearList();
            this.executeTurn();
        });
    }

    executeTurn() {
        let actionIndex = 0;

        let executeActionRound = () => {

            let fns = [];

            fns.push(() => {
                this.executeActorAction(this.player);
                this.updateTilesSprites();
            });

            this.enemies.forEach((enemy) => {
                // debugger;

                fns.push(() => {
                    this.executeActorAction(enemy);
                });
            })

            // debugger;
            let executeFn = () => {
                let nextFn = fns.shift();
                // debugger;

                if (nextFn) {
                    nextFn();
                    setTimeout(() => {
                        executeFn();
                    }, 100);
                } else {
                    actionIndex++;
                    if (actionIndex < ACTIONS_PER_TURN) {
                        executeActionRound();
                    }
                }
            }

            executeFn();

        };

        executeActionRound();
    }

    executeActorAction(actor: Actor) {
        let action = actor.nextAction();
        let newPos: [number, number];
        switch (action) {
            case ACTION.FORWARD:
                newPos = moveForward(
                    [actor.mapX, actor.mapY],
                    actor.mapRotation
                )
            case ACTION.BACK:
                newPos = newPos || moveBack(
                    [actor.mapX, actor.mapY],
                    actor.mapRotation
                )

                if (this.validateNewPosition(newPos, actor.mapRotation)) {
                    actor.mapMove(newPos);
                }
                break;

            case ACTION.TURN_LEFT:
                actor.mapRotation = turn(actor.mapRotation, TURN.LEFT)
                break;

            case ACTION.TURN_RIGHT:
                actor.mapRotation = turn(actor.mapRotation, TURN.RIGHT)
                break;

            case ACTION.TURN_AROUND:
                actor.mapRotation = turn(actor.mapRotation, TURN.AROUND);
                break;
        }
    }

    validateNewPosition([x, y]: [number, number], direction: ROTATION): boolean {
        let actor: Actor = [...this.enemies, this.player].find(a => {
            return a.mapX === x && a.mapY === y;
        });

        if (actor) {
            if (INTERACTION === 'push') {
                if (actor.hasTag(TAG.ROOTED)) return false;

                let canPush = this.canPushActor(actor, direction);

                if (canPush) {
                    actor.mapMoveDirection(direction);
                }

                return canPush
            }

            if (INTERACTION === 'attack') {
                actor.kill();
                return true;
            }
        }

        let tile = this.tiles.find(t => {
            return t.x === x && t.y === y;
        });

        if (tile && isBlocker(tile)) {
            return false;
        }

        return true;
    }

    canPushActor(actor: Actor, diraction: ROTATION): boolean {
        let pushTarget;

        switch (diraction) {
            case ROTATION.N:
                pushTarget = [actor.mapX, actor.mapY - 1];
                break;

            case ROTATION.E:
                pushTarget = [actor.mapX + 1, actor.mapY];
                break;

            case ROTATION.S:
                pushTarget = [actor.mapX, actor.mapY + 1];
                break;

            case ROTATION.W:
                pushTarget = [actor.mapX - 1, actor.mapY];
                break;
        }

        return this.isEmpty(pushTarget);

    }

    isEmpty([x, y]): boolean {
        let player = this.player.mapX === x && this.player.mapY === y;
        let enemy = this.enemies.find(e => {
            return e.mapX === x && e.mapY === y;
        });
        let blocker = this.tiles.find(t => {
            return t.x === x && t.y === y && isBlocker(t);
        })

        return !(player || enemy || blocker);
    }
}
