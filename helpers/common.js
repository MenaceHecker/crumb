import { Dimensions } from "react-native";


const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
const hp = percentage => {
  const value = (percentage * deviceHeight) / 100;
}
const wp = percentage => {
  const value = (percentage * deviceWidth) / 100;
}