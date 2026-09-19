import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppTheme {
  id: string;
  name: string;
  nameUr: string;
  gradient: string;
  bg: string;
  surface: string;
  accent: string;
  text: string;
  border: string;
  glow: string;
  bubbleColors: string[];
}

export const THEMES: AppTheme[] = [
  { id: 'aurora', name: 'Aurora', nameUr: 'اورورا', gradient: 'linear-gradient(135deg,#e0f7fa,#b2ebf2,#e8f5e9)', bg: '#e0f7fa', surface: 'rgba(255,255,255,0.65)', accent: '#00bcd4', text: '#006064', border: 'rgba(0,188,212,0.3)', glow: '#00bcd4', bubbleColors: ['#00bcd4','#26c6da','#80deea','#4dd0e1','#00acc1'] },
  { id: 'rose', name: 'Rose Glass', nameUr: 'گلابی شیشہ', gradient: 'linear-gradient(135deg,#fce4ec,#f8bbd0,#fff9c4)', bg: '#fce4ec', surface: 'rgba(255,255,255,0.65)', accent: '#e91e63', text: '#880e4f', border: 'rgba(233,30,99,0.3)', glow: '#e91e63', bubbleColors: ['#f48fb1','#f06292','#ec407a','#e91e63','#ff80ab'] },
  { id: 'emerald', name: 'Emerald', nameUr: 'زمرد', gradient: 'linear-gradient(135deg,#e8f5e9,#c8e6c9,#f0f4c3)', bg: '#e8f5e9', surface: 'rgba(255,255,255,0.65)', accent: '#4caf50', text: '#1b5e20', border: 'rgba(76,175,80,0.3)', glow: '#4caf50', bubbleColors: ['#a5d6a7','#81c784','#66bb6a','#4caf50','#43a047'] },
  { id: 'sapphire', name: 'Sapphire', nameUr: 'نیلم', gradient: 'linear-gradient(135deg,#e3f2fd,#bbdefb,#e8eaf6)', bg: '#e3f2fd', surface: 'rgba(255,255,255,0.65)', accent: '#2196f3', text: '#0d47a1', border: 'rgba(33,150,243,0.3)', glow: '#2196f3', bubbleColors: ['#90caf9','#64b5f6','#42a5f5','#2196f3','#1e88e5'] },
  { id: 'golden', name: 'Golden', nameUr: 'سونا', gradient: 'linear-gradient(135deg,#fff8e1,#ffecb3,#fff9c4)', bg: '#fff8e1', surface: 'rgba(255,255,255,0.65)', accent: '#ff8f00', text: '#e65100', border: 'rgba(255,143,0,0.3)', glow: '#ff8f00', bubbleColors: ['#ffe082','#ffd54f','#ffca28','#ffc107','#ffb300'] },
  { id: 'violet', name: 'Violet', nameUr: 'بنفشہ', gradient: 'linear-gradient(135deg,#ede7f6,#d1c4e9,#fce4ec)', bg: '#ede7f6', surface: 'rgba(255,255,255,0.65)', accent: '#9c27b0', text: '#4a148c', border: 'rgba(156,39,176,0.3)', glow: '#9c27b0', bubbleColors: ['#ce93d8','#ba68c8','#ab47bc','#9c27b0','#8e24aa'] },
  { id: 'mint', name: 'Mint', nameUr: 'پودینہ', gradient: 'linear-gradient(135deg,#e0f2f1,#b2dfdb,#e8f5e9)', bg: '#e0f2f1', surface: 'rgba(255,255,255,0.65)', accent: '#009688', text: '#004d40', border: 'rgba(0,150,136,0.3)', glow: '#009688', bubbleColors: ['#80cbc4','#4db6ac','#26a69a','#009688','#00897b'] },
  { id: 'coral', name: 'Coral', nameUr: 'مونگا', gradient: 'linear-gradient(135deg,#fbe9e7,#ffccbc,#fff9c4)', bg: '#fbe9e7', surface: 'rgba(255,255,255,0.65)', accent: '#ff5722', text: '#bf360c', border: 'rgba(255,87,34,0.3)', glow: '#ff5722', bubbleColors: ['#ffab91','#ff8a65','#ff7043','#ff5722','#f4511e'] },
  { id: 'ocean', name: 'Ocean', nameUr: 'سمندر', gradient: 'linear-gradient(135deg,#e1f5fe,#b3e5fc,#e0f7fa)', bg: '#e1f5fe', surface: 'rgba(255,255,255,0.65)', accent: '#0288d1', text: '#01579b', border: 'rgba(2,136,209,0.3)', glow: '#0288d1', bubbleColors: ['#81d4fa','#4fc3f7','#29b6f6','#03a9f4','#039be5'] },
  { id: 'lavender', name: 'Lavender', nameUr: 'لیوینڈر', gradient: 'linear-gradient(135deg,#f3e5f5,#e1bee7,#fce4ec)', bg: '#f3e5f5', surface: 'rgba(255,255,255,0.65)', accent: '#7b1fa2', text: '#4a148c', border: 'rgba(123,31,162,0.3)', glow: '#7b1fa2', bubbleColors: ['#e1bee7','#ce93d8','#ba68c8','#ab47bc','#9c27b0'] },
  { id: 'peach', name: 'Peach', nameUr: 'آڑو', gradient: 'linear-gradient(135deg,#fff3e0,#ffe0b2,#fff8e1)', bg: '#fff3e0', surface: 'rgba(255,255,255,0.65)', accent: '#f57c00', text: '#e65100', border: 'rgba(245,124,0,0.3)', glow: '#f57c00', bubbleColors: ['#ffcc80','#ffb74d','#ffa726','#ff9800','#fb8c00'] },
  { id: 'sky', name: 'Sky Blue', nameUr: 'آسمانی', gradient: 'linear-gradient(135deg,#e1f5fe,#e3f2fd,#ede7f6)', bg: '#e1f5fe', surface: 'rgba(255,255,255,0.65)', accent: '#039be5', text: '#0277bd', border: 'rgba(3,155,229,0.3)', glow: '#039be5', bubbleColors: ['#b3e5fc','#81d4fa','#4fc3f7','#29b6f6','#03a9f4'] },
  { id: 'neon', name: 'Neon Bright', nameUr: 'نیون', gradient: 'linear-gradient(135deg,#f1f8e9,#e8f5e9,#e3f2fd)', bg: '#f1f8e9', surface: 'rgba(255,255,255,0.7)', accent: '#76ff03', text: '#1b5e20', border: 'rgba(118,255,3,0.4)', glow: '#76ff03', bubbleColors: ['#ccff90','#b2ff59','#76ff03','#69f0ae','#00e676'] },
  { id: 'rainbow', name: 'Rainbow', nameUr: 'قوس قزح', gradient: 'linear-gradient(135deg,#fce4ec,#e3f2fd,#e8f5e9,#fff8e1)', bg: '#fff', surface: 'rgba(255,255,255,0.6)', accent: '#e91e63', text: '#311b92', border: 'rgba(233,30,99,0.25)', glow: '#e91e63', bubbleColors: ['#f48fb1','#90caf9','#a5d6a7','#ffe082','#ce93d8'] },
  { id: 'crimson', name: 'Crimson', nameUr: 'سرخ', gradient: 'linear-gradient(135deg,#ffebee,#ffcdd2,#fff9c4)', bg: '#ffebee', surface: 'rgba(255,255,255,0.65)', accent: '#d32f2f', text: '#b71c1c', border: 'rgba(211,47,47,0.3)', glow: '#d32f2f', bubbleColors: ['#ef9a9a','#e57373','#ef5350','#f44336','#e53935'] },
  { id: 'forest', name: 'Forest', nameUr: 'جنگل', gradient: 'linear-gradient(135deg,#f1f8e9,#dcedc8,#c8e6c9)', bg: '#f1f8e9', surface: 'rgba(255,255,255,0.65)', accent: '#558b2f', text: '#33691e', border: 'rgba(85,139,47,0.3)', glow: '#558b2f', bubbleColors: ['#aed581','#9ccc65','#8bc34a','#7cb342','#689f38'] },
  { id: 'sunrise', name: 'Sunrise', nameUr: 'طلوع آفتاب', gradient: 'linear-gradient(135deg,#fff3e0,#ffe0b2,#fce4ec)', bg: '#fff3e0', surface: 'rgba(255,255,255,0.65)', accent: '#ff6f00', text: '#e65100', border: 'rgba(255,111,0,0.3)', glow: '#ff6f00', bubbleColors: ['#ffcc02','#ffb300','#ffa000','#ff8f00','#ff6f00'] },
  { id: 'crystal', name: 'Crystal', nameUr: 'کرسٹل', gradient: 'linear-gradient(135deg,#f5f5f5,#e3f2fd,#e0f7fa)', bg: '#f5f5f5', surface: 'rgba(255,255,255,0.75)', accent: '#607d8b', text: '#37474f', border: 'rgba(96,125,139,0.25)', glow: '#607d8b', bubbleColors: ['#b0bec5','#90a4ae','#78909c','#607d8b','#546e7a'] },
  { id: 'tropical', name: 'Tropical', nameUr: 'اشنکٹبندیی', gradient: 'linear-gradient(135deg,#e0f7fa,#f1f8e9,#fff8e1)', bg: '#e0f7fa', surface: 'rgba(255,255,255,0.65)', accent: '#00897b', text: '#004d40', border: 'rgba(0,137,123,0.3)', glow: '#00897b', bubbleColors: ['#80cbc4','#26a69a','#69f0ae','#00e676','#1de9b6'] },
  { id: 'berry', name: 'Berry', nameUr: 'بیری', gradient: 'linear-gradient(135deg,#f3e5f5,#ede7f6,#fce4ec)', bg: '#f3e5f5', surface: 'rgba(255,255,255,0.65)', accent: '#ad1457', text: '#880e4f', border: 'rgba(173,20,87,0.3)', glow: '#ad1457', bubbleColors: ['#f48fb1','#ce93d8','#ba68c8','#ab47bc','#e91e63'] },
  { id: 'citrus', name: 'Citrus', nameUr: 'لیموں', gradient: 'linear-gradient(135deg,#f9fbe7,#f0f4c3,#fff8e1)', bg: '#f9fbe7', surface: 'rgba(255,255,255,0.65)', accent: '#c6a700', text: '#f57f17', border: 'rgba(198,167,0,0.35)', glow: '#c6a700', bubbleColors: ['#fff176','#fff59d','#ffee58','#ffeb3b','#fdd835'] },
  { id: 'bubblegum', name: 'Bubblegum', nameUr: 'ببل گم', gradient: 'linear-gradient(135deg,#fce4ec,#f8bbd9,#e3f2fd)', bg: '#fce4ec', surface: 'rgba(255,255,255,0.65)', accent: '#f06292', text: '#880e4f', border: 'rgba(240,98,146,0.3)', glow: '#f06292', bubbleColors: ['#f48fb1','#f06292','#ec407a','#ff80ab','#ff4081'] },
  { id: 'glacier', name: 'Glacier', nameUr: 'گلیشیر', gradient: 'linear-gradient(135deg,#e8eaf6,#e3f2fd,#e0f7fa)', bg: '#e8eaf6', surface: 'rgba(255,255,255,0.70)', accent: '#3949ab', text: '#1a237e', border: 'rgba(57,73,171,0.3)', glow: '#3949ab', bubbleColors: ['#9fa8da','#7986cb','#5c6bc0','#3f51b5','#3949ab'] },
  { id: 'autumn', name: 'Autumn', nameUr: 'خزاں', gradient: 'linear-gradient(135deg,#fff3e0,#ffe0b2,#fbe9e7)', bg: '#fff3e0', surface: 'rgba(255,255,255,0.65)', accent: '#bf360c', text: '#bf360c', border: 'rgba(191,54,12,0.3)', glow: '#bf360c', bubbleColors: ['#ffcc80','#ffa726','#ff7043','#f4511e','#bf360c'] },
  { id: 'cherry', name: 'Cherry Blossom', nameUr: 'چیری', gradient: 'linear-gradient(135deg,#fce4ec,#f8bbd0,#ffe0f0)', bg: '#fce4ec', surface: 'rgba(255,255,255,0.65)', accent: '#c2185b', text: '#880e4f', border: 'rgba(194,24,91,0.3)', glow: '#c2185b', bubbleColors: ['#f48fb1','#f06292','#ec407a','#e91e63','#c2185b'] },
  { id: 'arctic', name: 'Arctic', nameUr: 'آرکٹک', gradient: 'linear-gradient(135deg,#e3f2fd,#e1f5fe,#e0f7fa)', bg: '#e3f2fd', surface: 'rgba(255,255,255,0.72)', accent: '#00b0ff', text: '#0277bd', border: 'rgba(0,176,255,0.3)', glow: '#00b0ff', bubbleColors: ['#b3e5fc','#81d4fa','#4fc3f7','#29b6f6','#00b0ff'] },
  { id: 'opal', name: 'Opal', nameUr: 'اوپل', gradient: 'linear-gradient(135deg,#e0f7fa,#f3e5f5,#e8f5e9)', bg: '#e0f7fa', surface: 'rgba(255,255,255,0.68)', accent: '#00bcd4', text: '#006064', border: 'rgba(0,188,212,0.25)', glow: '#00bcd4', bubbleColors: ['#b2ebf2','#e1bee7','#c8e6c9','#b3e5fc','#f8bbd0'] },
  { id: 'flamingo', name: 'Flamingo', nameUr: 'فلیمنگو', gradient: 'linear-gradient(135deg,#fce4ec,#fff9c4,#fbe9e7)', bg: '#fce4ec', surface: 'rgba(255,255,255,0.65)', accent: '#e91e63', text: '#880e4f', border: 'rgba(233,30,99,0.28)', glow: '#e91e63', bubbleColors: ['#ff80ab','#ff4081','#f06292','#ffcc02','#ffe57f'] },
  { id: 'jade', name: 'Jade', nameUr: 'جیڈ', gradient: 'linear-gradient(135deg,#e0f2f1,#e8f5e9,#f1f8e9)', bg: '#e0f2f1', surface: 'rgba(255,255,255,0.65)', accent: '#00695c', text: '#004d40', border: 'rgba(0,105,92,0.3)', glow: '#00695c', bubbleColors: ['#80cbc4','#4db6ac','#26a69a','#009688','#00897b'] },
  { id: 'ivory', name: 'Ivory White', nameUr: 'عاج سفید', gradient: 'linear-gradient(135deg,#fffde7,#fff9c4,#f9fbe7)', bg: '#fffde7', surface: 'rgba(255,255,255,0.75)', accent: '#f9a825', text: '#f57f17', border: 'rgba(249,168,37,0.3)', glow: '#f9a825', bubbleColors: ['#fff9c4','#fff59d','#fff176','#ffee58','#ffeb3b'] },
  { id: 'nebula', name: 'Nebula', nameUr: 'سحابیہ', gradient: 'linear-gradient(135deg,#ede7f6,#e8eaf6,#e3f2fd)', bg: '#ede7f6', surface: 'rgba(255,255,255,0.65)', accent: '#512da8', text: '#311b92', border: 'rgba(81,45,168,0.3)', glow: '#512da8', bubbleColors: ['#d1c4e9','#b39ddb','#9575cd','#7e57c2','#673ab7'] },
];

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (id: string) => void;
  themes: AppTheme[];
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: THEMES[0],
  setTheme: () => {},
  themes: THEMES,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('iqmail_theme') || 'aurora');
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const setTheme = (id: string) => {
    localStorage.setItem('iqmail_theme', id);
    setThemeId(id);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
