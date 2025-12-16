import { calculateCumulativeData, formatDate, sortCompletedChallenges, sortCompletedLanguages, ticksToK } from './helpers.js';
import { dcData, lastUpdated } from './data.js';

const {
  numberOfChallenges,
  uniqueUsers,
  challengeCompletions,
  challengeCompletionsOnReleaseDay,
  challenges,
  weekdayCompletions,
  languageCompletionsTotal,
  languageCompletionsJavascript,
  languageCompletionsPython,
  languageCompletionsBoth,
  languageCompletions,
  challengeCompletionDistribution,
  challengeCompletionDistributionOnReleaseDay,
} = dcData;

// Top level info:
const lastUpdatedEl = document.getElementById('last-updated');
lastUpdatedEl.innerText = `(Last updated: ${formatDate(lastUpdated)})`;

const totalNumberOfChallengesEl = document.getElementById('total-number-of-challenges');
totalNumberOfChallengesEl.innerHTML = `Number of challenges available: <b>${numberOfChallenges.toLocaleString('en-US')}</b>`;

const totalNumberOfUsersEl = document.getElementById('total-number-of-users');
totalNumberOfUsersEl.innerHTML = `Number of users who have completed a challenge: <b>${uniqueUsers.toLocaleString('en-US')}</b>`;

// // Elements for toggling
const els = [
  {
    chevron: document.getElementById('chevron-1'),
    toggleEls: [document.getElementById('completions-per-challenge-canvas')],
  },
  {
    chevron: document.getElementById('chevron-2'),
    toggleEls: [document.getElementById('completions-by-weekday-canvas')],
  },
  {
    chevron: document.getElementById('chevron-3'),
    toggleEls: [document.getElementById('language-completions-canvas')],
  },
  {
    chevron: document.getElementById('chevron-4'),
    toggleEls: [document.getElementById('challenge-completion-distribution-canvas')],
  },
  {
    chevron: document.getElementById('chevron-5'),
    toggleEls: [document.getElementById('challenge-completion-distribution-on-release-day-canvas')],
  }
];

els.forEach((el) => {
  el.chevron.addEventListener('click', () => {
    if (el.chevron.style.transform === 'rotate(90deg)') {
      el.toggleEls.forEach((element) => {
        element.style.display = 'block';
      });

      el.chevron.style.transform = 'rotate(0deg)';
    } else {
      el.toggleEls.forEach((element) => {
        element.style.display = 'none';
      });
      el.chevron.style.transform = 'rotate(90deg)';
    }
  });
});

// shared chart config
const lineChartTension = { tension: 0.3 };

const hideLegend = {
  legend: {
    display: false,
  },
};

const tooltipStyles = {
  titleColor: '#000',
  backgroundColor: '#fff',
  borderColor: '#777',
  bodyColor: '#777',
  borderWidth: 1,
  boxPadding: 3,
  padding: 8,
  bodyFont: {
    size: 15,
  },
  titleFont: {
    size: 13,
  },
};

const lineChartStyles = {
  borderWidth: 2,
  pointRadius: 8,
  pointHoverRadius: 11,
};

const axisTitleStyle = {
  display: true,
  color: '#666',
  padding: 20,
  font: {
    size: 14,
  },
};

const yTicks = {
  ticks: {
    callback: ticksToK,
    font: {
      size: 18,
    },
    padding: 10,
  },
};

const yGrid = {
  grid: {
    drawTicks: false,
    lineWidth: 3,
  },
};

const yBorder = {
  border: {
    color: '#777',
    dash: [10, 5],
    width: 2,
  },
};

const yStyles = {
  ...yTicks,
  ...yGrid,
  ...yBorder,
};

const xTicks = {
  ticks: {
    maxRotation: 45,
    minRotation: 45,
    labelOffset: 5,
    padding: 10,
    font: {
      size: 14,
    },
  },
};

const xGrid = {
  grid: {
    drawTicks: false,
    lineWidth: 2,
  },
};

const xBorder = {
  border: {
    color: '#777',
    dash: [3, 6],
    width: 2,
  },
};

const xStyles = {
  ...xTicks,
  ...xGrid,
  ...xBorder,
};

// Challenge Completions Chart
document.getElementById('challenge-completions-total').innerHTML += `Total number of challenges completed: <b>${challengeCompletions.toLocaleString('en-US')}</b>`;
document.getElementById('challenge-completions-on-release-day').innerHTML = `Number of challenges completed on the day of release: <b>${challengeCompletionsOnReleaseDay.toLocaleString('en-US')}</b>`;

const challengeCompletionsSortEl = document.getElementById('challenge-completions-sort');
challengeCompletionsSortEl.value = 'date';
challengeCompletionsSortEl.addEventListener('change', (e) => {
  const sortedChallenges = sortCompletedChallenges(challenges, e.target.value);

  challengeCompletionsChart.data.labels = sortedChallenges.map(([date]) => formatDate(date));
  challengeCompletionsChart.data.datasets[0].data = sortedChallenges.map(([, v]) => v.completionsOnReleaseDay);
  challengeCompletionsChart.data.datasets[1].data = sortedChallenges.map(([, v]) => v.completions);
  challengeCompletionsChart.update();
});

const challengeCompletionsChart = new Chart(document.getElementById('completions-per-challenge-canvas'), {
  type: 'bar',
  data: {
    labels: Object.keys(challenges).map(formatDate),
    datasets: [
      {
        label: 'Completions on Release Day',
        data: Object.values(challenges).map((v) => v.completionsOnReleaseDay),
        backgroundColor: '#3C8DBC',
      },
      {
        label: 'Total Completions',
        data: Object.values(challenges).map((v) => v.completions),
        backgroundColor: '#7FB4E3',
      },
    ],
  },
  options: {
    scales: {
      y: {
        title: {
          text: 'Number of challenge completions',
          ...axisTitleStyle,
        },
        ...yStyles,
      },
      x: {
        stacked: true,
        ...xStyles,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        titleColor: '#000',
        backgroundColor: '#fff',
        borderColor: '#777',
        bodyColor: '#777',
        borderWidth: 1,
        boxPadding: 3,
        padding: 8,
        bodyFont: {
          size: 15,
        },
        titleFont: {
          size: 13,
        },
      },
    },
  },
});

// Challenge Completions by Weekday Chart
new Chart(document.getElementById('completions-by-weekday-canvas'), {
  type: 'bar',
  data: {
    labels: Object.keys(weekdayCompletions).map((d) => d.charAt(0).toUpperCase() + d.slice(1)),
    datasets: [
      {
        label: 'Completions on Release Day',
        data: Object.values(weekdayCompletions).map((v) => v.onReleaseDay),
        backgroundColor: '#D6693C',
      },
      {
        label: 'Total Completions',
        data: Object.values(weekdayCompletions).map((v) => v.total),
        backgroundColor: '#F7B77E',
      },
    ],
  },
  options: {
    scales: {
      y: {
        title: {
          text: 'Number of challenge completions',
          display: true,
          color: '#000',
          padding: 10,
          font: {
            size: 14,
          },
        },
        ...yStyles,
      },
      x: {
        stacked: true,
        ...xStyles,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        titleColor: '#000',
        backgroundColor: '#fff',
        borderColor: '#777',
        bodyColor: '#777',
        borderWidth: 1,
        boxPadding: 3,
        padding: 8,
        bodyFont: {
          size: 15,
        },
        titleFont: {
          size: 13,
        },
      },
    },
  },
});

// Language Completions Chart
document.getElementById('language-completions-total').innerHTML += `Total number of completions: <b>${languageCompletionsTotal.toLocaleString('en-US')}</b>`;
document.getElementById('language-completions-javascript').innerHTML = `Number of JavaScript completions: <b>${languageCompletionsJavascript.toLocaleString('en-US')}</b>`;
document.getElementById('language-completions-python').innerHTML = `Number of Python completions: <b>${languageCompletionsPython.toLocaleString('en-US')}</b>`;
document.getElementById('language-completions-both').innerHTML = `Number of challenges completed in both languages: <b>${languageCompletionsBoth.toLocaleString('en-US')}</b>`;

const languageCompletionsSortEl = document.getElementById('language-completions-sort');
languageCompletionsSortEl.value = 'date';
languageCompletionsSortEl.addEventListener('change', (e) => {
  const sortedLanguageData = sortCompletedLanguages(languageCompletions, e.target.value);

  languageCompletionsChart.data.labels = sortedLanguageData.map(([date]) => formatDate(date));
  languageCompletionsChart.data.datasets[0].data = sortedLanguageData.map(([, v]) => v.total);
  languageCompletionsChart.data.datasets[1].data = sortedLanguageData.map(([, v]) => v.javascript);
  languageCompletionsChart.data.datasets[2].data = sortedLanguageData.map(([, v]) => v.python);
  languageCompletionsChart.data.datasets[3].data = sortedLanguageData.map(([, v]) => v.both);
  languageCompletionsChart.update();
});

const languageCompletionsChart = new Chart(document.getElementById('language-completions-canvas'), {
  type: 'line',
  data: {
    labels: Object.keys(languageCompletions).map(formatDate),
    datasets: [
      {
        label: 'Total Completions',
        data: Object.values(languageCompletions).map((v) => v.total),
        borderColor: '#7D6DAB',
        backgroundColor: '#BAAED5',
        ...lineChartTension,
      },
      {
        label: 'JavaScript Completions',
        data: Object.values(languageCompletions).map((v) => v.javascript),
        borderColor: '#4DBDC4',
        backgroundColor: '#9CE0E1',
        ...lineChartTension,
      },
      {
        label: 'Python Completions',
        data: Object.values(languageCompletions).map((v) => v.python),
        borderColor: '#E83C8D',
        backgroundColor: '#F3A5D9',
        ...lineChartTension,
      },
      {
        label: 'Both Languages Completions',
        data: Object.values(languageCompletions).map((v) => v.both),
        borderColor: '#D6693C',
        backgroundColor: '#F7B77E',
        ...lineChartTension,
      },
    ],
  },
  options: {
    ...lineChartStyles,
    plugins: {
      ...hideLegend,
      tooltip: {
        mode: 'index',
        position: 'nearest',
        ...tooltipStyles,
      },
    },
    scales: {
      y: {
        title: {
          ...axisTitleStyle,
          text: 'Number of Completions',
        },
        ...yStyles,
      },
      x: { ...xStyles },
    },
  },
});

// Challenge Completions Distrubution Chart
new Chart(document.getElementById('challenge-completion-distribution-canvas'), {
  type: 'bar',
  data: {
    labels: Object.keys(challengeCompletionDistribution),
    datasets: [
      {
        label: 'Number of users',
        data: Object.values(challengeCompletionDistribution),
        backgroundColor: '#9AC7B0',
      },
    ],
  },
  options: {
    scales: {
      y: {
        type: 'logarithmic',
        min: 0,
        title: {
          ...axisTitleStyle,
          text: 'Number of users',
        },
        ticks: {
          callback: (value) => {
            return value === 0.1 || value === 1.0 || value === 10.0 || value === 100.0 || value === 1000.0 || value === 10000.0 ? value : '';
          },
        },
        ...yGrid,
        ...yBorder,
      },
      x: {
        ...xStyles,
        title: {
          ...axisTitleStyle,
          text: 'Number of challenges completed',
        },
      },
    },
    plugins: {
      ...hideLegend,
      tooltip: {
        ...tooltipStyles,
        callbacks: {
          title: (d) => {
            const users = d[0].formattedValue;
            const challenges = d[0].label;
            if (challenges == numberOfChallenges) {
              return `${users.toLocaleString('en-US')} ${users == 1 ? 'user has' : 'users have' } completed all ${challenges} challenges!`
            }
            return `${users} ${users == 1 ? 'user has' : 'users have'} completed ${challenges} ${challenges == 1 ? 'challenge' : 'challenges'}.`;
          },
          afterLabel: (context) => {
            const label = context.label;
            const totalUsers = calculateCumulativeData(challengeCompletionDistribution, label);
            if (label == numberOfChallenges) return '';
            return `${totalUsers.toLocaleString('en-US')} ${totalUsers == 1 ? 'user has' : 'users have'} completed ${label} or more ${label == 1 ? 'challenge' : 'challenges'}.`;
          },
        },
      },
    },
  },
});

// Challenge Completions Distributions On Release Day Chart
const challengeCompletionDistributionOnReleaseDayChart = new Chart(document.getElementById('challenge-completion-distribution-on-release-day-canvas'), {
  type: 'bar',
  data: {
    labels: Object.keys(challengeCompletionDistributionOnReleaseDay),
    datasets: [
      {
        label: 'Number of users',
        data: Object.values(challengeCompletionDistributionOnReleaseDay),
        backgroundColor: '#BAAED5',
      },
    ],
  },
  options: {
    scales: {
      y: {
        type: 'logarithmic',
        min: 0,
        title: {
          ...axisTitleStyle,
          text: 'Number of users',
        },
        ticks: {
          callback: (value) => {
            return value === 0.1 || value === 1.0 || value === 10.0 || value === 100.0 || value === 1000.0 || value === 10000.0 ? value : '';
          },
        },
        ...yGrid,
        ...yBorder,
      },
      x: {
        ...xStyles,
        title: {
          ...axisTitleStyle,
          text: 'Number of challenges completed',
        },
      },
    },
    plugins: {
      ...hideLegend,
      tooltip: {
        ...tooltipStyles,
        callbacks: {
          title: (d) => {
            const users = d[0].formattedValue;
            const challenges = d[0].label;
            return `${users} ${users == 1 ? 'user has' : 'users have'} completed ${challenges} ${challenges == 1 ? 'challenge' : 'challenges'} on release day.`;
          },
          afterLabel: (context) => {
            const label = context.label;
            const totalUsers = calculateCumulativeData(challengeCompletionDistributionOnReleaseDay, label);
            return `${totalUsers.toLocaleString('en-US')} ${totalUsers == 1 ? 'user has' : 'users have' } completed ${label} ${label == 1 ? 'challenge' : 'challenges' } or more on release day.`;
          },
        },
      },
    },
  },
});
