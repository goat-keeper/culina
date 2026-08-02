import { View, Text } from 'react-native'
import React from 'react'


type difficultyLevel="Beginner" | "Intermediate" | "Advanced"

interface Data{
    url:string
    title:string
    username:string
    difficulty:difficultyLevel
    time:number
}

export default function Card({data}: {data: Data}) {
  return (
    <View>
      <Text>

      </Text>
    </View>
  )
}