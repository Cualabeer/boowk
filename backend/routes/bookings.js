const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const generateQRCode = require('../utils/qrGenerator');

router.post('/', async (req, res) => {
  const { user_id, service_id, vehicle } = req.body;

  const maxPos = await pool.query(
    'SELECT MAX(queue_position) as max FROM bookings WHERE service_id=$1 AND status=$2',
    [service_id, 'queued']
  );
  const queue_position = (maxPos.rows[0].max || 0) + 1;
  const ticket_code = uuidv4();
  const qr = await generateQRCode(`https://your-frontend.com/verify/${ticket_code}`);

  const booking = await pool.query(
    `INSERT INTO bookings (user_id, service_id, vehicle, queue_position, ticket_code, status)
     VALUES ($1,$2,$3,$4,$5,'queued') RETURNING *`,
    [user_id, service_id, vehicle, queue_position, ticket_code]
  );

  const io = req.app.get('io');
  io.emit('statusUpdate', booking.rows[0]);

  res.json({ ...booking.rows[0], qr });
});

module.exports = router;