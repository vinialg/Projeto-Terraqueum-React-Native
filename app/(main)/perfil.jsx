import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TelaBase from '../../components/TelaBase'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'
import Header  from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import Icone from '../../assets/icons'
import { theme } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import Avatar from '../../components/Avatar'

const Perfil = () => {
    const {user, setAuth} = useAuth();
    const router = useRouter();

    const onLogout = async ()=>{
        // setAuth(null);
        const {error} = await supabase.auth.signOut();
        if(error){
            Alert.alert("Logout", "Erro ao deslogar!")
        }
    }
    
    const handleLogout = async ()=>{
        Alert.alert('Confirme', "Tem certeza que quer sair?", [
            {
                text: 'Cancelar',
                onPress: ()=> console.log('modo cancelado'),
                style: 'cancel'
            },
            {
                text: 'Logout',
                onPress: ()=> onLogout(),
                style: 'destructive'
            },

        ])
    }
  return (
    <TelaBase bg="white">
      <UserHeader user={user} router={router} handleLogout={handleLogout}/>
    </TelaBase>
  )
}

const UserHeader = ({user, router, handleLogout}) =>{
    return (
        <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4)}}>
            <View>
                <Header title="Perfil" mb={30}/>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icone nome="logout" color={theme.colors.rose}/>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={{gap: 15}}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            uri={user?.image}
                            size={hp(12)}
                            rounded={theme.radius.xxl*1.4}
                        />
                        <Pressable style={styles.editIcon} onPress={()=> router.push('editPerfil')}>
                            <Icone nome="edit" strokeWidth={2.5} size={20} />
                        </Pressable>
                    </View>
                    
                    <View style={{alignItems: 'center', gap: 4}}>
                        <Text style={styles.userName}>{user && user.name}</Text>
                        <Text style={styles.infoText}>{user && user.address}</Text>
                    </View>

                    <View style={{gap: 10}}>
                        <View style={styles.info}>
                            <Icone nome="mail" size={20} color={theme.colors.textLight}/>
                            <Text style={styles.infoText}>
                                {user && user.email}
                            </Text>
                        </View>
                        {
                            user && user.phoneNumber && (
                                <View style={styles.info}>
                                    <Icone nome="call" size={20} color={theme.colors.textLight}/>
                                    <Text style={styles.infoText}>
                                        {user && user.phoneNumber}
                                    </Text>
                                </View>
                            )
                        }

                        {
                            user && user.bio && (
                                <Text style={styles.infoText}>{user.bio}</Text>
                            )
                        }
                       
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Perfil

const styles = StyleSheet.create({
    headerContainer: {
        marginHorizontal: wp(4),
        marginBottom: 20,
    },

    headerShape: {
        width: wp(100),
        height: hp(20),
    },

    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: 'center',
    },

    container: {
        flex: 1,
    },

    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },

    userName: {
        fontSize: hp(3),
        fontWeight: '500',
        color: theme.colors.textDark,
    },


    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    infoText: {
        fontSize: hp(1.6),
        fontWeight: '500',
        color: theme.colors.textLight,
    },

    logoutButton: {
        position: 'absolute',
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: '#fee2e2', // corrigido backgroundQplor → backgroundColor
    },

    listStyle: {
        paddingHorizontal: wp(4),
        paddingBottom: 30,
    },

    noPosts: {
        fontSize: hp(2),
        textAlign: 'center',
        color: theme.colors.text,
    } 
})