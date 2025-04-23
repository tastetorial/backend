import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Post } from './Post';

export enum PostType {
    POSE = 'pose',
    STYLE = 'style'
}

export enum ViewType {
    FRONT = 'front',
    OPEN = 'open'
}

export enum PostOptions {
    STANDING = 'standing',
    SITTING = 'sitting',
    LYING_DOWN = 'lying_down',
    WALKING = 'walking',
    RUNNING = 'running',
    JUMPING = 'jumping',
    LEANING = 'leaning'
}

@Table({ timestamps: false, tableName: 'views' })
export class View extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;



    @AllowNull(false)
    @Column(DataType.JSON)
    images!: string;



    @AllowNull(true)
    @Column(DataType.ENUM(...Object.values(PostType)))
    postType!: string;



    @AllowNull(true)
    @Column(DataType.ENUM(...Object.values(ViewType)))
    viewType!: string;


    @AllowNull(true)
    @Column(DataType.JSON)
    options!: string;


    @AllowNull(false)
    @ForeignKey(() => Post)
    @Column(DataType.BIGINT)
    postId!: number


    @BelongsTo(() => Post, 'postId')
    post!: Post;
}