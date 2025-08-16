import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';


@Table({ timestamps: false, tableName: 'otp' })
export class OTP extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING(100))
    email!: string;

    @Column(DataType.STRING)
    otp!: string;

    @Column(DataType.DATE)
    expiresAt!: Date;

    @Column(DataType.BOOLEAN)
    isVerified!: boolean;
}