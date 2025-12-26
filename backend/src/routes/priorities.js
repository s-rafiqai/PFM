import express from 'express';
import Priority from '../models/Priority.js';
import TeamMember from '../models/TeamMember.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all priorities for a team member
router.get('/team-members/:teamMemberId/priorities', async (req, res) => {
  try {
    const { teamMemberId } = req.params;

    // Verify ownership
    const isOwner = await TeamMember.verifyOwnership(teamMemberId, req.managerId);
    if (!isOwner) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const priorities = await Priority.findAllByTeamMember(teamMemberId);

    res.json(priorities);
  } catch (error) {
    console.error('Get priorities error:', error);
    res.status(500).json({ error: 'Failed to get priorities' });
  }
});

// Create new priority
router.post('/team-members/:teamMemberId/priorities', async (req, res) => {
  try {
    const { teamMemberId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Verify ownership
    const isOwner = await TeamMember.verifyOwnership(teamMemberId, req.managerId);
    if (!isOwner) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const priority = await Priority.create({
      teamMemberId,
      content: content.trim(),
    });

    res.status(201).json(priority);
  } catch (error) {
    console.error('Create priority error:', error);
    res.status(500).json({ error: 'Failed to create priority' });
  }
});

// Update priority
router.patch('/priorities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, display_order, status } = req.body;

    // Verify ownership
    const isOwner = await Priority.verifyOwnership(id, req.managerId);
    if (!isOwner) {
      return res.status(404).json({ error: 'Priority not found' });
    }

    const updates = {};
    if (content !== undefined) updates.content = content.trim();
    if (display_order !== undefined) updates.displayOrder = parseInt(display_order);
    if (status !== undefined) {
      if (!['active', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updates.status = status;
    }

    const priority = await Priority.update(id, updates);

    res.json(priority);
  } catch (error) {
    console.error('Update priority error:', error);
    res.status(500).json({ error: 'Failed to update priority' });
  }
});

// Reorder priorities
router.patch('/priorities/reorder', async (req, res) => {
  try {
    const { team_member_id, order_map } = req.body;

    if (!team_member_id || !order_map || typeof order_map !== 'object') {
      return res.status(400).json({ error: 'team_member_id and order_map are required' });
    }

    // Verify ownership
    const isOwner = await TeamMember.verifyOwnership(team_member_id, req.managerId);
    if (!isOwner) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    await Priority.reorder(team_member_id, order_map);

    res.json({ message: 'Priorities reordered successfully' });
  } catch (error) {
    console.error('Reorder priorities error:', error);
    res.status(500).json({ error: 'Failed to reorder priorities' });
  }
});

// Delete priority
router.delete('/priorities/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const isOwner = await Priority.verifyOwnership(id, req.managerId);
    if (!isOwner) {
      return res.status(404).json({ error: 'Priority not found' });
    }

    const priority = await Priority.delete(id);

    res.json(priority);
  } catch (error) {
    console.error('Delete priority error:', error);
    res.status(500).json({ error: 'Failed to delete priority' });
  }
});

export default router;
