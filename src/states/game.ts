import * as Phaser from 'phaser-ce'
import Player from '../sprites/actors/player';
import { Tile, TILE, isBlocker } from '../tile';
import { SIGHT_RANGE, ACTIONS_PER_TURN, INTERACTION, MAP_CENTER_X, MAP_CENTER_Y, TILE_WIDTH, TILE_HEIGHT, ANIMATION_TIME } from '../config';
import Wall from '../sprites/tiles/wall';
import EmptyTile from '../sprites/tiles/empty';
import SelectedActionsPanel from '../sprites/ui/selected-actions-panel';
import AvailableActionsPanel from '../sprites/ui/available-actions-panel';
import { ACTION } from '../action';
import { moveForward, moveBack, moveLeft, moveRight } from '../move';
import { turn, TURN, ROTATION } from '../rotation';
import Actor, { TAG } from '../actor';
import Enemy from '../sprites/actors/enemy';
import TestDummy from '../sprites/actors/test-dummy';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class GameState extends Phaser.State {


    rerollButton: Phaser.Sprite;
    mapLayer: Phaser.Group;
    pointsLabel: Phaser.Text;
    _points = 0;

    set points(v) {
        this._points = v;
        this.pointsLabel.setText(`${v}`);
    }

    get points() {
        return this._points;
    }

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

    borders = [0, 0, 0, 0];

    rerollPosible = new BehaviorSubject<boolean>(true);


    init() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.refresh();

        window['game'] = this;
    }
    preload() { }

    create() {
        this.mapLayer = new Phaser.Group(this.game);

        this.tilesLayer = new Phaser.Group(this.game);
        this.mapLayer.add(this.tilesLayer);
        this.actorsLayer = new Phaser.Group(this.game);
        this.mapLayer.add(this.actorsLayer);

        this.UILayer = new Phaser.Group(this.game);

        this.add.existing(this.mapLayer);
        this.add.existing(this.UILayer);

        this.initUI();
        this.initPlayer();
        this.initEnemies();
        this.initTiles();
        this.updateMap();
        this.centerMap();
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

        enemy.events.onKilled.add(() => {
            this.points = this.points + 1;
        })
    }

    updateMap(animation = false) {
        this.updateTilesSprites();
    }

    centerMap(animation = false) {
        let x = -this.player.x - TILE_WIDTH / 2 + MAP_CENTER_X;
        let y = -this.player.y - TILE_HEIGHT / 2 + MAP_CENTER_Y;

        if (animation) {
            let tween = this.game.add.tween(this.mapLayer).to({
                x, y
            }, 200);

            tween.start();
        } else {
            this.mapLayer.x = x;
            this.mapLayer.y = y;
        }


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

                this.borders = [
                    Math.min(this.borders[0], i),
                    Math.min(this.borders[1], j),
                    Math.max(this.borders[2], i),
                    Math.max(this.borders[3], j),
                ]
            }
    }

    initUI() {

        this.add.image(0, 0, 'ui-frame', 0, this.UILayer);

        this.selectedActionsPanel = new SelectedActionsPanel(this.game);
        this.availableActionsPanel = new AvailableActionsPanel(this.game);

        this.rerollButton = new Phaser.Sprite(this.game, 174, 441, 'reroll-button');
        this.rerollButton.inputEnabled = true;
        this.UILayer.add(this.rerollButton);

        this.rerollButton.events.onInputDown.add(() => {
            if (this.rerollPosible.getValue()) {
                this.availableActionsPanel.reroll();
                this.rerollPosible.next(false);
            }
        });

        this.rerollPosible.subscribe(ready => {
            if (ready) {
                this.rerollButton.frame = 0;
                this.rerollButton.input.useHandCursor = true;
            } else {
                this.rerollButton.frame = 2;
                this.rerollButton.input.useHandCursor = false;
            }
        });

        this.UILayer.add(this.selectedActionsPanel);
        this.UILayer.add(this.availableActionsPanel);

        this.selectedActionsPanel.y = 437;
        this.selectedActionsPanel.x = 682;

        this.availableActionsPanel.y = 439;

        this.availableActionsPanel.onSelected.add((action: ACTION) => {
            this.selectedActionsPanel.addAction(action);
        })

        this.selectedActionsPanel.onConfirmed.add((actions: ACTION[]) => {
            this.player.actions = actions
            this.selectedActionsPanel.clearList();
            this.executeTurn();
        });

        this.pointsLabel = new Phaser.Text(this.game, 10, 150, '');
        this.points = 0;

        this.UILayer.add(this.pointsLabel);
    }

    executeTurn() {
        let actionIndex = 0;

        let executeActionRound = () => {

            let fns = [];

            fns.push(() => {
                this.executeActorAction(this.player);
                this.updateMap(true);
            });

            this.enemies.forEach((enemy) => {
                // debugger;

                fns.push(() => {
                    this.executeActorAction(enemy);
                });
            })

            // debugger;
            let executeFn = () => {
                console.log('executeFn')
                if (this.isOver) return;

                let nextFn = fns.shift();
                // debugger;

                if (nextFn) {
                    nextFn();
                    setTimeout(() => {
                        executeFn();
                    }, ANIMATION_TIME);
                } else {
                    actionIndex++;
                    if (actionIndex < ACTIONS_PER_TURN) {
                        executeActionRound();
                    } else {
                        this.centerMap(true);

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
            case ACTION.LEFT:
                newPos = newPos || moveLeft(
                    [actor.mapX, actor.mapY],
                    actor.mapRotation
                )
            case ACTION.RIGHT:
                newPos = newPos || moveRight(
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

            case ACTION.SHOOT:
                this.shoot([actor.mapX, actor.mapY], actor.mapRotation);
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

    shoot([x, y], direction: ROTATION) {
        let bulletStep;

        switch (direction) {
            case ROTATION.N:
                bulletStep = [0, -1];
                break;

            case ROTATION.E:
                bulletStep = [1, 0];
                break;

            case ROTATION.S:
                bulletStep = [0, 1];
                break;

            case ROTATION.W:
                bulletStep = [-1, 0];
                break;
        }

        let hitSomething = false;
        let outOfBorders = false;

        while (!hitSomething && !outOfBorders) {
            x = x + bulletStep[0];
            y = y + bulletStep[1];

            outOfBorders =
                x < this.borders[0] ||
                y < this.borders[1] ||
                x > this.borders[2] ||
                y > this.borders[3];

            let actor = [...this.enemies, this.player].find(a => {
                return a.mapX === x && a.mapY === y;
            });

            if (actor) {
                hitSomething = true;
                actor.kill();
            }
        }

    }
}
