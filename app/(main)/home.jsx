import { Alert, Button, Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import TelaBase from '../../components/TelaBase'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icone from '../../assets/icons'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/postService'
import { FlatList } from 'react-native'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import { getUserData } from '../../services/userService'

var limit = 0;

const Home = () => {

  const {user, setAuth} = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);

  const handlePostEvent = async (payload)=>{
    if(payload.eventType == 'INSERT' && payload?.new?.id){
      let newPost = {...payload.new};
      let res = await getUserData(newPost.userId);
      newPost.user = res.success? res.data: {};
      setPosts(prevPosts=> [newPost, ...prevPosts]);
    }
  }

  useEffect(()=>{

    let postChannel = supabase
    .channel('posts')
    .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent)
    .subscribe();
    getPosts();

    return ()=>{
      supabase.removeChannel(postChannel);
    }
  },[])

  const getPosts = async () =>{

    limit = limit + 10;

    console.log('fetching post: ', limit);
    let res = await fetchPosts(limit);

    if(res.success){
      setPosts(res.data);
    }
    // console.log('resultado do post: ', res);
    // console.log('user: ', res.data[0].user);
  }

  

  console.log('user: ', user);

  // const onLogout = async ()=>{
  //   // setAuth(null);
  //   const {error} = await supabase.auth.signOut();
  //   if(error){
  //     Alert.alert("Logout", "Erro ao deslogar!")
  //   }
  // }
  return (
    <TelaBase bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Terraqueum</Text>
          <View style={styles.icons}>
            <Pressable onPress={()=> router.push('notifications')}>
              <Icone nome="heart" size={hp(3.2)} strokeWidht={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={()=> router.push('novoPost')}>
              <Icone nome="plus" size={hp(3.2)} strokeWidht={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={()=> router.push('perfil')}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{borderWidth: 2}}
              />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={item=> item.id.toString()}
          renderItem={({item})=> <PostCard
            item={item}
            currentUser={user}
            router={router}
            />
          }
          ListFooterComponent = {(
            <View style={{marginVertical: posts.length==0? 200: 30}}>
              <Loading/>
            </View>
          )}
          
        />

      </View>
      {/* <Button title="logout" onPress={onLogout}/> */}
    </TelaBase>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: wp(4)
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: wp(4),
    },

    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold,
    },

    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray,
        borderWidth: 3,
    },

    icons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 18,
    },

    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4),
    },

    noPosts: {
        fontSize: hp(2),
        textAlign: 'center',
        color: theme.colors.text,
    },

    pill: {
        position: 'absolute',
        right: -10,
        top: -4,
        height: hp(2.2),
        width: hp(2.2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight,
    },

    pillText: {
        color: 'white',
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold,
    },

})