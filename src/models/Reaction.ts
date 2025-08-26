import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, Min, Max } from 'sequelize-typescript';
import { User } from './User';
import { Video } from './Video';

@Table({ timestamps: true, tableName: 'reactions' })
export class Reaction extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    like!: boolean;



    @AllowNull(true)
    @Column(DataType.TEXT)
    comment!: string | null;


    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    commentedAt!: Date;


    @ForeignKey(() => Video)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    videoId!: number;



    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    userId!: number



    @BelongsTo(() => User, 'userId')
    user!: User;


    @BelongsTo(() => Video, 'videoId')
    video!: Video;
}