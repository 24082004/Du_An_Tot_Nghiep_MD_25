import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WelcomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.header}>
        <Text style={styles.logoText}>
          MB
          <Text style={styles.logoHighlight}>oo</Text>
          king
        </Text>
      </View>
      <Image
        source={require('../Asset/we.png')}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.title}>Xin chào MBooking!</Text>
      <Text style={styles.subtitle}>Thưởng thức những bộ phim yêu thích của bạn</Text>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate('LogIn')}>
          <Text style={styles.signInText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        Bằng việc đăng nhập hoặc đăng ký, bạn đồng ý với{' '}
        <Text style={styles.link}>Điều khoản dịch vụ</Text> và{' '}
        <Text style={styles.link}>Chính sách bảo mật </Text>của chúng tôi.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoHighlight: {
    color: '#facc15',
  },
  poster: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#facc15',
  },
  buttonWrapper: {
    marginTop: 20,
  },
  signInBtn: {
    backgroundColor: '#facc15',
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 12,
  },
  signInText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpBtn: {
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 14,
    borderRadius: 30,
  },
  signUpText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  footerText: {
    fontSize: 11,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 10,
  },
  link: {
    color: '#facc15',
  },
});

export default WelcomeScreen;
