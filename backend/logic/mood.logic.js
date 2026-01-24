exports.apply = (mood) => {
  if (mood === 'burned_out') {
    return { priority: ['cafe', 'lake', 'walk'], paceOverride: 'relaxed' };
  }

  if (mood === 'adventure') {
    return { priority: ['trek', 'waterfall'], paceOverride: 'packed' };
  }

  if (mood === 'romance') {
    return { priority: ['viewpoint', 'sunset', 'cafe'], paceOverride: 'balanced' };
  }

  return { priority: [], paceOverride: null };
};
