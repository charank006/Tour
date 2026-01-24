exports.addMinutes = (time, mins) => {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + mins);
  return `${date.getHours()}:${date.getMinutes()}`;
};
