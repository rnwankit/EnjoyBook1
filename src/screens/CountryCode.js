import React, { useState } from 'react'
import { View, Text, StyleSheet, PixelRatio, Switch } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import { CountryCode, Country } from './src/types'

const styles = StyleSheet.create({
    // ...
})

export default function App() {
    const [countryCode, setCountryCode] = useState<CountryCode>('FR')
    const [country, setCountry] = useState<Country>(null)
    const [withCountryNameButton, setWithCountryNameButton] = useState<boolean>(
        false
    )
    const [withFlag, setWithFlag] = useState<boolean>(true)
    const [withEmoji, setWithEmoji] = useState<boolean>(true)
    const [withFilter, setWithFilter] = useState<boolean>(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false)
    const [withCallingCode, setWithCallingCode] = useState<boolean>(false)
    const onSelect = (country: Country) => {
        setCountryCode(country.cca2)
        setCountry(country)
    }
    return (
        <View style={styles.container}>
            <Text>Welcome to Country Picker !</Text>

            <CountryPicker
                {...{
                    countryCode,
                    withFilter,
                    withFlag,
                    withCountryNameButton,
                    withAlphaFilter,
                    withCallingCode,
                    withEmoji,
                    onSelect
                }}
                visible
            />

            {country !== null && (
                <Text style={styles.data}>{JSON.stringify(country, null, 2)}</Text>
            )}
        </View>
    )
}
