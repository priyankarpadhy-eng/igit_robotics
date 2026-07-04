// FILE: backend/middleware/requireRole.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const requireRole = (requiredRole) => async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.firebaseUser.uid)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: 'Profile not found' });
    }

    const hierarchy = { viewer: 0, member: 1, admin: 2 };
    const userRoleLevel = hierarchy[data.role] || 0;
    const requiredRoleLevel = hierarchy[requiredRole] || 0;

    if (userRoleLevel >= requiredRoleLevel) {
      return next();
    }

    res.status(403).json({ error: 'Insufficient permissions' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = requireRole;
