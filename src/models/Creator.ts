import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './User';



@Table({ timestamps: true, tableName: 'creator' })
export class Creator extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @AllowNull(true)
    @Column(DataType.TEXT)
    bio!: string;


    @AllowNull(false)
    @Column(DataType.BIGINT)
    userId!: number;


    @BelongsTo(() => User, 'userId')
    user!: User;
}