import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Profile: undefined;
};

export type MainDrawerParamList = {
  Home: undefined;
  BackgroundCheck: undefined;
  Profile: undefined;
  Jobs: undefined;
  Messages: undefined;
  Settings: undefined;
};

export type MainStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainDrawerNavigationProp = DrawerNavigationProp<MainDrawerParamList>;
