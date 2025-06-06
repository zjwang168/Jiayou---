import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <DrawerItem
        label={t('navigation.home')}
        onPress={() => props.navigation.navigate('Home')}
        style={styles.drawerItem}
      />

      <DrawerItem
        label={t('navigation.backgroundCheck')}
        onPress={() => props.navigation.navigate('BackgroundCheck')}
        style={styles.drawerItem}
      />

      <DrawerItem
        label={t('navigation.profile')}
        onPress={() => props.navigation.navigate('Profile')}
        style={styles.drawerItem}
      />

      <DrawerItem
        label={t('navigation.jobs')}
        onPress={() => props.navigation.navigate('Jobs')}
        style={styles.drawerItem}
      />

      <DrawerItem
        label={t('navigation.messages')}
        onPress={() => props.navigation.navigate('Messages')}
        style={styles.drawerItem}
      />

      <DrawerItem
        label={t('navigation.settings')}
        onPress={() => props.navigation.navigate('Settings')}
        style={styles.drawerItem}
      />

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={signOut}
      >
        <Text style={styles.signOutText}>{t('navigation.signOut')}</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#fff',
  },
  drawerItem: {
    marginVertical: 4,
  },
  signOutButton: {
    padding: 12,
    backgroundColor: '#FFC107',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  signOutText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
});

export default DrawerContent;
