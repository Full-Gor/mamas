import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Share, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, neuShadow, neuStyles } from '../theme/colors';

// Icônes SVG inline
const TwitterIcon = ({ color = colors.textMuted, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </Svg>
);

const FacebookIcon = ({ color = colors.textMuted, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

const InstagramIcon = ({ color = colors.textMuted, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </Svg>
);

const ShareIcon = ({ color = colors.textMuted, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
  </Svg>
);

interface SocialBarProps {
  shareMessage?: string;
}

export function SocialBar({ shareMessage = 'Check out my schedule on SG App!' }: SocialBarProps) {
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    Linking.openURL(url);
  };

  const handleFacebook = () => {
    Linking.openURL('https://facebook.com');
  };

  const handleInstagram = () => {
    Linking.openURL('https://instagram.com');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: shareMessage,
        title: 'SG App',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const SocialButton = ({
    id,
    onPress,
    icon: Icon,
  }: {
    id: string;
    onPress: () => void;
    icon: React.FC<{ color?: string; size?: number }>;
  }) => (
    <TouchableOpacity
      style={[
        styles.socialBtn,
        pressedBtn === id ? styles.socialBtnPressed : styles.socialBtnRaised,
      ]}
      onPressIn={() => setPressedBtn(id)}
      onPressOut={() => setPressedBtn(null)}
      onPress={onPress}
      activeOpacity={1}
    >
      <Icon color={colors.textMuted} size={18} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SocialButton id="twitter" onPress={handleTwitter} icon={TwitterIcon} />
      <SocialButton id="facebook" onPress={handleFacebook} icon={FacebookIcon} />
      <SocialButton id="instagram" onPress={handleInstagram} icon={InstagramIcon} />

      <TouchableOpacity
        style={[
          styles.shareBtn,
          pressedBtn === 'share' ? styles.shareBtnPressed : styles.shareBtnRaised,
        ]}
        onPressIn={() => setPressedBtn('share')}
        onPressOut={() => setPressedBtn(null)}
        onPress={handleShare}
        activeOpacity={1}
      >
        <Text style={styles.shareText}>Share</Text>
        <ShareIcon color={colors.textMuted} size={16} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnRaised: {
    backgroundColor: colors.cardBgLight,
    ...neuStyles.buttonRaised,
    ...neuShadow.raisedSm,
  },
  socialBtnPressed: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 8,
  },
  shareBtnRaised: {
    backgroundColor: colors.cardBgLight,
    ...neuStyles.buttonRaised,
    ...neuShadow.raisedSm,
  },
  shareBtnPressed: {
    backgroundColor: colors.cardBgDark,
    ...neuStyles.buttonPressed,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
});
