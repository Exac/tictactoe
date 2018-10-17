import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToMany } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn({ unsigned: true })
    user_id: number;

    @Column({ length: '18' })
    @Index({ unique: true })
    alias: string;

    @Index({ unique: true })
    @Column({ length: '255' })
    email: string;

    @Column({ length: '255' })
    password: string;

    @Column({ length: '255', nullable: true })
    recovery: string;

    @Column({ nullable: true })
    recoveryexpire: Date;

    @Column({ default: '1500' })
    elo: number;

}

