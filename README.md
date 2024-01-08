# cawcaw-react-native

## About

Social media app made using react-native. Main purpose was to learn react-native. Made for only Android. Uses express for backend [(backend repo link)](https://github.com/ensarkr/cawcaw-express).

## Features

- Auth with JWT tokens.
- Users can create posts. Posts can include 1MB image.
- Posts can be liked and commented on.
- User can follow each other.
- Posts and users can be searched.

## Routes

- Tabs
  - Home - See latest posts. Create new post.
  - Following - See latest posts that posted by people that the user follows.
  - Search - Search posts or users.
  - Profile - Sign out or see user profile.
- User - See posts that posted by the user, posts that liked by the user and comments that the user commented. Also see user followers and followings.
- Post - See post, its comments and add new comment.
- Auth
  - Sign In
  - Sign Up

## Preview

Check this [folder](https://github.com/ensarkr/readme-image-storage/tree/main/cawcaw-react-native) for project images.

## To Use App

1. Download cawcaw-react-native.apk from release.
2. Install it to your android device or emulator.

## To Run Dev Locally

```
$ npm install
$ npx expo start
```

After this there are multiple choices.

1. Download Expo Go app to your android device and scan the QR code in the terminal.
2. Download Android Studio and use its android simulator.

Also instead of using my vercel api. It is possible to setup [my backend](https://github.com/ensarkr/cawcaw-express) on your local machine. If you choose to do this you have to change EXPO_PUBLIC_API_URL in .env accordingly.


## Technologies

- React Native
- Expo
- TypeScript
