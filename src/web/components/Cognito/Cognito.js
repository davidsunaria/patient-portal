import { CognitoUserPool } from "amazon-cognito-identity-js";
var poolData = {
	UserPoolId: process.env.REACT_APP_COGNITO_POOL_ID, // Your user pool id here
	ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID, // Your client id here
};
export default new CognitoUserPool(poolData);
