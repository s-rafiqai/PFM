import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

class Manager {
  static async create({ email, password, name }) {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO managers (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email, passwordHash, name]
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM managers WHERE email = $1',
      [email]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, name, settings, created_at FROM managers WHERE id = $1',
      [id]
    );

    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateSettings(id, settings) {
    const result = await pool.query(
      `UPDATE managers
       SET settings = $1
       WHERE id = $2
       RETURNING id, email, name, settings`,
      [JSON.stringify(settings), id]
    );

    return result.rows[0];
  }
}

export default Manager;
