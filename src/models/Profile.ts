import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './Models';


export enum AccountPrivacy {
    PUBLIC = 'public',
    PRIVATE = 'private',
    FRIENDS = 'friends'
}


export enum AccountCategory {
    PROFESSIONAL = 'professional',
    ASPIRING = 'aspiring',
    FASHION = 'fashion',
    FITNESS = 'fitness',
    LIFESTYLE = 'lifestyle',
    COMMERCIAL = 'commercial',
    INFLUENCER = 'influencer',
    NEWCOMER = 'newcomer',
    PHOTOGRAPHER = 'photographer',
    CLIENT = 'client',
    TALENT_AGENCY = 'talent_agency',
}


@Table({ timestamps: true, tableName: 'profiles' })
export class Profile extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;



    @AllowNull(false)
    @Column(DataType.STRING(50))
    firstName!: string;



    @AllowNull(false)
    @Column(DataType.STRING(50))
    lastName!: string;


    @AllowNull(true)
    @Column(DataType.STRING)
    avatar!: string;


    @AllowNull(true)
    @Column(DataType.STRING(100))
    otherNames!: string;



    @AllowNull(true)
    @Column(DataType.STRING(100))
    address!: string;



    @AllowNull(true)
    @Column(DataType.TEXT)
    description!: string;



    @AllowNull(true)
    @Column(DataType.DATEONLY)
    dateOfBirth!: Date;



    @AllowNull(false)
    @Default(AccountPrivacy.PUBLIC)
    @Column(DataType.ENUM(...Object.values(AccountPrivacy)))
    privacy!: string;



    @AllowNull(false)
    @Default(AccountCategory.NEWCOMER)
    @Column(DataType.ENUM(...Object.values(AccountCategory)))
    category!: string;



    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId!: number;

    @BelongsTo(() => User)
    user!: User;
}