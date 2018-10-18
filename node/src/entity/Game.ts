import { Entity, PrimaryGeneratedColumn, Column, Index, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

class BoardTransformer implements ValueTransformer {
    // Store the board as a stringified 3d string array,
    // Access the board as a parsed 3d array.
    to(board: string[][]): string {
        return JSON.stringify(board);
    }

    from(stringified: string): string[] {
        return JSON.parse(stringified);
    }
}

@Entity()
export class Game {

    @PrimaryGeneratedColumn({ unsigned: true })
    game_id: number;

    @Column({ unsigned: true, nullable: false })
    x: number;

    @Column({ unsigned: true, nullable: false })
    o: number;

    @Column({ default: 'connected' }) // connected, forefited, winner, loser
    xstatus: string;

    @Column({ default: 'connected' }) // connected, forefited, winner, loser
    ostatus: string;

    @Column()
    last: Date;

    @Column({ type: String, transformer: new BoardTransformer() })
    board: string[][];

}
