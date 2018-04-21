import * as Phaser from 'phaser-ce'
import Player from '../sprites/actors/player';
import { Tile, TILE } from '../tile';
import { SIGHT_RANGE, ACTIONS_PER_TURN } from '../config';
import Wall from '../sprites/tiles/wall';
import EmptyTile from '../sprites/tiles/empty';
import SelectedActionsPanel from '../sprites/ui/selected-actions-panel';
import AvailableActionsPanel from '../sprites/ui/available-actions-panel';
import { ACTION } from '../action';
import { moveForward, moveBack } from '../move';
import { turn, TURN } from '../rotation';
import Actor from '../actor';

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
        this.initTiles();
        this.updateTilesSprites();
    }

    render() {


    }

    initPlayer() {
        this.player = new Player(this.game, 3, 3);
        this.actorsLayer.add(this.player);

        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON);

        window['player'] = this.player;
    }

    initTiles() {
        this.tiles.push({
            x: 1,
            y: 2,
            type: TILE.WALL
        });
    }

    updateTilesSprites() {
        console.log('updateTilesSprites', this.player.mapX, this.player.mapY)
        for (let i = this.player.mapX - SIGHT_RANGE; i <= this.player.mapX + SIGHT_RANGE; i++)
            for (let j = this.player.mapY - SIGHT_RANGE; j <= this.player.mapY + SIGHT_RANGE; j++) {
                if (this.renderedTiles.find(rt => {
                    return rt[0] === i && rt[1] === j;
                })) continue;

                let tile = this.tiles.find(t => {
                    return t.x === i && t.y === j;
                });

                // console.log(i,j, tile)

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
            this.executeActorAction(this.player);
            this.updateTilesSprites();

            actionIndex++;
            if (actionIndex < ACTIONS_PER_TURN) {
                executeActionRound();
            }
        };

        executeActionRound();
    }

    executeActorAction(actor: Actor) {
        let action = actor.nextAction();
        console.log(ACTION[action], actor);
        switch (action) {
            case ACTION.FORWARD:
                actor.mapMove(moveForward(
                    [actor.mapX, actor.mapY],
                    actor.mapRotation
                ));
                break;

            case ACTION.BACK:
                actor.mapMove(moveBack(
                    [actor.mapX, actor.mapY],
                    actor.mapRotation
                ));
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
}
