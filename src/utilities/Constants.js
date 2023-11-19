
export const AWS_CAPTCHA_INTEGRATION_SCRIPT = "https://ce0088630af3.us-west-2.captcha-sdk.awswaf.com/ce0088630af3/jsapi.js"
export const AWS_CAPTCHA_KEY = "#AWS_CAPTCHA_KEY#"

//new (these links to be replaced with CloudFront links later)
//export const AWS_API_GATEWAY_UPLOAD_IMAGE_URL = "https://ybqb8ftiy3.execute-api.us-west-2.amazonaws.com/dev/friends-capstone-infra-s3-images/originals/{filename}";
export const AWS_API_GATEWAY_UPLOAD_IMAGE_URL = "#API_GATEWAY_UPLOAD_IMAGES_URL#" + "/friends-capstone-infra-s3-images/originals/{filename}";

//export const AWS_ALB_CRUD_HOST_NAME = "http://friends-capstone-ecs-shared-alb-2059628003.us-west-2.elb.amazonaws.com:5000";
export const AWS_CF_HOST_NAME = "https://dae7avsudwv03.cloudfront.net";
export const AWS_CF_GET_CARDS_CATALOG_URL = "api/cardsCatalog";
export const AWS_CF_CREATE_CARD_URL = "api/createCard";
export const AWS_CF_GET_CARD_URL = "api/getCard";
export const AWS_CF_GET_MESSAGES_URL = "api/getMessages";
export const AWS_CF_SIGN_CARD_URL = "api/signCard";

export const AWS_CF_GET_RESIZED_URL = "resized";
export const AWS_CF_GET_THUMBNAILS_URL = "thumbnails";