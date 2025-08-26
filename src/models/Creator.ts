import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './User';
import { CreatorStatus } from '../enum';



@Table({ timestamps: true, tableName: 'creators' })
export class Creator extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @AllowNull(true)
    @Column(DataType.TEXT)
    bio!: string;


    @AllowNull(false)
    @Default(CreatorStatus.PENDING)
    @Column(DataType.ENUM(...Object.values(CreatorStatus)))
    status!: CreatorStatus;


    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId!: number;


    @BelongsTo(() => User, 'userId')
    user!: User;
}