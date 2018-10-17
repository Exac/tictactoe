import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Sessions {

    @PrimaryColumn({ type: 'varchar', length: '128' })
    session_id: string;

    @Column({ precision: 11, unsigned: true })
    expires: number;

    @Column({ type: 'text', nullable: true })
    data: string;

}
