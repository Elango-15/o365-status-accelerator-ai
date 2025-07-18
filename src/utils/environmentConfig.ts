
// Environment configuration with fallbacks
export const ENV_CONFIG = {
  // O365 Configuration - actual tenant credentials
  O365_TENANT_ID: 'ad5cd7c6-bcb2-4a2d-9106-28df885282df',
  O365_CLIENT_ID: '096e13b5-7874-4827-ba5a-0006f1e1fd0d',
  O365_ADMIN_PORTAL_URL: import.meta.env.VITE_O365_ADMIN_PORTAL_URL || 'https://admin.microsoft.com',
  
  // Microsoft Graph API Configuration
  GRAPH_API_BASE_URL: import.meta.env.VITE_GRAPH_API_BASE_URL || 'https://graph.microsoft.com/v1.0',
  GRAPH_API_BETA_URL: import.meta.env.VITE_GRAPH_API_BETA_URL || 'https://graph.microsoft.com/beta',
  
  // Authentication Configuration
  AUTHORITY_URL: import.meta.env.VITE_AUTHORITY_URL || `https://login.microsoftonline.com/${import.meta.env.VITE_O365_TENANT_ID || 'ad5cd7c6-bcb2-4a2d-9106-28df885282df'}`,
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  // Feature Flags - enabled by default with your configuration
  ENABLE_O365_INTEGRATION: import.meta.env.VITE_ENABLE_O365_INTEGRATION !== 'false',
  ENABLE_REAL_TIME_SYNC: import.meta.env.VITE_ENABLE_REAL_TIME_SYNC !== 'false',
  ENABLE_SSO: import.meta.env.VITE_ENABLE_SSO !== 'false',
  ENABLE_FILE_UPLOADS: import.meta.env.VITE_ENABLE_FILE_UPLOADS !== 'false',
  ENABLE_AUDIT_LOGGING: import.meta.env.VITE_ENABLE_AUDIT_LOGGING === 'true',
  
  // Security Settings
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB default
  ALLOWED_FILE_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,text/csv').split(','),
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'), // 1 hour default
  
  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  ENABLE_DEBUG_LOGGING: import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true'
};

// Enhanced Microsoft Graph API Scopes for comprehensive O365 integration
export const GRAPH_SCOPES = [
  'User.Read',
  'User.ReadBasic.All',
  'User.Read.All',
  'Directory.Read.All',
  'Group.Read.All',
  'Sites.Read.All',
  'Files.Read.All',
  'Mail.Read',
  'Mail.ReadBasic.All',
  'Mail.ReadWrite',
  'Calendars.Read',
  'Calendars.ReadWrite',
  'Team.ReadBasic.All',
  'TeamSettings.Read.All',
  'Channel.ReadBasic.All',
  'ChannelSettings.Read.All',
  'ChatMessage.Read.All',
  'Directory.AccessAsUser.All',
  'RoleManagement.Read.Directory',
  'Organization.Read.All'
];

// Required Azure AD App Registration permissions
export const REQUIRED_PERMISSIONS = {
  APPLICATION: [
    'Directory.Read.All',
    'User.Read.All',
    'Group.Read.All',
    'Sites.Read.All',
    'TeamSettings.Read.All'
  ],
  DELEGATED: [
    'User.Read',
    'User.ReadBasic.All',
    'Directory.Read.All',
    'Files.Read.All',
    'Sites.Read.All',
    'Team.ReadBasic.All'
  ]
};

// Validate required environment variables
export const validateEnvironment = (): { valid: boolean; missing: string[]; warnings: string[] } => {
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Required for O365 integration
  if (ENV_CONFIG.ENABLE_O365_INTEGRATION) {
    if (!ENV_CONFIG.O365_TENANT_ID || ENV_CONFIG.O365_TENANT_ID === 'ad5cd7c6-bcb2-4a2d-9106-28df885282df') {
      missing.push('VITE_O365_TENANT_ID');
    }
    if (!ENV_CONFIG.O365_CLIENT_ID || ENV_CONFIG.O365_CLIENT_ID === '00000002-0000-0000-c000-000000000000') {
      missing.push('VITE_O365_CLIENT_ID');
    }
  }
  
  // Warnings for production readiness
  if (ENV_CONFIG.IS_DEVELOPMENT) {
    warnings.push('Running in development mode');
  }
  
  if (!ENV_CONFIG.ENABLE_AUDIT_LOGGING) {
    warnings.push('Audit logging is disabled');
  }
  
  return {
    valid: missing.length === 0,
    missing,
    warnings
  };
};

// Get environment setup instructions
export const getSetupInstructions = () => {
  return {
    azureSetup: [
      '1. Go to Azure Portal (portal.azure.com)',
      '2. Navigate to Azure Active Directory > App registrations',
      '3. Click "New registration"',
      '4. Enter application name and select account types',
      '5. Set redirect URI to your application URL',
      '6. Copy Application (client) ID and Directory (tenant) ID',
      '7. Go to "API permissions" and add required permissions',
      '8. Grant admin consent for the permissions'
    ],
    environmentVars: [
      'VITE_O365_TENANT_ID=your-tenant-id',
      'VITE_O365_CLIENT_ID=your-client-id',
      'VITE_ENABLE_O365_INTEGRATION=true',
      'VITE_ENABLE_REAL_TIME_SYNC=true',
      'VITE_ENABLE_SSO=true',
      'VITE_ENABLE_AUDIT_LOGGING=true'
    ],
    permissions: REQUIRED_PERMISSIONS
  };
};
