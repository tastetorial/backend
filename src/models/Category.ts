import { Table, Model, Column, DataType, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement } from 'sequelize-typescript';



@Table({ timestamps: true, tableName: 'category' })
export class Category extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;


    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;


    @AllowNull(true)
    @Column(DataType.STRING)
    description!: string;


    @AllowNull(true)
    @Column(DataType.STRING)
    image!: string;
}