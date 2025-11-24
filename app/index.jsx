import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native';
import TelaBase from '../components/TelaBase';
import Loading from '../components/Loading';
import { View } from 'react-native';

const index = () => {
    const router = useRouter();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Loading/>
    </View>
  )
}

export default index