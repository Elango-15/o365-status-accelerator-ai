import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Image, Wifi, WifiOff, Building2 } from 'lucide-react';
import SettingsModal from '../SettingsModal';

interface DashboardHeaderProps {
  companyLogo: string | null;
  o365Settings: any;
  onLogoUpload: (logo: string) => void;
  onImport: () => void;
  onExport: () => void;
  onSettingsChange: (settings: any) => void;
}

const DashboardHeader = ({ 
  companyLogo, 
  o365Settings, 
  onLogoUpload, 
  onImport, 
  onExport, 
  onSettingsChange 
}: DashboardHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoUpload(reader.result as string); // base64 image string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-8 space-y-6">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Company Logo Upload */}
          <div className="flex-shrink-0">
            <div 
              className="w-20 h-20 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center shadow-sm hover:border-gray-400 transition-all duration-200 cursor-pointer group hover:shadow-md"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload company logo"
            >
              {companyLogo ? (
                <div className="relative w-full h-full">
                  <img 
                    src={companyLogo} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Image className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-2">
                  <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500 font-medium">Upload Logo</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">O365 Accelerator</h1>
              {o365Settings?.isConnected ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors">
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-300">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </div>
            <p className="text-lg text-gray-600">Enterprise Productivity Dashboard</p>
            {o365Settings?.tenantId && (
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Tenant: {o365Settings.tenantId.substring(0, 8)}...</span>
                {o365Settings?.clientId && (
                  <span>Client: {o365Settings.clientId.substring(0, 8)}...</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white shadow-sm hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-all duration-200" 
            onClick={onImport}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white shadow-sm hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-all duration-200" 
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Dashboard
          </Button>
          <SettingsModal onSettingsChange={onSettingsChange} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
