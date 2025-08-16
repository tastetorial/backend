import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './User';



@Table({ timestamps: true, tableName: 'follow' })
export class Follow extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    followingId!: number;



    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    followerId!: number;



    @BelongsTo(() => User, 'followingId')
    following!: User;


    @BelongsTo(() => User, 'followerId')
    follower!: User;
}