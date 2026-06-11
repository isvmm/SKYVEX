/**
 * Cookie-based Caching System for Storefront APIs
 */

// Sets a cookie with a JSON value and expiration in minutes
export const setCookie = (name, value, expiryMinutes) => {
  const date = new Date();
  date.setTime(date.getTime() + (expiryMinutes * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + ";" + expires + ";path=/;SameSite=Lax";
};

// Gets a cookie value parsed as JSON
export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch (e) {
        console.error('Error parsing cookie:', name, e);
        return null;
      }
    }
  }
  return null;
};

// Clears a cookie
export const eraseCookie = (name) => {
  document.cookie = name + '=; Max-Age=-99999999; path=/;';
};

// Hybrid caching to avoid 4KB limit
export const setCacheData = (name, value, expiryMinutes) => {
  try {
    const jsonStr = JSON.stringify(value);
    const encodedValue = encodeURIComponent(jsonStr);
    
    // Cookie limit is around 4KB. If larger than 3.5KB, use localStorage fallback
    if (encodedValue.length < 3500) {
      setCookie(name, value, expiryMinutes);
      // Cleanup fallback if it existed
      localStorage.removeItem(name + '_fallback');
      // Clean up fallback marker cookie if any
      eraseCookie(name + '_local_marker');
    } else {
      // Set marker cookie with expiry
      const date = new Date();
      date.setTime(date.getTime() + (expiryMinutes * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = name + "_local_marker=true;" + expires + ";path=/;SameSite=Lax";

      // Save to localStorage with expiry timestamp
      const cacheObj = {
        expiry: Date.now() + (expiryMinutes * 60 * 1000),
        data: value
      };
      localStorage.setItem(name + '_fallback', JSON.stringify(cacheObj));
      // Cleanup direct cookie
      eraseCookie(name);
    }
  } catch (err) {
    console.error('Error in setCacheData:', err);
  }
};

export const getCacheData = (name) => {
  try {
    // Try reading direct cookie
    const cookieVal = getCookie(name);
    if (cookieVal) return cookieVal;

    // Fall back to localStorage if marker cookie is present
    const hasMarker = document.cookie.split(';').some(item => item.trim().startsWith(name + '_local_marker='));
    if (hasMarker) {
      const fallbackStr = localStorage.getItem(name + '_fallback');
      if (fallbackStr) {
        const parsed = JSON.parse(fallbackStr);
        if (parsed && parsed.expiry > Date.now()) {
          return parsed.data;
        } else {
          localStorage.removeItem(name + '_fallback');
        }
      }
    }
  } catch (err) {
    console.error('Error in getCacheData:', err);
  }
  return null;
};

