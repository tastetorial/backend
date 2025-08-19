import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, Min, Max } from 'sequelize-typescript';
import { User } from './User';
import { Video } from './Video';

@Table({ timestamps: false, tableName: 'video_views' })
export class VideoView extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @ForeignKey(() => Video)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    videoId!: number;



    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    userId!: number


    @AllowNull(false)
    @Column(DataType.DATE)
    viewedAt!: Date;


    @BelongsTo(() => User, 'userId')
    user!: User;


    @BelongsTo(() => Video, 'videoId')
    video!: Video;
}