import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../common/constants';

@Injectable()
export class CartService {
  constructor(@Inject(PG_CONNECTION) private connection: Pool) {}

  async findByUserId(userId: string): Promise<any> {
    const carts = await this.connection.query(
      `SELECT * FROM carts WHERE user_id = $1 AND is_submitted = false LIMIT 1`,
      [userId],
    );

    if (!carts.rows?.[0]?.id) {
      return null;
    }

    const cartItems = await this.connection.query(
      `SELECT * FROM cart_items WHERE cart_id = $1`,
      [carts.rows[0].id],
    );

    return {
      id: carts.rows[0].id,
      items: cartItems.rows.map(cartItem => ({
        product: { id: cartItem.product_id },
        count: cartItem.count,
      })),
    };
  }

  async createByUserId(userId: string) {
    const carts = await this.connection.query(
      `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
      [userId],
    );

    return {
      id: carts.rows[0].id,
      items: [],
    };
  }

  async findOrCreateByUserId(userId: string): Promise<any> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { product, count }: any): Promise<any> {
    const { id, ...rest }: any = await this.findOrCreateByUserId(userId);

    const existing = await this.connection.query(
      `SELECT * FROM cart_items WHERE product_id = $1 AND cart_id = $2`,
      [product.id, id],
    );

    if (count > existing.rows?.[0]?.count || !existing.rows?.[0]) {
      if (existing.rows[0]) {
        await this.connection.query(
          `UPDATE cart_items SET count = $3 WHERE product_id = $1 AND cart_id = $2`,
          [product.id, id, count],
        );
      } else {
        await this.connection.query(
          `INSERT INTO cart_items (product_id, cart_id, count) VALUES($1, $2, $3)`,
          [product.id, id, count],
        );
      }
    } else if (count === 0 && existing.rows?.[0]?.count > count) {
      await this.connection.query(
        `DELETE FROM cart_items WHERE product_id = $1`,
        [product.id],
      );
    } else {
      await this.connection.query(
        `UPDATE cart_items SET count = $1 WHERE cart_id = $2 AND product_id = $3`,
        [count, id, product.id],
      );
    }

    const createdCartItems = await this.connection.query(
      `SELECT * FROM cart_items WHERE cart_id = $1`,
      [id],
    );

    return {
      id,
      ...rest,
      items: createdCartItems.rows.map(cartItem => ({
        product: { ...cartItem },
        count: cartItem.count,
      })),
    };
  }

  async removeByUserId(userId) {
    await this.connection.query(
      `UPDATE carts SET is_submitted = true WHERE user_id = $1`,
      [userId],
    );
  }
}
