import AdminOverlay from '@/components/admin/adminEnablePanel';
import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      setOverlayVisible(true);
    }
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
  };

  const eventListener = (event: KeyboardEvent) => {
    handleKeyPress(event as unknown as React.KeyboardEvent);
  };

  useEffect(() => {
    window.addEventListener('keydown', eventListener);

    return () => {
      window.removeEventListener('keydown', eventListener);
    };
  });

  return (
    <div>
      {children}
      {isOverlayVisible && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="flex flex-col w-1/2 p-4 bg-white rounded-lg h-3/4">
            <AdminOverlay onClose={closeOverlay} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
