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
import { supabase } from '../lib/supabase'

const Cadastro= () => {
    const router = useRouter();
    const emailRef = useRef("");
    const nameRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const submeter = async ()=>{
        if(!nameRef.current || !emailRef.current || !passwordRef.current){
            Alert.alert('Cadastro', 'preencha todos os campos');
            return;
        }

        let name = nameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        setLoading(true);

        const {data: {session},error} = await supabase.auth.signUp({
            email,
            password,
            options:{
                data: {
                    name
                }
            }
        });
        setLoading(false);

        // console.log('sessao: ', session);
        // console.log('erro: ', error);

        if(error){
            Alert.alert('Cadastro', error.message);
        }


    }
  return (
    <TelaBase bg='white'>
        <StatusBar style='dark' />
        <View style={styles.container}>
            <VoltarButton router={router}/>
            <View>
                <Text style={styles.welcomeText}>Bora</Text>
                <Text style={styles.welcomeText}>Começar!</Text>
            </View>

            <View style={styles.form}>
                <Text style={[{fontSize: hp(1.5), color: theme.colors.text}, styles.formLabel]}>
                    Preencha os detalhes para criar uma nova conta
                </Text>
                <Input
                    icon={<Icone nome="user" size={26} strokeWidth={1.6}/>}
                    placeholder='Preencha com seu nome'
                    onChangeText={value=> nameRef.current = value}
                />
                <Input
                    icon={<Icone nome="mail" size={26} strokeWidth={1.6}/>}
                    placeholder='Preencha com seu e-mail'
                    onChangeText={value=> emailRef.current = value}
                />
                <Input
                    icon={<Icone nome="lock" size={26} strokeWidth={1.6}/>}
                    placeholder='Preencha com sua senha' secureTextEntry 
                    onChangeText={value=> passwordRef.current = value}
                />
               
                <AppButton title={'Cadastrar'} loading={loading} onPress={submeter}/>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Já tem uma conta!
                </Text>
                <Pressable onPress={()=> router.push('login')}>
                    <Text style={[styles.footerText,{color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>Login</Text>
                </Pressable>
            </View>

        </View>
    </TelaBase>
  )
}

export default Cadastro

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
