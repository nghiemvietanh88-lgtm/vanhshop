import axios from 'axios';

const baseURL = 'https://recom.fpt.vn/api/v0.1/recommendation/api/result/getResult/';
const fptApiIns = axios.create({ baseURL });

const relatedItemId = import.meta.env.REACT_APP_FPT_RELATED_ITEM_ID || '';
const relatedItemKey = import.meta.env.REACT_APP_FPT_RELATED_ITEM_KEY || '';

const userBehaviorId = import.meta.env.REACT_APP_FPT_USER_BEHAVIOR_ID || '';
const userBehaviorKey = import.meta.env.REACT_APP_FPT_USER_BEHAVIOR_KEY || '';

export const getRelatedItems = (input) => {
  if (import.meta.env.DEV || !relatedItemKey) return Promise.resolve({ data: { result: [] } });
  const params = { input, key: relatedItemKey };
  return fptApiIns.get(relatedItemId, { params });
};

export const getUserBasedRecommendation = (input) => {
  if (import.meta.env.DEV || !userBehaviorKey) return Promise.resolve({ data: { result: [] } });
  if (!input) {
    input = localStorage.getItem('uid');
  }
  const params = { input, key: userBehaviorKey };
  return fptApiIns.get(userBehaviorId, { params });
};
