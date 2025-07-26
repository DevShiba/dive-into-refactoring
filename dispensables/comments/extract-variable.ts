// The Problem
// Comments are usually created with good intentions when code isn't intuitive or obvious.
// Comments are like deodorant masking the smell of fishy code that could be improved.
// The best comment is a good name for a method or class.

interface BrowserInfo {
  platform: string;
  browser: string;
  version: string;
  userAgent: string;
}

interface DisplaySettings {
  width: number;
  height: number;
  resize: number;
  isFullscreen: boolean;
}

interface UserPreferences {
  theme: string;
  language: string;
  accessibility: boolean;
  cookiesEnabled: boolean;
}

class WebRenderer {
  private browserInfo: BrowserInfo;
  private displaySettings: DisplaySettings;
  private userPreferences: UserPreferences;
  private initialized: boolean;

  constructor(browserInfo: BrowserInfo, displaySettings: DisplaySettings, userPreferences: UserPreferences) {
    this.browserInfo = browserInfo;
    this.displaySettings = displaySettings;
    this.userPreferences = userPreferences;
    this.initialized = false;
  }

  initialize(): void {
    this.initialized = true;
  }

  wasInitialized(): boolean {
    return this.initialized;
  }

  // Problem: Complex expression that needs comments to understand
  renderBanner(): void {
    // Check if platform is Mac and browser is IE and system was initialized and window was resized
    if ((this.browserInfo.platform.toUpperCase().indexOf("MAC") > -1) &&
        (this.browserInfo.browser.toUpperCase().indexOf("IE") > -1) &&
        this.wasInitialized() && this.displaySettings.resize > 0) {
      console.log("Rendering banner for Mac IE with resize");
    }
  }

  // Problem: Another complex condition requiring explanation
  shouldShowAdvancedFeatures(): boolean {
    // Show advanced features if: modern browser (not IE), high resolution, 
    // user prefers dark theme, has accessibility enabled, and cookies are enabled
    if (this.browserInfo.browser.toUpperCase().indexOf("IE") === -1 &&
        this.browserInfo.version.split('.')[0] >= "10" &&
        this.displaySettings.width >= 1920 && this.displaySettings.height >= 1080 &&
        this.userPreferences.theme === "dark" &&
        this.userPreferences.accessibility === true &&
        this.userPreferences.cookiesEnabled === true) {
      return true;
    }
    return false;
  }

  // Problem: Complex media query logic
  applyResponsiveLayout(): string {
    // Apply mobile layout for small screens, tablet for medium, desktop for large
    // Also consider if user prefers reduced motion and if fullscreen mode is active
    if (this.displaySettings.width <= 768 && 
        !this.displaySettings.isFullscreen &&
        this.userPreferences.accessibility === false) {
      return "mobile";
    } else if (this.displaySettings.width > 768 && this.displaySettings.width <= 1024 &&
               this.userPreferences.language !== "ar" && this.userPreferences.language !== "he") {
      return "tablet";
    } else if (this.displaySettings.width > 1024 && 
               this.browserInfo.userAgent.indexOf("Mobile") === -1 &&
               this.displaySettings.resize >= 0) {
      return "desktop";
    }
    return "default";
  }

  // Problem: Complex compatibility check
  isCompatible(): boolean {
    // Compatible if: not IE below version 11, not on mobile Safari below iOS 12,
    // screen resolution is adequate, and essential features are supported
    if (!(this.browserInfo.browser.toUpperCase().indexOf("IE") > -1 && 
          parseInt(this.browserInfo.version.split('.')[0]) < 11) &&
        !(this.browserInfo.userAgent.indexOf("iPhone") > -1 && 
          this.browserInfo.userAgent.indexOf("OS 1") > -1 &&
          parseInt(this.browserInfo.userAgent.split("OS ")[1].split("_")[0]) < 12) &&
        this.displaySettings.width >= 320 && this.displaySettings.height >= 240 &&
        this.userPreferences.cookiesEnabled === true) {
      return true;
    }
    return false;
  }

  // Problem: Complex security check
  canLoadExternalContent(): boolean {
    // Load external content if: HTTPS connection, modern browser, 
    // cookies enabled, not in private/incognito mode, and user consent given
    if (window.location.protocol === "https:" &&
        this.browserInfo.browser.toUpperCase().indexOf("IE") === -1 &&
        parseInt(this.browserInfo.version.split('.')[0]) >= 15 &&
        this.userPreferences.cookiesEnabled === true &&
        navigator.cookieEnabled === true &&
        !this.isIncognitoMode() &&
        localStorage.getItem("userConsent") === "granted") {
      return true;
    }
    return false;
  }

  private isIncognitoMode(): boolean {
    // Simple incognito detection
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return false;
    } catch {
      return true;
    }
  }
}

// The Solution
// Place the result of complex expressions in separate variables that are self-explanatory.

class RefactoredWebRenderer {
  private browserInfo: BrowserInfo;
  private displaySettings: DisplaySettings;
  private userPreferences: UserPreferences;
  private initialized: boolean;

  constructor(browserInfo: BrowserInfo, displaySettings: DisplaySettings, userPreferences: UserPreferences) {
    this.browserInfo = browserInfo;
    this.displaySettings = displaySettings;
    this.userPreferences = userPreferences;
    this.initialized = false;
  }

  initialize(): void {
    this.initialized = true;
  }

  wasInitialized(): boolean {
    return this.initialized;
  }

  renderBanner(): void {
    const isMacOS = this.browserInfo.platform.toUpperCase().indexOf("MAC") > -1;
    const isIE = this.browserInfo.browser.toUpperCase().indexOf("IE") > -1;
    const wasResized = this.displaySettings.resize > 0;

    if (isMacOS && isIE && this.wasInitialized() && wasResized) {
      console.log("Rendering banner for Mac IE with resize");
    }
  }

  shouldShowAdvancedFeatures(): boolean {
    const isModernBrowser = this.browserInfo.browser.toUpperCase().indexOf("IE") === -1;
    const hasMinimumVersion = this.browserInfo.version.split('.')[0] >= "10";
    const isHighResolution = this.displaySettings.width >= 1920 && this.displaySettings.height >= 1080;
    const prefersDarkTheme = this.userPreferences.theme === "dark";
    const hasAccessibilityEnabled = this.userPreferences.accessibility === true;
    const hasCookiesEnabled = this.userPreferences.cookiesEnabled === true;

    return isModernBrowser && hasMinimumVersion && isHighResolution && 
           prefersDarkTheme && hasAccessibilityEnabled && hasCookiesEnabled;
  }

  applyResponsiveLayout(): string {
    const isMobileWidth = this.displaySettings.width <= 768;
    const isNotFullscreen = !this.displaySettings.isFullscreen;
    const hasReducedAccessibility = this.userPreferences.accessibility === false;
    
    const isTabletWidth = this.displaySettings.width > 768 && this.displaySettings.width <= 1024;
    const isNotRTLLanguage = this.userPreferences.language !== "ar" && this.userPreferences.language !== "he";
    
    const isDesktopWidth = this.displaySettings.width > 1024;
    const isNotMobileDevice = this.browserInfo.userAgent.indexOf("Mobile") === -1;
    const hasValidResize = this.displaySettings.resize >= 0;

    if (isMobileWidth && isNotFullscreen && hasReducedAccessibility) {
      return "mobile";
    } else if (isTabletWidth && isNotRTLLanguage) {
      return "tablet";
    } else if (isDesktopWidth && isNotMobileDevice && hasValidResize) {
      return "desktop";
    }
    return "default";
  }

  isCompatible(): boolean {
    const isIEBrowser = this.browserInfo.browser.toUpperCase().indexOf("IE") > -1;
    const isOldIE = parseInt(this.browserInfo.version.split('.')[0]) < 11;
    const isNotUnsupportedIE = !(isIEBrowser && isOldIE);
    
    const isIPhone = this.browserInfo.userAgent.indexOf("iPhone") > -1;
    const hasOldIOSIndicator = this.browserInfo.userAgent.indexOf("OS 1") > -1;
    const isOldIOSVersion = hasOldIOSIndicator && 
      parseInt(this.browserInfo.userAgent.split("OS ")[1].split("_")[0]) < 12;
    const isNotUnsupportedSafari = !(isIPhone && isOldIOSVersion);
    
    const hasMinimumResolution = this.displaySettings.width >= 320 && this.displaySettings.height >= 240;
    const hasCookiesEnabled = this.userPreferences.cookiesEnabled === true;

    return isNotUnsupportedIE && isNotUnsupportedSafari && hasMinimumResolution && hasCookiesEnabled;
  }

  canLoadExternalContent(): boolean {
    const isSecureConnection = window.location.protocol === "https:";
    const isNotIE = this.browserInfo.browser.toUpperCase().indexOf("IE") === -1;
    const hasModernVersion = parseInt(this.browserInfo.version.split('.')[0]) >= 15;
    const userCookiesEnabled = this.userPreferences.cookiesEnabled === true;
    const browserCookiesEnabled = navigator.cookieEnabled === true;
    const isNotIncognito = !this.isIncognitoMode();
    const hasUserConsent = localStorage.getItem("userConsent") === "granted";

    return isSecureConnection && isNotIE && hasModernVersion && 
           userCookiesEnabled && browserCookiesEnabled && isNotIncognito && hasUserConsent;
  }

  private isIncognitoMode(): boolean {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return false;
    } catch {
      return true;
    }
  }
}

// Example usage of the problematic code:
const browserInfo: BrowserInfo = {
  platform: "Mac OS X",
  browser: "Internet Explorer",
  version: "11.0",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
};

const displaySettings: DisplaySettings = {
  width: 1920,
  height: 1080,
  resize: 5,
  isFullscreen: false
};

const userPreferences: UserPreferences = {
  theme: "dark",
  language: "en",
  accessibility: true,
  cookiesEnabled: true
};

const originalRenderer = new WebRenderer(browserInfo, displaySettings, userPreferences);
originalRenderer.initialize();

console.log("Original rendering banner...");
originalRenderer.renderBanner();
console.log("Original show advanced features:", originalRenderer.shouldShowAdvancedFeatures());
console.log("Original layout:", originalRenderer.applyResponsiveLayout());

const refactoredRenderer = new RefactoredWebRenderer(browserInfo, displaySettings, userPreferences);
refactoredRenderer.initialize();

console.log("Refactored rendering banner...");
refactoredRenderer.renderBanner();
console.log("Refactored show advanced features:", refactoredRenderer.shouldShowAdvancedFeatures());
console.log("Refactored layout:", refactoredRenderer.applyResponsiveLayout());