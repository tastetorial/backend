import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, Min, Max } from 'sequelize-typescript';
import { User } from './User';
import { Video } from './Video';

@Table({ updatedAt: false, tableName: 'saved_videos' })
export class SavedVideo extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number


    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    userId!: number



    @ForeignKey(() => Video)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    videoId!: number



    @BelongsTo(() => User, 'userId')
    user!: User;


    @BelongsTo(() => Video, 'videoId')
    video!: Video;
}