const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const m = months[date.getUTCMonth()];
  const d = date.getUTCDate();
  const y = date.getUTCFullYear();
  return `${m} ${d}, ${y}`;
};

export const secondsToMinutes = (seconds) => {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  return `${minutes}:${
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
  }`;
};

export const ticksToK = (value) => {
  return value >= 1000 ? value / 1000 + 'k' : value;
};

export const sortCompletedChallenges = (challenges, sortBy) => {
  const challengeEntries = Object.entries(challenges);
  
  if (sortBy === 'completions') {
    return challengeEntries.sort((a, b) => b[1].completions - a[1].completions);
  } else if (sortBy === 'release-day') {
    return challengeEntries.sort((a, b) => b[1].completionsOnReleaseDay - a[1].completionsOnReleaseDay);
  }

  return challengeEntries;
};

export const sortCompletedLanguages = (languageData, sortBy) => {
  const dataEntries = Object.entries(languageData);
  
  if (sortBy === 'total') {
    return dataEntries.sort((a, b) => b[1].total - a[1].total);
  } else if (sortBy === 'javascript') {
    return dataEntries.sort((a, b) => b[1].javascript - a[1].javascript);
  } else if (sortBy === 'python') {
    return dataEntries.sort((a, b) => b[1].python - a[1].python);
  } else if (sortBy === 'both') {
    return dataEntries.sort((a, b) => b[1].both - a[1].both);
  }
  
  return dataEntries;
};

export const calculateCumulativeData = (data, minValue) => {
  const minNum = parseInt(minValue);
  let totalUsers = 0;
  
  Object.entries(data).forEach(([challenges, users]) => {
    if (parseInt(challenges) >= minNum) {
      totalUsers += users;
    }
  });
  
  return totalUsers;
};