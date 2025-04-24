import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Column
  declare id: string; // Mxxxx or Exxxx

  @Column
  declare name: string;

  @Column
  declare email: string;

  @Column
  declare phone: string;

  @Column
  declare role: 'manager' | 'employee';

  @Column
  declare password: string;
}
