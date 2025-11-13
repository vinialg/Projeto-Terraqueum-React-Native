// assets/icons/Home01Icon.jsx
import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Home01Icon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.size || 24}
    height={props.size || 24}
    color={props.color || "#000"}
    fill="none"
    {...props}
  >
    <Path
      d="M15.0001 17C14.2006 17.6224 13.1504 18 12.0001 18C10.8499 18 9.79965 17.6224 9.00012 17"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || 1.5}
      strokeLinecap="round"
    />
    <Path
      d="M2.35151 13.2135C1.99849 10.9162 1.82198 9.76763 2.25629 8.74938C2.69059 7.73112 3.65415 7.03443 5.58126 5.64106L7.02111 4.6C9.41841 2.86667 10.6171 2 12.0001 2C13.3832 2 14.5818 2.86667 16.9791 4.6L18.419 5.64106C20.3461 7.03443 21.3097 7.73112 21.744 8.74938C22.1783 9.76763 22.0018 10.9162 21.6488 13.2135L20.9223 18.0135C20.6636 19.7412 20.5342 20.605 19.9205 21.3025C19.7395 21.5057 19.5317 21.686 19.3032 21.8371C18.5413 22.3412 17.5989 22.3412 15.7142 22.3412H8.28608C6.40131 22.3412 5.45892 22.3412 4.69701 21.8371C4.46851 21.686 4.2607 21.5057 4.07967 21.3025C3.46596 20.605 3.33658 19.7412 3.07785 18.0135L2.35151 13.2135Z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Home01Icon;
