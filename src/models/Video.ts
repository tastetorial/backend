import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './User';
import { Reaction } from './Reaction';
import { VideoStatus } from '../enum';
import { Category } from './Category';



@Table({ timestamps: true, tableName: 'video' })
export class Video extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @AllowNull(false)
    @Column(DataType.STRING(100))
    title!: string;


    @AllowNull(false)
    @Column(DataType.STRING)
    videoUrl!: string;


    @AllowNull(false)
    @Column(DataType.STRING)
    thumbnailUrl!: string;


    @AllowNull(true)
    @Column(DataType.TEXT)
    description!: string;


    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    views!: number;



    @AllowNull(false)
    @Default(VideoStatus.PUBLISHED)
    @Column(DataType.ENUM(...Object.values(VideoStatus)))
    status!: string;



    @AllowNull(true)
    @Column(DataType.STRING)
    tags!: string;


    @AllowNull(false)
    @ForeignKey(() => Category)
    @Column(DataType.BIGINT)
    categoryId!: number;


    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId!: number;

}