import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { View } from './View';
import { User } from './User';
import { Reaction } from './Reaction';



@Table({ timestamps: true, tableName: 'posts' })
export class Post extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @AllowNull(false)
    @Column(DataType.STRING(100))
    title!: string;



    @AllowNull(false)
    @Column(DataType.TEXT)
    body!: string;


    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId!: number



    @BelongsTo(() => User, 'userId')
    user!: string;



    @HasMany(() => View, { onDelete: 'CASCADE' })
    views!: View[]


    @HasMany(() => Reaction, 'postId')
    reactions!: Reaction[]
}