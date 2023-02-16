import { FlatList, PermissionsAndroid, Pressable, Text, View } from 'react-native'
import { ScanMode, State } from 'react-native-ble-plx'
import { useEffect, useState } from 'react'

import myBLE from './utils/MyBLE'

export default function Index() {
  const [devices, setDevices] = useState([])
  const [isBleEnabled, setIsBleEnabled] = useState(false)

  useEffect(() => {
    const requestPermissions = async () => {
      await PermissionsAndroid.requestMultiple([
        'android.permission.BLUETOOTH_CONNECT',
        'android.permission.BLUETOOTH_SCAN',
        'android.permission.BLUETOOTH_ADVERTISE',
        'android.permission.ACCESS_COARSE_LOCATION'
      ])

      setIsBleEnabled(true)
    }

    const checkIfEnabled = async () => {
      const state = await myBLE.state()
            
      if (state === State.PoweredOn) {
        await requestPermissions()

        return
      }

      try {
        await myBLE.enable()

        await requestPermissions()
        
        setIsBleEnabled(true)
      }

      catch (e) {
        console.log(`Could not scan devices: ${e}`)

        return
      }
    }

    checkIfEnabled()
  }, [])

  const handleScanClick = () => {
    let count = 0
    
    const scannedDeviceCallback = (error, scannedDevice) => {
      if (count > 10) myBLE.stopDeviceScan()

      setDevices(last => {        
        if (last.includes(scannedDevice.id)) return last
        
        return [...last, scannedDevice.id]
      })

      count += 1
    }

    myBLE.startDeviceScan(null, { scanMode: ScanMode.LowLatency }, scannedDeviceCallback)
  }

  if (!isBleEnabled) return null

  else return(
    <View>
      <Pressable onPress={handleScanClick}>
        <Text>Click to scan devices</Text>
      </Pressable>

      <FlatList
        data={devices}
        renderItem={({item}) => <RenderItem id={item} />}
        keyExtractor={item => item}
      />
    </View>
  )
}

function RenderItem({ id, name }) {
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <Text>{id}</Text>

      <Text>{name}</Text>
    </View>
  )
}