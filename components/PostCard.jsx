import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { hp, wp} from '../helpers/common'
import { theme } from '../constants/theme'
import Avatar from './Avatar'
import moment from 'moment'
import Icone from '../assets/icons'
import RenderHtml from 'react-native-render-html';
import { getSupabaseFileUrl } from '../services/imageService'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Video } from 'expo-av'

const textStyle = {
    color: theme.colors.dark,
    fontSize: hp(1.75)
}

const tagsStyles = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: {
        color: theme.colors.dark
    },
    h4: {
        color: theme.colors.dark
    }
}

const PostCard = ({
    item, 
    currentUser,
    router,
    hasShadow = true,

}) => {
    const shadowStyles = {
        shadowOffset:{
            width: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1
    }
    
    const openPostDetails = () =>{

    }

    const createdAt = moment(item?.created_at).format('MMM D');
    const likes = [];
    const liked = false;
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
            <Avatar
                size={hp(4.5)}
                uri={item?.user?.image}
                rounded={theme.radius.md}
            />
            <View style={{gap: 2}}>
                <Text style={styles.username}>{item?.user?.name}</Text>
                <Text style={styles.postTime}>{createdAt}</Text>
            </View>
        </View>
        <TouchableOpacity onPress={openPostDetails}> 
            <Icone nome="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text}/>
        </TouchableOpacity>
      </View>
       <View style={styles.content}>
        <View style={styles.postBody}>
            {
                item?.body && (
                    <RenderHtml
                        contentWidth={wp(100)}
                        source={{html: item?.body}}
                        tagsStyles={tagsStyles}
                    />
                )
            }
        </View>
        {
            item?.file && item?.file?.includes('postImages') && (
                <Image
                    source={getSupabaseFileUrl(item?.file)}
                    transition={100}
                    style={styles.postMedia}
                    contentFit='cover'
                />
            )
        }

        {
            item?.file && item?.file?.includes('postVideos') && (
                <Video
                    style={[styles.postMedia, {height: hp(30)}]}
                    source={getSupabaseFileUrl(item?.file)}
                    useNativeControls 
                    resizeMode='cover'
                    isLooping
                />
            )
        }
      </View>

      <View style={styles.footer}>
        <View style={styles.footerButton}>
            <TouchableOpacity>
                <Icone nome="heart" size={24} fill={liked? theme.colors.rose: 'transparent'} color={liked? theme.colors.rose: theme.colors.textLight}/>
            </TouchableOpacity>
            <Text style={styles.count}>
                {
                    likes?.length
                }
            </Text>
        </View>
        <View style={styles.footerButton}>
            <TouchableOpacity>
                <Icone nome="comment" size={24} color={theme.colors.textLight}/>
            </TouchableOpacity>
            <Text style={styles.count}>
                {
                    0
                }
            </Text>
        </View>
        <View style={styles.footerButton}>
            <TouchableOpacity>
                <Icone nome="share" size={24} color={theme.colors.textLight}/>
            </TouchableOpacity>
        </View>
      </View>

    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
    },


    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    username: {
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium,
    },

    postTime: {
        fontSize: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },

    content: {
        gap: 10,
        // marginBottom: 10,
    },

    postMedia: {
        height: hp(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
    },

    postBody: {
        marginLeft: 5,
    },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },

    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },

    count: {
        color: theme.colors.text,
        fontSize: hp(1.8),
    },

})