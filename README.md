## Classical Spelling Bee

Classical Spelling Bee is a vocabulary acquisition game based on Latin roots.

The app is built using React Native and Firebase. [GameDataManager](https://github.com/Classical-SB/classical-spelling-bee/blob/master/Services/GameDataManager.js), with help from a couple other [Services](https://github.com/Classical-SB/classical-spelling-bee/tree/master/Services), deconstructs data from Firebase to save as JSON in AsyncStorage.

Game state is controlled in [App](https://github.com/Classical-SB/classical-spelling-bee/blob/master/App.js), while dynamics are controlled in [Game](https://github.com/Classical-SB/classical-spelling-bee/blob/master/Components/Game.js).
