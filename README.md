# generator-react-client-gamechanger

Generator based on [Yeoman](https://yeoman.io/) that scaffolds the basic [Redux](https://redux.js.org/) logic in a [React](https://reactjs.org/) project based on a graphQL schema.

## Requirement

- yeoman 
```
npm install -g yo
```
- A valid graphQL schema
- An AWS Account set up and configured on your machine ( best if you use the [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) to configure with `aws configure` command)
- A Cognito User group set up (see [AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-as-user-directory.html))

## Installation
### Locally
Get the project and install its dependencies
```
git clone https://github.com/GameChangerCloud/generator-react-client-gamechanger
```
```
cd generator-react-client-gamechanger
```
```
npm install
```
Link the project to your local node_modules folder
```
npm link
```

### Using npm 
Not available yet



## Usage
Generate your React application
````
npx create-react-app <your-app-name> 
````
Generate the final project with yeoman
````
cd <your-app-name> && yo react-client-gamechanger <path/to/graphql/schema.graphql>
````

Now we need to do some setup to connect our client app to the AWS cloud services.

### API Gateway
* If you set up your graphQL server using out generator-aws-server-gamechanger tool, you can use the URL obtained in your constants file.   
`<your-app-name>/src/constants/index.js`  

### Cognito Service 
Fill up the file `<your-app-name>/src/config/app-config.js` with the following info from your Cognito User Pool : 

* `userPoolBase` : General settings > Pool Id
* `userPoolBaseUri` : App integration > Domain
* `clientId` : App integration > App client settings > ID
* `callbackUri` : App integration > App client settings > Callback URL(s) 
* `signoutUri` : App integration > App client settings > Sign out URL(s)

Now we can run the app

````
npm start
````

See the result on http://localhost:3000

## Notes 
### How to use it
___
When you launch your application, you will have a toolbar on the top with :

* Home : Home page (display the graphQL schema and the API Gateway)

* Tables : Page which manage tables (create tables, delete tables, create fake data, delete all data, check if tables have been created and update you database)

* Models : You will have all models and you can access here to manage them. With cognito, they are only available if you are connected. You can access the connexion page with the sign in button.

Before accessing to models you need to create tables.
On the Tables page you have a button for create Tables. 
If he doesn't appear, you haven't put the endpoint. See section "Usage" -> "API Gateway".

### Rules for the forms
___
There is the list of string your field must contain to have the right validator :

"lastname" or "firstname" -> only a-zA-Z characters allowed

"username" or "login" -> only a-zA-Z0-9 and _, -, . allowed

"mail" -> email format "myemail@example.fr"

If the field is an Int it will allow only numbers


## Deployment
Using S3 and CloudFront, you can deploy your app to make it available globally through an URL. We also use the [react-deploy-cli](https://github.com/sumn2u/react-deploy-cli) module to perform the deployment.

Initialize the cloud structure
````
cd terraform 
````
````
terraform init
````
````
terraform apply 
````
It will create two environment `staging` & `production`.
The CloudFront URLs corresponding will be printed in `<your-app-name>/terraform/ids`. If it doesn't, you can get them in your CloudFront console on aws website.  
In your Cognito Console, update your callback and sign out urls.  
Fill up the `<your-app-name>/deploy.js` file with your aws credential info (AccessKey & SecretAccessKey)

### Build

For each type of environment, you need to update `<your-app-name>/src/config/app-config.json`, with the callback and signout URI corresponding before running the build command.

````
npm run build
````
### Deploy

You need react-deploy cli 
````
npm i -g react-deploy-cli
````
Then deploy according to the mode.
````
react-deploy deploy < staging || production >
````

See the results on URLs printed in `<your-app-name>/terraform/ids`


## License
[MIT](https://choosealicense.com/licenses/mit/)
