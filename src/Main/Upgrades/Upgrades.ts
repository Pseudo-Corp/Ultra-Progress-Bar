import { Player } from '../../types/player';

export class Upgrade {
    constructor(
        public level: number,
        public cost: number,
        public player: Player
    ) {}
}