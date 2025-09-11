import React, { useState } from 'react';
import { Settings, X, Sun, Moon, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from './ThemeProvider';

const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, themeColor, setTheme, setThemeColor } = useTheme();

  const colors = [
    { name: 'blue', value: '#8B5CF6', label: 'Blue' },
    { name: 'purple', value: '#A855F7', label: 'Purple' },
    { name: 'green', value: '#10B981', label: 'Green' },
    { name: 'orange', value: '#F97316', label: 'Orange' },
    { name: 'red', value: '#EF4444', label: 'Red' },
  ];

  return (
    <>
      {/* Settings Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full btn-hero z-40"
        size="icon"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-card border border-border shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Theme Settings</h3>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Theme Toggle */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-3 block">
                Appearance
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setTheme('light')}
                  variant={theme === 'light' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </Button>
                <Button
                  onClick={() => setTheme('dark')}
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </Button>
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                <Palette className="w-4 h-4 inline mr-2" />
                Accent Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setThemeColor(color.name as any)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      themeColor === color.name
                        ? 'border-white shadow-lg scale-110'
                        : 'border-transparent hover:border-white/50'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;