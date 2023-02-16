import { BleManager } from "react-native-ble-plx";

class MyBLE extends BleManager {
  constructor() {
    super()
  }
}

// This is a singleton pattern in JS
const myBLE = new MyBLE();
export default myBLE;