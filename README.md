## Project Title
Seraph AI

## Project Description (One Sentence Pitch)
Our app offers an AI robot rental and delivery service with high efficiency and flexibility to help you with a variety of household tasks and personal needs.

## Technologies used
- Front end: CSS, ejs, JavaScript
- Back end: JavaScript, Node.js, Express
- Database: Mongo DB, mongoose
- Other Technology: BootStrap, Google Map API, Chatbot API, Gmail SMTP, Stripe

## Listing of File Contents of folder

## How to install or run the project
##### 1. What does developer need to install?
- Languages: HTML, CSS, JavaScript, Node.js
- IDEs: Visual Studio Code (VScode)
- Databases: mongoDB
- Sourcetree or GitHub Desktop

##### 2. Which 3rd party APIs and frameworks does the developer need to download? Are we downloading anything here?
- No need to download anything to access.

##### 3. Do they need any API keys?
- YES:
- Google maps key
- Stripe key
- Chatbot API (***please note - the free trial for this service ends June 04, 2024 and the function will not work afterwards***)

##### 4. In which order should they install things? Does installation location matter?
    1. Install IDEs first
    2. Install Sourcetree
    3. npm i
    4. connect mongoDB database
    5. installation location: IDEs and Sourcetree do not matter

##### 5. Configuration instructions
    1. clone GitHub repository using Sourcetree and save locally
    2. open folder in VScode
    3. npm i
    4. request permissions to access mongoDB database
    5. create a .env file and include all required passwords, secret keys, API keys, etc.

##### 6. Testing plan:
https://docs.google.com/spreadsheets/d/1DQAwADoGYrqN48Sw9kn3tg88N2nCfc8BB3DWzPYqem4/edit?usp=sharing 

##### 7. separate plaintext file called “password.txt” that contains any admin/user/server login IDs and passwords.

## How to use the product (Features)
##### - Sign Up as a new user
1. Click the “Sign-up” button, upon loading the landing page
2. Enter the required information
3. Click “Sign up”

##### - Edit Profile
1. Click the “Login” button and log in using your personal username and password
2. Click the profile button on the top right corner of the page
3. View and/or edit your profile
4. Click “Save” to confirm changes

##### - Reset Password
1. Click the “Login” button, upon loading the landing page
2. Click “Forgot password?” located under the login fields
3. Enter the email used when creating the account
4. Click the “Request Password-Reset” button
5. Sign into your email account
6. Open the email received from seraphai.service@gmail.com
7. Click the recovery email link in the body of the email
8. Enter new, desired password
9. Click the “Submit New Password” button to confirm your new password

##### - Robot suggestion
1. click on the chatbot icon located at the bottom right corner when browsing the robot list page
2. Clicking start the chat button, the chatbot presents a series of questions designed to determine the user's needs and preferences regarding the robot.
3. Based on the answers provided, the chatbot analyzes the user’s needs and suggests the most suitable robot.
4. If you realize that you've made a mistake in your responses or wishes to change answers, select the 'Go Back' option.
5. Alongside the recommended robot, clicking 'Add to Your Cart' will add the recommended robot directly to your shopping cart.

##### - Place an Order
1. Click “Rent now” to select the desired robot to order
2. Click “View Cart”
3. Click “Go to checkout” after visually confirming your cart
4. Enter required payment/shipping details
5. Receive confirmation of successful order

##### - Track delivery: 
1. Please select the order you want to track in the order detail page.
2. Please click the “track order” button to start tracking, and it will redirect to the tracking page.
3. Please allow the browser to capture the current location (we are using the browser‘s location as order’s location, and we fetch that data in 2 mins each time), and then you will see a map view. There is a route between the browser‘s current location and shipping address. If the distance is less than 100m , the delivery status will be marked as the delivered.


## Credits, References, and Licenses
- Chatbot API (The free trial will be expired on June  4th):https://www.chatbot.com/integrations/chat-widget/
- Reference for Reset Password: https://blog.logrocket.com/implementing-secure-password-reset-node-js/
- Google Map reference: https://developers.google.com/maps/documentation/transportation-logistics/last-mile-fleet-solution/shipment-tracking/how-to/track_shipment

## AI Usage
1. Did you use AI to help create your app? If so, how? Be specific.
- Pitch video: Using the AI to provide some pictures for our pitch video.
- Chatbot: Implement the ai-driven chatbot function 
- Tracking page: Sample data for testing

2. Did you use AI to create data sets or clean data sets? If so, how? Be specific.
- Use for tracking function: For example, when we implement the tracking function, we need a set of sample data to draw a route in the map. We ask for help, like giving us a set of latitude and longitude.

3. Does your app use AI? If so, how? Be specific.
- For the chatbot, we turn on the AI Assist functionality in order to provide better responses to users’ random questions. At the beginning of the setting, we have to implement some content on our website as well as some useful links for AI to fetch information. More over, based on the users questions, we create many similar questions plus some keywords, and give these questions a basic answer.

4. Did you encounter any limitations? What were they, and how did you overcome them? Be specific.
- Because the information for AI assist to fetch is very limited, and for this assignment we just use the basic functions of Chatbot, these cause AI assist can not work as we imagine initially. For now, the only thing we can do is to set more key words and similar questions to make the situation better.

## About Us
##### Team Name: BBY-22
Team Members:
- Thomas Smith:tsmith268@my.bcit.ca
- Nathan Mak: nmak18@my.bcit.ca
- Niko Wang: zwang273@my.bcit.ca
- Sunwoo Baek: sbaek17@my.bcit.ca
- Carol Li: zli237@my.bcit.ca
