
import { z } from 'zod';

// Encryption utilities for sensitive data
export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'dashboard-secure-key';
  
  static encrypt(data: string): string {
    // Simple base64 encoding for demo - in production use proper encryption
    return btoa(JSON.stringify({ data, timestamp: Date.now() }));
  }
  
  static decrypt(encryptedData: string): string | null {
    try {
      const decoded = JSON.parse(atob(encryptedData));
      // Check if data is expired (24 hours)
      if (Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000) {
        return null;
      }
      return decoded.data;
    } catch {
      return null;
    }
  }
  
  static setSecureItem(key: string, value: string): void {
    const encrypted = this.encrypt(value);
    localStorage.setItem(key, encrypted);
  }
  
  static getSecureItem(key: string): string | null {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return this.decrypt(encrypted);
  }
  
  static removeSecureItem(key: string): void {
    localStorage.removeItem(key);
  }
}

// Input validation schemas - made more flexible
export const O365SettingsSchema = z.object({
  tenantId: z.string().optional(),
  clientId: z.string().optional(),
  adminPortalUrl: z.string().optional(),
  sharepointUrl: z.string().optional(),
  documentLibrary: z.string().optional(),
  teamsWebhook: z.string().optional(),
  isConnected: z.boolean().default(false),
  teamsNotifications: z.boolean().default(false),
  autoRefresh: z.boolean().default(false),
  darkMode: z.boolean().default(false),
  emailAlerts: z.boolean().default(false),
  displayMode: z.enum(['public', 'private']).default('public'),
  sharePointEnabled: z.boolean().default(false),
  teamsEnabled: z.boolean().default(false),
  lastUpdated: z.string().optional()
});

export const DashboardDataSchema = z.object({
  productivityData: z.array(z.object({
    name: z.string(),
    tasks: z.number(),
    completed: z.number()
  })),
  statusData: z.array(z.object({
    name: z.string(),
    value: z.number(),
    color: z.string()
  })),
  teamMetrics: z.array(z.object({
    metric: z.string(),
    value: z.string(),
    change: z.string(),
    trend: z.string()
  }))
});

// URL validation utility
export const validateUrl = (url: string): boolean => {
  if (!url) return true; // Allow empty URLs
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// File validation utility
export const validateFile = (file: File, allowedTypes: string[], maxSize: number = 5 * 1024 * 1024): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit` };
  }
  
  return { valid: true };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};
