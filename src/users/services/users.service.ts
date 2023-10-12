import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../common/constants';

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private connection: Pool) {}

  async findOne(userId: string): Promise<any> {
    const users = await this.connection.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId],
    );
    return users.rows[0];
  }

  async findByName(name: string): Promise<any> {
    const users = await this.connection.query(
      `SELECT * FROM users WHERE name = $1`,
      [name],
    );
    return users.rows[0];
  }

  async create({ name, password, email }: Partial<any>): Promise<any> {
    const users = await this.connection.query(
      `INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING id, name, email`,
      [name, password, email],
    );
    return users.rows[0];
  }

  async getAll(): Promise<any> {
    const users = await this.connection.query(`SELECT * FROM users`);
    return users.rows;
  }
}
