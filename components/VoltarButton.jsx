import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import Icone from '../assets/icons/index'
import { router } from 'expo-router'

const VoltarButton = ({size=26, router}) => {
  return (
    <Pressable onPress={()=> router.back()} style={styles.button}>
      <Icone nome="arrowLeft" strokeWidth={2.5} size={size} color={theme.colors.text}/>
    </Pressable>
  )
}

export default VoltarButton

const styles = StyleSheet.create({
    button:{
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0,0.07)'
    }
})