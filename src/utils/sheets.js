const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyFFw5tVLqYq5fszAQi-Q_IlXMabvKFaUlbmTp0qdCxR4GB1_TGTltmZjoeKpqH1d9e/exec';
const SHEET_EVENT_PREFIX = 'hobbyQuestSheetEvent:';

const axios = {
  get(url) {
    return fetch(url, { method: 'GET', mode: 'no-cors' }).then((response) => {
      if (response.type === 'opaque') {
        return { data: 'opaque response', status: 0, response };
      }
      return response.text().then((text) => {
        let data = text;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text;
        }
        return { data, status: response.status, response };
      });
    });
  }
};

function isSheetConfigured() {
  return GAS_ENDPOINT && !GAS_ENDPOINT.includes('여기에_');
}

export function saveToSheet(table, payload) {
  if (!isSheetConfigured()) {
    console.warn(`[sheet save skipped] ${table}: GAS_ENDPOINT is not configured`);
    return Promise.resolve();
  }

  const data = encodeURIComponent(JSON.stringify(payload));

  return axios.get(`${GAS_ENDPOINT}?action=insert&table=${table}&data=${data}`)
    .then((res) => {
      console.log(`[sheet saved] ${table}`, res.data);
      return res;
    })
    .catch((err) => {
      console.warn(`[sheet save failed] ${table}`, err);
    });
}

function getCookieValue(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return '';
}

function setCookieValue(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

export function getUVfromCookie() {
  const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
  const existingHash = getCookieValue('user');

  if (!existingHash) {
    setCookieValue('user', hash, 180);
    return hash;
  }

  return existingHash;
}

function padValue(value) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function getTimeStamp() {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${padValue(year)}-${padValue(month)}-${padValue(day)} ${padValue(hours)}:${padValue(minutes)}:${padValue(seconds)}`;
}

function getDeviceType() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

function getUtmValue() {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get('utm') || '';
}

async function fetchClientIp() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (error) {
    console.warn('IP 조회 실패:', error);
    return 'unknown';
  }
}

export async function saveVisitor() {
  const key = 'visitor_log_saved';

  try {
    if (sessionStorage.getItem(key) === 'true') {
      return Promise.resolve();
    }
    sessionStorage.setItem(key, 'true');
  } catch {
    // sessionStorage를 사용할 수 없는 환경에서는 IP 조회 후 저장을 계속 시도합니다.
  }

  const ip = await fetchClientIp();

  return saveToSheet('visitors', {
    id: getUVfromCookie(),
    landingUrl: window.location.href,
    ip,
    referer: document.referrer || '',
    time_stamp: getTimeStamp(),
    utm: getUtmValue(),
    device: getDeviceType()
  });
}

function getStoredSheetEvent(key) {
  try {
    return sessionStorage.getItem(`${SHEET_EVENT_PREFIX}${key}`);
  } catch {
    return null;
  }
}

function markStoredSheetEvent(key) {
  try {
    sessionStorage.setItem(`${SHEET_EVENT_PREFIX}${key}`, '1');
  } catch {
    // sessionStorage를 사용할 수 없는 환경에서는 중복 방지만 건너뜁니다.
  }
}

function saveOnce(key, table, payload) {
  if (getStoredSheetEvent(key)) return Promise.resolve();
  markStoredSheetEvent(key);
  return saveToSheet(table, payload);
}

function formatAnswer(answer) {
  if (!answer) return '';
  return [answer.questionId, answer.selectedOptionId, answer.label].filter(Boolean).join(' | ');
}

function answersToSheetColumns(answers = []) {
  return Array.from({ length: 10 }).reduce((columns, _, index) => {
    columns[`q${index + 1}`] = formatAnswer(answers[index]);
    return columns;
  }, {});
}

export function saveSurveyResponse(userProfile = {}, answers = []) {
  const id = getUVfromCookie();
  const eventKey = `survey:${id}:${answers.map((answer) => `${answer.questionId}:${answer.selectedOptionId}`).join(',')}`;

  return saveOnce(eventKey, 'survey_responses', {
    id,
    name: userProfile.nickname || userProfile.name || '',
    age: userProfile.age || '',
    gender: userProfile.gender || '',
    location: userProfile.location || '',
    ...answersToSheetColumns(answers),
    time_stamp: getTimeStamp()
  });
}

export function saveTraits(traits = {}, subcharacter = '') {
  const id = getUVfromCookie();
  const eventKey = `traits:${id}:${subcharacter}:${Object.entries(traits).map(([key, value]) => `${key}:${value}`).join(',')}`;

  return saveOnce(eventKey, 'traits', {
    id,
    subcharacter: subcharacter || '',
    activity: traits.activity || 0,
    creativity: traits.creativity || 0,
    social: traits.social || 0,
    challenge: traits.challenge || 0,
    focus: traits.focus || 0,
    routine: traits.routine || 0,
    costSensitive: traits.costSensitive || 0,
    outdoor: traits.outdoor || 0,
    indoor: traits.indoor || 0,
    expression: traits.expression || 0,
    time_stamp: getTimeStamp()
  });
}

export function saveAddedQuest(quest = {}, hobby = {}) {
  const id = getUVfromCookie();
  const questId = quest.instanceId || quest.id || hobby.id || '';

  return saveOnce(`added_quest:${id}:${questId}`, 'added_quests', {
    id,
    quest_id: questId,
    hobby_name: quest.hobbyName || hobby.name || '',
    category: quest.category || hobby.category || '',
    subcategory: quest.subcategory || hobby.subcategory || '',
    quest_title: quest.title || `${hobby.name || ''} 시작하기`,
    status: 'active',
    progress: quest.progress || 0,
    time_stamp: getTimeStamp()
  });
}
