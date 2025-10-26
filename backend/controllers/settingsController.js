import Settings from '../models/Settings.js';

// Get all settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.json({
      success: true,
      message: 'Settings retrieved successfully',
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve settings',
      errors: ['Internal server error']
    });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const updateData = req.body;
    const settings = await Settings.updateSettings(updateData);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      errors: ['Internal server error']
    });
  }
};

// Reset settings to default
export const resetSettings = async (req, res) => {
  try {
    const settings = await Settings.resetSettings();

    res.json({
      success: true,
      message: 'Settings reset to default successfully',
      data: settings
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings',
      errors: ['Internal server error']
    });
  }
};

// Get specific section
export const getSection = async (req, res) => {
  try {
    const { section } = req.params;
    const settings = await Settings.getSettings();

    let sectionData = {};
    
    switch (section) {
      case 'basic':
        sectionData = {
          siteName: settings.siteName,
          siteDescription: settings.siteDescription,
          siteIcon: settings.siteIcon,
          siteLogo: settings.siteLogo,
          siteFavicon: settings.siteFavicon
        };
        break;
      case 'contact':
        sectionData = {
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          contactAddress: settings.contactAddress
        };
        break;
      case 'social':
        sectionData = {
          socialMedia: settings.socialMedia
        };
        break;
      case 'sections':
        sectionData = {
          sectionNames: settings.sectionNames,
          sectionTitles: settings.sectionTitles,
          sectionDescriptions: settings.sectionDescriptions
        };
        break;
      case 'hero':
        sectionData = {
          heroTitle: settings.heroTitle,
          heroSubtitle: settings.heroSubtitle,
          heroBackgroundImage: settings.heroBackgroundImage
        };
        break;
      case 'about':
        sectionData = {
          aboutTitle: settings.aboutTitle,
          aboutDescription: settings.aboutDescription,
          aboutImage: settings.aboutImage
        };
        break;
      case 'privacy':
        sectionData = {
          privacyTitle: settings.privacyTitle,
          privacyDescription: settings.privacyDescription,
          privacyContent: settings.privacyContent
        };
        break;
      case 'terms':
        sectionData = {
          termsTitle: settings.termsTitle,
          termsDescription: settings.termsDescription,
          termsContent: settings.termsContent
        };
        break;
      case 'technical':
        sectionData = {
          maintenanceMode: settings.maintenanceMode,
          maintenanceMessage: settings.maintenanceMessage
        };
        break;
      case 'seo':
        sectionData = {
          seoTitle: settings.seoTitle,
          seoDescription: settings.seoDescription,
          seoKeywords: settings.seoKeywords,
          googleAnalyticsId: settings.googleAnalyticsId,
          googleTagManagerId: settings.googleTagManagerId,
          facebookPixelId: settings.facebookPixelId
        };
        break;
      case 'content':
        sectionData = {
          itemsPerPage: settings.itemsPerPage,
          featuredContentLimit: settings.featuredContentLimit,
          newContentDays: settings.newContentDays,
          maxFileSize: settings.maxFileSize,
          allowedVideoFormats: settings.allowedVideoFormats,
          allowedImageFormats: settings.allowedImageFormats
        };
        break;
      case 'security':
        sectionData = {
          maxLoginAttempts: settings.maxLoginAttempts,
          lockoutDuration: settings.lockoutDuration
        };
        break;
      case 'notifications':
        sectionData = {
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications
        };
        break;
      case 'theme':
        sectionData = {
          theme: settings.theme
        };
        break;
      case 'language':
        sectionData = {
          defaultLanguage: settings.defaultLanguage,
          supportedLanguages: settings.supportedLanguages
        };
        break;
      case 'cache':
        sectionData = {
          cacheEnabled: settings.cacheEnabled,
          cacheDuration: settings.cacheDuration
        };
        break;
      case 'api':
        sectionData = {
          apiRateLimit: settings.apiRateLimit,
          apiRateLimitWindow: settings.apiRateLimitWindow
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid section name',
          errors: ['Invalid section name']
        });
    }

    res.json({
      success: true,
      message: 'Section retrieved successfully',
      data: sectionData
    });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve section',
      errors: ['Internal server error']
    });
  }
};

// Update specific section
export const updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const sectionData = req.body;

    const settings = await Settings.getSettings();
    await settings.updateSectionSettings(section, sectionData);

    res.json({
      success: true,
      message: 'Section updated successfully',
      data: sectionData
    });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update section',
      errors: ['Internal server error']
    });
  }
};
