import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { View } from './View';
import { User } from './User';



@Table({ timestamps: true, tableName: 'follows' })
export class Follow extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    followingId!: number;


    @BelongsTo(() => User, 'followingId')
    following!: User;


    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    followerId!: number;


    @BelongsTo(() => User, 'followerId')
    follower!: User;
}