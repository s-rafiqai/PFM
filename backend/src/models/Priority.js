import pool from '../config/database.js';

class Priority {
  static async create({ teamMemberId, content }) {
    // Get the next display order for this team member
    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(display_order), -1) + 1 as next_order FROM priorities WHERE team_member_id = $1',
      [teamMemberId]
    );
    const displayOrder = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO priorities (team_member_id, content, display_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [teamMemberId, content, displayOrder]
    );

    return result.rows[0];
  }

  static async findAllByTeamMember(teamMemberId) {
    const result = await pool.query(
      `SELECT * FROM priorities
       WHERE team_member_id = $1
       ORDER BY status ASC, display_order ASC`,
      [teamMemberId]
    );

    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM priorities WHERE id = $1',
      [id]
    );

    return result.rows[0];
  }

  static async update(id, { content, displayOrder, status }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (content !== undefined) {
      updates.push(`content = $${paramCount}`);
      values.push(content);
      paramCount++;
    }

    if (displayOrder !== undefined) {
      updates.push(`display_order = $${paramCount}`);
      values.push(displayOrder);
      paramCount++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;

      // Set completed_at if status is completed
      if (status === 'completed') {
        updates.push(`completed_at = CURRENT_TIMESTAMP`);
      } else {
        updates.push(`completed_at = NULL`);
      }
    }

    if (updates.length === 0) {
      return null;
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE priorities
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async reorder(teamMemberId, orderMap) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const [id, order] of Object.entries(orderMap)) {
        await client.query(
          `UPDATE priorities
           SET display_order = $1
           WHERE id = $2 AND team_member_id = $3`,
          [order, id, teamMemberId]
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
    const result = await pool.query(
      'DELETE FROM priorities WHERE id = $1 RETURNING *',
      [id]
    );

    return result.rows[0];
  }

  static async verifyOwnership(id, managerId) {
    const result = await pool.query(
      `SELECT p.id
       FROM priorities p
       JOIN team_members tm ON p.team_member_id = tm.id
       WHERE p.id = $1 AND tm.manager_id = $2`,
      [id, managerId]
    );

    return result.rows.length > 0;
  }
}

export default Priority;
