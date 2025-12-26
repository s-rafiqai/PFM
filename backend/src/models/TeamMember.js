import pool from '../config/database.js';

class TeamMember {
  static async create({ managerId, name }) {
    // Get the next display order
    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(display_order), -1) + 1 as next_order FROM team_members WHERE manager_id = $1',
      [managerId]
    );
    const displayOrder = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO team_members (manager_id, name, display_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [managerId, name, displayOrder]
    );

    return result.rows[0];
  }

  static async findAllByManager(managerId, includeArchived = false) {
    const query = includeArchived
      ? 'SELECT * FROM team_members WHERE manager_id = $1 ORDER BY display_order'
      : 'SELECT * FROM team_members WHERE manager_id = $1 AND is_archived = FALSE ORDER BY display_order';

    const result = await pool.query(query, [managerId]);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM team_members WHERE id = $1',
      [id]
    );

    return result.rows[0];
  }

  static async update(id, { name, displayOrder, isArchived }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (displayOrder !== undefined) {
      updates.push(`display_order = $${paramCount}`);
      values.push(displayOrder);
      paramCount++;
    }

    if (isArchived !== undefined) {
      updates.push(`is_archived = $${paramCount}`);
      values.push(isArchived);
      paramCount++;
    }

    if (updates.length === 0) {
      return null;
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE team_members
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async reorder(managerId, orderMap) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const [id, order] of Object.entries(orderMap)) {
        await client.query(
          `UPDATE team_members
           SET display_order = $1
           WHERE id = $2 AND manager_id = $3`,
          [order, id, managerId]
        );
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    // Soft delete by archiving
    const result = await pool.query(
      `UPDATE team_members
       SET is_archived = TRUE
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }

  static async verifyOwnership(id, managerId) {
    const result = await pool.query(
      'SELECT id FROM team_members WHERE id = $1 AND manager_id = $2',
      [id, managerId]
    );

    return result.rows.length > 0;
  }
}

export default TeamMember;
