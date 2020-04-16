https://medium.com/pvtl/react-native-custom-components-6cd0f6461f67
https://reactnative.dev/docs/animated.html
https://github.com/archriss/react-native-snap-carousel#layouts-and-custom-interpolations

## Links for UI color design
https://www.colorhexa.com/
1. https://blog.prototypr.io/how-to-design-a-dark-theme-for-your-android-app-3daeb264637 (good design)


## Links for graphQl
https://graphql.org/graphql-js/basic-types/
https://foundation.graphql.org/
https://graphql.org/learn/queries/
https://www.howtographql.com/graphql-js/8-filtering-pagination-and-sorting/
https://www.edx.org/course/exploring-graphql-a-query-language-for-apis
https://medium.com/codingthesmartway-com-blog/creating-a-graphql-server-with-node-js-and-express-f6dddc5320e1
https://www.digitalocean.com/community/tutorials/how-to-build-and-deploy-a-graphql-server-with-node-js-and-mongodb-on-ubuntu-18-04
https://www.freecodecamp.org/news/how-to-set-up-a-graphql-server-using-node-js-express-mongodb-52421b73f474/
https://github.com/academind/yt-graphql-react-event-booking-api/blob/06-finish-ecprevents-schema/graphql/resolvers/index.js
https://www.youtube.com/watch?v=JmFSGqbmzT4&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=11


## Good links
1. Progressive Image Loading React native: https://medium.com/react-native-training/progressive-image-loading-in-react-native-e7a01827feb7


## Links for MongoDb
1. https://docs.mongodb.com/manual/administration/security-checklist/ (security for mongoDB)
2. https://medium.com/better-programming/mongoose-vs-the-mongodb-node-driver-7dc59f00a5dd  (nice medium article on tools to use for mongodb)
3. https://mongodb.github.io/node-mongodb-native/3.5/ (Link for native client of MongoDB for node js)


## Guide for using Apollo local state management
1. https://itnext.io/managing-local-state-with-apollo-client-and-react-hooks-9ad357e6d649


## Guide for images in react native
1. https://medium.com/@adamjacobb/react-native-performance-images-adf5843e120
2. How to implement "Progressive Image Loading" in react native:
    This requires generating thumbnail image sources for each, hence look at it later. It is amazing for UI
    a. https://medium.com/react-native-training/progressive-image-loading-in-react-native-e7a01827feb7
    b. https://medium.com/the-react-native-log/progressive-image-loading-in-react-native-ecc88e724343
    
## Guide on optimisation
1. https://medium.com/@rossbulat/how-to-memoize-in-react-3d20cbcd2b6e (--- guide on react memoization)
2. https://hackernoon.com/react-native-performance-do-and-dont-1198e97b730a
3. https://engineering.fb.com/android/dive-into-react-native-performance/
4. https://www.youtube.com/watch?v=Pa2uN2KRbj0 (react native profiling guide
)
5. Check this app out https://github.com/infinitered/reactotron
6. https://medium.com/better-programming/https-medium-com-mayank-gupta-6-88-21-performance-optimizations-techniques-for-react-d15fa52c2349

## Links on react native keyboard animation
1. https://stackoverflow.com/questions/29313244/how-to-auto-slide-the-window-out-from-behind-keyboard-when-textinput-has-focus/32593814#32593814


## How to load image dimensions fast
1. Make your images 1080p if possible. On upload save actual width and height of the image to a database. On request the client already knows the image dimensions and can calculate it's aspect ratio. The client also knows it's screens dimensions. This way it can request the exact size needed from the server and knows exactly how much space on the screen will be used. This is important to render lists efficiently without stutter. On the backend you'll want to passively read through a cache. Sanitize image requests. You don't want to deliver 877 pixels width but rather 800,850,900,etc. Try to whitelist sizes that make sense and cover many devices. Resize the image accordingly, put it in your LRU or whatever cache and respond to client. Also make sure to set client caching headers so that the client will also cache images locally. That's basically it. You can also add a CDN as cache between client and backend but that's another story.


## Interesting technical posts
1. https://instagram-engineering.com/what-powers-instagram-hundreds-of-instances-dozens-of-technologies-adf2e22da2ad
2. https://speakerdeck.com/mikeyk/secrets-to-lightning-fast-mobile-design?slide=94

# Instagram engineering: https://instagram-engineering.com/instagram-darkmode-58802b43c0f2

## Setting up splash screen
1. https://medium.com/@appstud/add-a-splash-screen-to-a-react-native-app-810492e773f9
2. https://medium.com/handlebar-labs/how-to-add-a-splash-screen-to-a-react-native-app-ios-and-android-30a3cec835ae

## Generating different icon sizes for ios/android
1. https://makeappicon.com/
2. https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=image&foreground.space.trim=1&foreground.space.pad=0&foreColor=rgba(96%2C%20125%2C%20139%2C%200)&backColor=rgb(68%2C%20138%2C%20255)&crop=0&backgroundShape=circle&effects=none&name=ic_launcher_round

## Generating phone mocks
1. https://mockuphone.com/iphonexspacegrey
2. https://screenshots.appure.io/apps/28020/export

## Generated Privacy policy
1. https://app.termly.io/dashboard/website/403141/privacy-policy
2. Hosted on google sites

## final stuff before deploy
1. Diff prod & dev mongodb endpoint
2. Diff aws prod&dev buckets
3. PM2 deploy on ec2 instance
