import express from 'express';
import TeamMember from '../models/TeamMember.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all team members for current manager
router.get('/', async (req, res) => {
  try {
    const includeArchived = req.query.include_archived === 'true';
    const teamMembers = await TeamMember.findAllByManager(req.managerId, includeArchived);

    res.json(teamMembers);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to get team members' });
  }
});

// Create new team member
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const teamMember = await TeamMember.create({
      managerId: req.managerId,
      name: name.trim(),
    });

    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Update team member
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, display_order, is_archived } = req.body;

    // Verify ownership
    const isOwner = await TeamMember.verifyOwnership(id, req.managerId);
    if (!isOwner) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (display_order !== undefined) updates.displayOrder = parseInt(display_order);
    if (is_archived !== undefined) updates.isArchived = is_archived;

    const teamMember = await TeamMember.update(id, updates);

    res.json(teamMember);
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Reorder team members
router.patch('/reorder', async (req, res) => {
  try {
    const { order_map } = req.body;

    if (!order_map || typeof order_map !== 'object') {
      return res.status(400).json({ error: 'order_map is required and must be an object' });
    }

    await TeamMember.reorder(req.managerId, order_map);

    res.json({ message: 'Team members reordered successfully' });
  } catch (error) {
    console.error('Reorder team members error:', error);
    res.status(500).json({ error: 'Failed to reorder team members' });
  }
});

// Archive team member (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const isOwner = await TeamMember.verifyOwnership(id, req.managerId);
    if (!isOwner) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const teamMember = await TeamMember.delete(id);

    res.json(teamMember);
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;
