import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isMapSidebarCollapsed: boolean;
  setIsMapSidebarCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMapSidebarCollapsed, setIsMapSidebarCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isMapSidebarCollapsed, setIsMapSidebarCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}
