
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface DisplayModeCardProps {
  displayMode: string;
  onDisplayModeChange: (mode: string) => void;
}

const DisplayModeCard: React.FC<DisplayModeCardProps> = ({ displayMode, onDisplayModeChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {displayMode === 'private' ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          Display Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant={displayMode === 'public' ? 'default' : 'outline'}
            onClick={() => onDisplayModeChange('public')}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Public
          </Button>
          <Button
            variant={displayMode === 'private' ? 'default' : 'outline'}
            onClick={() => onDisplayModeChange('private')}
            className="flex-1"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Private
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          {displayMode === 'public' 
            ? 'Dashboard data will be visible to all team members'
            : 'Dashboard data will be restricted to authorized users only'
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default DisplayModeCard;
