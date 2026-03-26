import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Ship, Anchor, Package, Layout, Map, Fuel, Bell, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
      <Command.Input placeholder="Search ships, ports, cargo or commands..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        
        <Command.Group heading="Quick Navigation">
          <Command.Item onSelect={() => runCommand(() => navigate('/'))}>
            <Layout className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/tracking'))}>
            <Map className="mr-2 h-4 w-4" />
            <span>Live Tracking</span>
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/ports'))}>
            <Anchor className="mr-2 h-4 w-4" />
            <span>Port Analytics</span>
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/cargo'))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Cargo Management</span>
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/fuel'))}>
            <Fuel className="mr-2 h-4 w-4" />
            <span>Fuel & Sustainability</span>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Vessels">
          <Command.Item onSelect={() => runCommand(() => navigate('/tracking?vessel=V-101'))}>
            <Ship className="mr-2 h-4 w-4" />
            <span>Oceanic Voyager</span>
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/tracking?vessel=V-102'))}>
            <Ship className="mr-2 h-4 w-4" />
            <span>Pacific Star</span>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Settings">
          <Command.Item onSelect={() => runCommand(() => navigate('/notifications'))}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => {
            localStorage.removeItem('token');
            navigate('/login');
          })}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
