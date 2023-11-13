
//old - to be removed
export const AWS_S3_STATIC_HOST = "http://justinlim-demo1.s3-website-us-east-1.amazonaws.com"
export const AWS_API_GATEWAY = "https://b58gyxek80.execute-api.us-east-1.amazonaws.com/default"
export const AWS_API_GATEWAY_CARDS_FUNCTION = "justinlim-demo1-card"
export const AWS_API_GATEWAY_MESSAGES_FUNCTION = "justinlim-demo1-message"
export const AWS_API_GATEWAY_CARDS_TABLE = "justinlim-demo1-dynamodb-cards-table"
export const AWS_API_GATEWAY_MESSAGES_TABLE = "justinlim-demo1-dynamodb-messages-table"

//new (these links to be replaced with CloudFront links later)
export const AWS_API_GATEWAY_UPLOAD_IMAGE_URL = "https://0twzhclich.execute-api.us-west-2.amazonaws.com/dev/friends-capstone-infra-s3-images/originals/{filename}";


//export const AWS_ALB_CRUD_HOST_NAME = "http://friends-capstone-ecs-shared-alb-2059628003.us-west-2.elb.amazonaws.com:5000";
export const AWS_CF_HOST_NAME = "https://dae7avsudwv03.cloudfront.net";
export const AWS_CF_GET_CARDS_CATALOG_URL = "api/cardsCatalog";
export const AWS_CF_CREATE_CARD_URL = "api/createCard";
export const AWS_CF_GET_CARD_URL = "api/getCard";
export const AWS_CF_GET_MESSAGES_URL = "api/getMessages";
export const AWS_CF_SIGN_CARD_URL = "api/signCard";