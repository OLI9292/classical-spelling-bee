## Classical Spelling Bee

Classical Spelling Bee is a vocabulary acquisition game based on Latin roots.

The app is built using React Native and Firebase. [GameDataManager](https://github.com/Classical-SB/classical-spelling-bee/blob/master/Services/GameDataManager.js), with help from a couple other [Services](https://github.com/Classical-SB/classical-spelling-bee/tree/master/Services), deconstructs data from Firebase to save as JSON in AsyncStorage.

Game state is controlled in [App](https://github.com/Classical-SB/classical-spelling-bee/blob/master/App.js), while dynamics are controlled in [Game](https://github.com/Classical-SB/classical-spelling-bee/blob/master/Components/Game.js).

### Setup

1. Install the latest version of [Node](https://nodejs.org/en/download/) or make sure to at least have Node 6 when running `node -v`.

2. Clone the repo.

3. Run `npm install -g create-react-native-app`.

4. Run `npm install` inside the project directory to download dependencies.

5. Run `npm start` to run the app (you should see a QR code and success messages).

6. Download the Expo app to scan the QR code and use live-reloading while developing.
