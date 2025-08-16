import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Follow } from './Follow';
import { UserRole, UserStatus } from '../enum';
import { Video } from './Video';




@Table({ timestamps: true, tableName: 'user' })
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;



    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(50))
    email!: string;



    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    emailVerified!: boolean;



    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(20))
    phone!: string;



    @AllowNull(true)
    @Unique
    @Column(DataType.STRING(20))
    username!: string;



    @AllowNull(true)
    @Column(DataType.STRING(100))
    firstname!: string;



    @AllowNull(true)
    @Column(DataType.STRING(100))
    lastname!: string;



    @AllowNull(true)
    @Column(DataType.DATEONLY)
    birthday!: Date;



    @Default(UserStatus.ACTIVE)
    @Column(DataType.ENUM(...Object.values(UserStatus)))
    status!: UserStatus;



    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string | undefined;



    @Default(UserRole.VIEWER)
    @Column(DataType.ENUM(...Object.values(UserRole)))
    role!: UserRole;



    @AllowNull(true)
    @Column(DataType.STRING)
    deviceToken!: string;



    @HasMany(() => Video)
    videos!: Video[]



    @BelongsToMany(() => User, () => Follow, 'followingId', 'followerId')
    followers!: User[]


    @BelongsToMany(() => User, () => Follow, 'followerId', 'followingId')
    followings!: User[]
}