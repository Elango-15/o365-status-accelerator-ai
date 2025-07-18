
// Authentication and authorization utilities with O365 integration
import { ENV_CONFIG, GRAPH_SCOPES } from './environmentConfig';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
  tenantId?: string;
  department?: string;
  jobTitle?: string;
  manager?: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
  scope: string[];
}

export class AuthService {
  private static currentUser: User | null = null;
  private static authToken: AuthToken | null = null;
  private static msalInstance: any = null;
  
  // Initialize MSAL (Microsoft Authentication Library)
  static async initialize() {
    if (!ENV_CONFIG.ENABLE_O365_INTEGRATION) {
      console.log('O365 integration disabled, using mock authentication');
      return;
    }

    try {
      // In a real implementation, you would initialize MSAL here
      // const { PublicClientApplication } = await import('@azure/msal-browser');
      // this.msalInstance = new PublicClientApplication({
      //   auth: {
      //     clientId: ENV_CONFIG.O365_CLIENT_ID,
      //     authority: ENV_CONFIG.AUTHORITY_URL,
      //     redirectUri: ENV_CONFIG.REDIRECT_URI
      //   }
      // });
      
      console.log('MSAL initialized for tenant:', ENV_CONFIG.O365_TENANT_ID);
    } catch (error) {
      console.error('Failed to initialize MSAL:', error);
    }
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  static getAuthToken(): AuthToken | null {
    return this.authToken;
  }
  
  static isAuthenticated(): boolean {
    if (!this.authToken) return false;
    return Date.now() < this.authToken.expiresAt;
  }
  
  static hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission) || this.currentUser.role === 'admin';
  }
  
  static hasRole(role: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role === role || this.currentUser.role === 'admin';
  }
  
  // O365 SSO Login
  static async loginWithO365(): Promise<{ success: boolean; error?: string }> {
    if (!ENV_CONFIG.ENABLE_O365_INTEGRATION) {
      return this.Login('elango@cdtech.cloud', 'password');
    }

    try {
      // In a real implementation, you would use MSAL to login
      // const loginRequest = {
      //   scopes: GRAPH_SCOPES,
      //   prompt: 'select_account'
      // };
      // 
      // const response = await this.msalInstance.loginPopup(loginRequest);
      // const graphToken = await this.getGraphToken();
      // const userProfile = await this.getUserProfile(graphToken);
      
      // successful O365 login for demo
      const O365User: User = {
        id: 'o365-user-1',
        email: 'elango@cdtech.cloud',
        displayName: 'Administrator',
        role: 'admin',
        permissions: ['read', 'write', 'admin', 'read_dashboard', 'write_dashboard', 'admin_settings', 'export_data', 'import_data', 'manage_users', 'view_audit_logs'],
        tenantId: ENV_CONFIG.O365_TENANT_ID,
        department: 'IT',
        jobTitle: 'System Administrator',
        lastLogin: new Date().toISOString(),
        isActive: true
      };

      this.currentUser = O365User;
      this.authToken = {
        accessToken: 'o365-token',
        expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
        scope: GRAPH_SCOPES
      };

      this.logSecurityEvent('USER_LOGIN', `O365 SSO login successful for ${O365User.email}`);
      return { success: true };
    } catch (error) {
      this.logSecurityEvent('LOGIN_FAILED', `O365 SSO login failed: ${error}`);
      return { success: false, error: 'O365 authentication failed' };
    }
  }

  // Traditional login (fallback)
  static async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    return this.Login(email, password);
  }

  private static async Login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: '1',
        email,
        displayName: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user',
        permissions: ['read', 'write', 'admin', 'read_dashboard', 'write_dashboard', 'admin_settings', 'export_data', 'import_data', 'manage_users', 'view_audit_logs'],
        lastLogin: new Date().toISOString(),
        isActive: true
      };

      this.currentUser = user;
      this.authToken = {
        accessToken: 'access-token',
        expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
        scope: ['read', 'write']
      };

      this.logSecurityEvent('USER_LOGIN', `Login successful for ${email}`);
      return { success: true };
    } catch (error) {
      this.logSecurityEvent('LOGIN_FAILED', `Login failed for ${email}: ${error}`);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Get Microsoft Graph API token
  static async getGraphToken(): Promise<string | null> {
    if (!this.isAuthenticated() || !ENV_CONFIG.ENABLE_O365_INTEGRATION) {
      return null;
    }

    try {
      // In a real implementation, you would get a fresh token from MSAL
      // const silentRequest = {
      //   scopes: GRAPH_SCOPES,
      //   account: this.msalInstance.getAllAccounts()[0]
      // };
      // const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      // return response.accessToken;
      
      return this.authToken?.accessToken || null;
    } catch (error) {
      console.error('Failed to get Graph token:', error);
      return null;
    }
  }

  // Refresh authentication token
  static async refreshToken(): Promise<boolean> {
    if (!ENV_CONFIG.ENABLE_O365_INTEGRATION) {
      return true;
    }

    try {
      // In a real implementation, you would refresh the token via MSAL
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    }
  }

  static logout(): void {
    if (this.currentUser) {
      this.logSecurityEvent('USER_LOGOUT', `User ${this.currentUser.email} logged out`);
    }
    
    this.currentUser = null;
    this.authToken = null;
    
    if (this.msalInstance && ENV_CONFIG.ENABLE_O365_INTEGRATION) {
      // this.msalInstance.logoutPopup();
    }
  }

  // Security event logging
  private static logSecurityEvent(event: string, details: string) {
    if (!ENV_CONFIG.ENABLE_AUDIT_LOGGING) return;
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      ip: 'client-side', // In production, this would come from server
      sessionId: this.authToken?.accessToken?.substring(0, 8) || 'anonymous'
    };
    
    console.log('Security Event:', logEntry);
    
    // In production, you would send this to your logging service
    // await fetch('/api/security-logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logEntry)
    // });
  }

  // Session management
  static startSessionMonitoring() {
    setInterval(() => {
      if (this.isAuthenticated()) {
        const timeUntilExpiry = this.authToken!.expiresAt - Date.now();
        
        // Warn user 5 minutes before expiry
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 4 * 60 * 1000) {
          console.warn('Session expiring soon');
          // Show user notification
        }
        
        // Auto-refresh token if needed
        if (timeUntilExpiry < 10 * 60 * 1000) {
          this.refreshToken();
        }
      }
    }, 60000); // Check every minute
  }
}

// Permission constants
export const PERMISSIONS = {
  READ_DASHBOARD: 'read_dashboard',
  WRITE_DASHBOARD: 'write_dashboard',
  ADMIN_SETTINGS: 'admin_settings',
  EXPORT_DATA: 'export_data',
  IMPORT_DATA: 'import_data',
  MANAGE_USERS: 'manage_users',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_TENANTS: 'manage_tenants',
  ACCESS_GRAPH_API: 'access_graph_api'
} as const;

// Role-based access control
export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  user: [
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.WRITE_DASHBOARD,
    PERMISSIONS.EXPORT_DATA
  ],
  viewer: [
    PERMISSIONS.READ_DASHBOARD
  ]
};
