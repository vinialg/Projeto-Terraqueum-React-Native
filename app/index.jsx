import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native';
import TelaBase from '../components/TelaBase';

const index = () => {
    const router = useRouter();
  return (
    <TelaBase>
      <Text>index</Text>
      <Button title="bem-vindo1" onPress={()=> router.push('bemVindo')} />
    </TelaBase>
  )
}

export default index