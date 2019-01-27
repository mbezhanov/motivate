import {LOADING_START, LOADING_FINISH, CLEAR_TOAST } from './actionTypes';

export const loadingStart = () => {
  return { type: LOADING_START }
};

export const loadingFinish = (message = null) => {
  return {
    type: LOADING_FINISH,
    message,
  }
};

export const clearToast = () => {
  return {
    type: CLEAR_TOAST
  }
};
