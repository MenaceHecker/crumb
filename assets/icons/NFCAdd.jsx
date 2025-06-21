import * as React from "react"
import Svg, { Path } from "react-native-svg";

const NFC = (props) => ( 
  <Svg
    xmlns="http://www.w3.org/2000/svg" // Can often be omitted, but included for exact format match
    viewBox="0 0 24 24"
    width={props.size || 24} // Use props.size with a default of 24
    height={props.size || 24} // Use props.size with a default of 24
    color={props.color || "#000000"} // Use props.color with a default of black
    fill={props.fill || "none"} // Use props.fill with a default of "none"
    {...props} // Spread any other props passed to the Svg component
  >

    <Path
      d="M11 20a3 3 0 0 1 -3 -3v-11l5 5"
      stroke="currentColor" // This picks up the 'color' prop from the Svg component
      strokeWidth={props.strokeWidth || 2} // Use props.strokeWidth with a default of 2
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 4a3 3 0 0 1 3 3v11l-5 -5"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 4m0 3a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default NFC; 