import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    }
    return 'http://localhost:3000';
  }
  return 'http://localhost:3000';
};

export const API_BASE_URL = getBaseUrl();
export const API_TIMEOUT = 15000;
