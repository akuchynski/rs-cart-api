import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../common/constants';

@Injectable()
export class OrderService {
  constructor(@Inject(PG_CONNECTION) private connection: Pool) {}

  async findById(orderId: string): Promise<any> {
    const orders = await this.connection.query(
      `SELECT * FROM orders WHERE id = $1 LIMIT 1`,
      [orderId],
    );
    const items = await this.getItemsById(orders.rows[0].cart_id);

    return {
      id: orderId,
      items,
      address: orders.rows[0].delivery.address,
      statusHistory: [
        {
          status: orders.rows[0].status,
          timestamp: orders.rows[0].updated_at,
          comment: orders.rows[0].comments,
        },
      ],
    };
  }

  async getItemsById(orderId: string) {
    const items = await this.connection.query(
      `SELECT * FROM cart_items WHERE cart_id = $1`,
      [orderId],
    );
    return items.rows.map(item => ({
      productId: item.product_id,
      count: item.count,
    }));
  }

  async getOrders(): Promise<any> {
    const orders = await this.connection.query(
      `SELECT o.id, o.delivery, o.status, o.updated_at, o.comments, SUM(count) as count 
                        FROM orders as o 
                            JOIN cart_items ci on o.cart_id = ci.cart_id 
                                GROUP BY ci.cart_id, o.id`,
    );
    return orders.rows.map(order => ({
      id: order.id,
      items: new Array(Number(order.count)),
      address: {
        firstName: order.delivery.firstName,
        lastName: order.delivery.lastName,
        address: order.delivery.address,
        comment: order.delivery.comment,
      },
      statusHistory: [
        {
          status: order.status,
          timestamp: order.updated_at,
          comment: order.comments,
        },
      ],
    }));
  }

  async create(data: any) {
    const { user_id, cart_id, payment, delivery, comments, total } = data;
    const orders = await this.connection.query(
      `INSERT INTO orders (user_id, cart_id, payment, delivery, comments, total) 
                            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, cart_id, payment, delivery, comments, total],
    );
    return orders.rows[0];
  }

  async updateStatusAndCommentById(orderId, data): Promise<any> {
    const { comment, status } = data;
    const orders = await this.connection.query(
      `UPDATE orders SET comments = $1, status = $2 WHERE id = $3`,
      [comment, status, orderId],
    );
    return orders.rows[0];
  }

  async deleteOrder(orderId): Promise<any> {
    await this.connection.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
  }
}
