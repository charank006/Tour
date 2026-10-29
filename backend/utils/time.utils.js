/**
 * Time calculation utilities with guaranteed zero-padding (HH:MM)
 */
exports.addMinutes = (time, mins) => {
  if (!time || typeof time !== 'string' || !time.includes(':')) {
    time = '09:00';
  }
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const addition = parseInt(mins, 10) || 0;

  const totalMins = (h * 60 + m + addition) % (24 * 60);
  const safeTotalMins = totalMins < 0 ? totalMins + 24 * 60 : totalMins;

  const newH = Math.floor(safeTotalMins / 60);
  const newM = safeTotalMins % 60;

  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

exports.formatTimeSlot = (timeString) => {
  if (!timeString) return '09:00 AM';
  const [hStr, mStr] = timeString.split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 becomes 12
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
};
