function rrf(searchResults, k = 60) {
  const scores = {};

  for (const results of searchResults) {
    results.forEach((point, rank) => {
      if (!scores[point.id]) {
        scores[point.id] = {
          score: 0,
          point,
        };
      }

      scores[point.id].score += 1 / (k + rank + 1);
    });
  }

  return Object.values(scores)
    .sort((a, b) => b.score - a.score)
    .map(item => item.point);
}

export default  rrf;