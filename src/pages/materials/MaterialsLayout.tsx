import { View, Tabs, Heading } from '@aws-amplify/ui-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export const MaterialsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getCurrentTab = () => {
    if (location.pathname.includes('/materials/common')) return '0';
    if (location.pathname.includes('/materials/quxe')) return '1';
    if (location.pathname.includes('/materials/hodemei')) return '2';
    if (location.pathname.includes('/materials/alsarejia')) return '3';
    return '0';
  };

  return (
    <View padding="medium">
      <Heading level={1} marginBottom="large">設定資料</Heading>
      
      <Tabs
        currentIndex={getCurrentTab()}
        onChange={(index) => {
          switch(index) {
            case 0: navigate('/materials/common'); break;
            case 1: navigate('/materials/quxe'); break;
            case 2: navigate('/materials/hodemei'); break;
            case 3: navigate('/materials/alsarejia'); break;
          }
        }}
      >
        <Tabs title="共通設定">
          {getCurrentTab() === '0' && <Outlet />}
        </Tabs>
        <Tabs title="Quxe">
          {getCurrentTab() === '1' && <Outlet />}
        </Tabs>
        <Tabs title="Hodemei">
          {getCurrentTab() === '2' && <Outlet />}
        </Tabs>
        <Tabs title="Alsarejia">
          {getCurrentTab() === '3' && <Outlet />}
        </Tabs>
      </Tabs>
    </View>
  );
};