import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Profile } from './Models';
import { Post } from './Post';
import { Follow } from './Follow';
import { Reaction } from './Reaction';

export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}



export enum UserState {
    STEP_ONE = 'STEP_ONE',
    STEP_TWO = 'STEP_TWO',
    STEP_THREE = 'STEP_THREE',
    VERIFIED = 'VERIFIED',
}


@Table({ timestamps: true, tableName: 'users' })
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @Unique
    @Column(DataType.CHAR(9))
    userId!: string;


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



    @Default(UserStatus.ACTIVE)
    @Column(DataType.ENUM(...Object.values(UserStatus)))
    status!: UserStatus;



    @Default(UserState.STEP_TWO)
    @Column(DataType.ENUM(...Object.values(UserState)))
    state!: UserState;



    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string | undefined;


    @Default(UserRole.USER)
    @Column(DataType.ENUM(UserRole.ADMIN, UserRole.USER))
    role!: string;



    @AllowNull(true)
    @Column(DataType.STRING)
    deviceToken!: string;


    @HasMany(() => Post, 'userId')
    posts!: Post[]


    @HasOne(() => Profile, 'userId')
    profile!: Profile


    @BelongsToMany(() => User, () => Follow, 'followingId', 'followerId')
    followers!: User[]


    @BelongsToMany(() => User, () => Follow, 'followerId', 'followingId')
    followings!: User[]


    // @HasMany(() => Reaction, 'userId')
    // reactions!: Reaction[];
}