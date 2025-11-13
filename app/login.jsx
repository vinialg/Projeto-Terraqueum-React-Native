import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import Icone from '../assets/icons/index'
import TelaBase from '../components/TelaBase'
import { StatusBar } from 'expo-status-bar'
import VoltarButton from '../components/VoltarButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import { TextInput } from 'react-native-web'
import Input from '../components/Input'
import { useRef, useState } from 'react'
import AppButton from '../components/AppButton'

const Login = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const senhaRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async ()=>{
        if(!emailRef.current || !senhaRef.current){
            Alert.alert('Login', 'preencha todos os campos');
            return;
        }
    }
  return (
    <TelaBase bg='white'>
        <StatusBar style='dark' />
        <View style={styles.container}>
            <VoltarButton router={router}/>
            <View>
                <Text style={styles.welcomeText}>Opa,</Text>
                <Text style={styles.welcomeText}>Bem-vindo de Volta!</Text>
            </View>

            <View style={styles.form}>
                <Text style={[{fontSize: hp(1.5), color: theme.colors.text}, styles.formLabel]}>
                    Faça seu login para continuar
                </Text>
                <Input
                    icon={<Icone nome="mail" size={26} strokeWidth={1.6}/>}
                    placeholder='Preencha com seu e-mail'
                    onChangeText={value=> emailRef.current = value}
                />
                <Input
                    icon={<Icone nome="lock" size={26} strokeWidth={1.6}/>}
                    placeholder='Preencha com sua senha' secureTextEntry 
                    onChangeText={value=> senhaRef.current = value}
                />
                <Text style={styles.forgotPassword}>
                    Esqueceu a senha?
                </Text>
                <AppButton title={'Login'} loading={loading} onPress={onSubmit}/>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Não tem uma conta?
                </Text>
                <Pressable onPress={()=> router.push('cadastro')}>
                    <Text style={[styles.footerText,{color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>Cadastra-se</Text>
                </Pressable>
            </View>

        </View>
    </TelaBase>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },

  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },  
  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
  form: {
    marginTop: hp(2),     // espaço do bloco "form" em relação ao topo
    },
   formLabel: {
    marginBottom: hp(1.2), // espaço ENTRE o Text e o Input
   },
});
