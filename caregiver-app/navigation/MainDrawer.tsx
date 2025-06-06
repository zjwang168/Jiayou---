import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './DrawerContent';
import { useTranslation } from 'react-i18next';
import { MainDrawerParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import BackgroundCheckScreen from '../screens/BackgroundCheckScreen';
import ProfileScreen from '../screens/ProfileScreen';
import JobsScreen from '../screens/JobsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const MainDrawer = () => {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('navigation.home'),
        }}
      />
      <Drawer.Screen
        name="BackgroundCheck"
        component={BackgroundCheckScreen}
        options={{
          title: t('navigation.backgroundCheck'),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('navigation.profile'),
        }}
      />
      <Drawer.Screen
        name="Jobs"
        component={JobsScreen}
        options={{
          title: t('navigation.jobs'),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          title: t('navigation.messages'),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('navigation.settings'),
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawer;
