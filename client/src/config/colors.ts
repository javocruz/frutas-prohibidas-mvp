interface ColorPalette {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  success: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  error: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  warning: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  info: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  grey: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  background: {
    default: string;
    paper: string;
  };
  divider: string;
}

export const colors: ColorPalette = {
  primary: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FFA000',
    contrast: '#000000',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrast: '#FFFFFF',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
    contrast: '#FFFFFF',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrast: '#000000',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrast: '#FFFFFF',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
}; 