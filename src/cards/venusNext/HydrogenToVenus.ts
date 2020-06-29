import {ICard} from '../ICard';
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';
import { LogHelper } from '../../components/LogHelper';

export class HydrogenToVenus implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.HYDROGEN_TO_VENUS;
    public cardType: CardType = CardType.EVENT;
    private static readonly venusCardsWithFloaters: Set<CardName> = new Set<CardName>([
        CardName.AERIAL_MAPPERS,
        CardName.CELESTIC,
        CardName.DEUTERIUM_EXPORT,
        CardName.DIRIGIBLES,
        CardName.EXTRACTOR_BALLOONS,
        CardName.FLOATING_HABS,
        CardName.FORCED_PRECIPITATION,
        CardName.JET_STREAM_MICROSCRAPPERS,
        CardName.LOCAL_SHADING,
        CardName.STRATOPOLIS
    ]);
    public play(player: Player, game: Game) {
        const jovianTags: number = player.getTagCount(Tags.JOVIAN);
        const floatersCards = player.getResourceCards(ResourceType.FLOATER).filter((card) => {
            return HydrogenToVenus.venusCardsWithFloaters.has(card.name)
        });
        if (jovianTags > 0) {
            if (floatersCards.length === 1) {
                player.addResourceTo(floatersCards[0], jovianTags);
                LogHelper.logAddResource(game, player, floatersCards[0], jovianTags);
            }
            if (floatersCards.length > 1) {
                return new SelectCard(
                    'Select card to add ' + jovianTags + ' floater(s)',
                    floatersCards,
                    (foundCards: Array<ICard>) => {
                        player.addResourceTo(foundCards[0], jovianTags);
                        LogHelper.logAddResource(game, player, foundCards[0], jovianTags);
                        game.increaseVenusScaleLevel(player, 1);
                        return undefined;
                    }
                );
            }
        }
        game.increaseVenusScaleLevel(player, 1);
        return undefined;
    }
}
