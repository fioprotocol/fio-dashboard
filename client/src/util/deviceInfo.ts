import { getUserTz } from './general';

export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  platform: string;
  timezone: string;
}

const MOBILE_BREAKPOINT = 768;

export const getDeviceInfo = (): DeviceInfo => {
  const ua = navigator.userAgent;
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  const isTablet =
    /iPad|Tablet/i.test(ua) ||
    (isMobile && window.innerWidth > MOBILE_BREAKPOINT);

  return {
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    platform: navigator.platform,
    timezone: getUserTz(),
  };
};
