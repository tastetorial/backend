import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, Min, Max } from 'sequelize-typescript';
import { View } from './View';
import { User } from './User';
import { Post } from './Post';

export enum ReactionType {
    LIKE = 'like',
    RATING = 'rating'
}

@Table({ timestamps: true, tableName: 'reactions' })
export class Reaction extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(ReactionType)))
    type!: string


    @AllowNull(true)
    @Min(1)
    @Max(5)
    @Column(DataType.TINYINT)
    value!: number

    @ForeignKey(() => Post)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    postId!: number;


    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    userId!: number
}