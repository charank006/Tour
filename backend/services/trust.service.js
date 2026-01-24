exports.calculateTrust = (reviews) => {
  if (!reviews || reviews.length === 0) return "⚠️ No data";
  if (reviews.length > 50) return "⭐⭐⭐⭐⭐";
  if (reviews.length > 20) return "⭐⭐⭐⭐";
  return "⭐⭐⭐";
};
