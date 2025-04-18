
## 📖 Table of contents

1. [**📚 About the project**](#-about-the-project)
2. [**🎥 Demo**](#-demo)
3. [**🚀 How to run the project**](#-how-to-run-the-project)
4. [**💻 Technologies**](#-technologies)
5. [**📁 Project Structure**](#-project-structure)
6. [**🎬 Presentation**](#-presentation)
7. [**👥 Credits**](#-credits)

---

## 📚 About the project

This project is an interactive puzzle game where players must solve a series of enigmas to progress. The game follows a player through different puzzles with animated sprites and environment interactions.

- 🎮 Interactive puzzle game
- 🏆 Leaderboard system to compare scores
- ⏱️ Timer to measure player performance
- 🎵 Sounds and animations for an immersive experience

The final project repository can be found [here](https://ytrack.learn.ynov.com/git/mloan/challenge-js)

---

## 🎥 Demo

![PlaceHolder](https://i.imgur.com/KKGEcst.gif)

---

## 🚀 How to run the project

To run the project, you will need Node.js installed on your computer.

1. Clone the repository:
```bash
git clone https://ytrack.learn.ynov.com/git/mloan/challenge-js.git
cd challenge-js
npm install express
node backend/server.js
```

2. Open your browser and go to `http://localhost:8080/` to play.

---

## 💻 Technologies

The project was developed using the following technologies:
- JavaScript (ES6+)
- HTML5 / CSS3
- Node.js + Express
- LocalStorage for game data
- Sprite and animation systems

---

## 📁 Project Structure

Here have a look at simplified version of project structure:

```
.
├── backend
│   ├── data
│   │   └── leaderboard.json
│   └── server.js
├── node_modules
├── public
│   ├── game.html
│   ├── index.html
│   └── static
│       ├── assets
│       │   ├── fonts
│       │   │   └── PressStart2P-Regular.ttf
│       │   ├── images
│       │   │   ├── icons
│       │   │   │   ├── Clé.png
│       │   │   │   ├── Equerre.png
│       │   │   │   ├── Helmet.png
│       │   │   │   ├── L.png
│       │   │   │   ├── Marteau.png
│       │   │   │   └── Water.png
│       │   │   ├── map
│       │   │   │   ├── Map-1.png
│       │   │   │   ├── Map-2.png
│       │   │   │   ├── Map-3.png
│       │   │   │   ├── Map-4.png
│       │   │   │   ├── Map-5.png
│       │   │   │   ├── Map-6.png
│       │   │   │   └── Map-7.png
│       │   │   ├── Map-3.png
│       │   │   └── sprite
│       │   │       ├── idle
│       │   │       ├── knight
│       │   │       │   ├── idle.png
│       │   │       │   └── walk
│       │   │       └── walk
│       │   ├── json
│       │   │   ├── interactions-1.json
│       │   │   ├── interactions-2.json
│       │   │   ├── interactions-3.json
│       │   │   ├── interactions-4.json
│       │   │   ├── interactions-5.json
│       │   │   ├── interactions-6.json
│       │   │   └── interactions-7.json
│       │   └── song
│       │       └── Fur_elise.mp3
│       ├── css
│       │   ├── homeStyle.css
│       │   └── style.css
│       └── scripts
│           ├── controllers
│           │   └── move.js
│           ├── enigmes
│           │   ├── enigme1.js
│           │   ├── enigme2.js
│           │   ├── enigme3.js
│           │   ├── enigme4.js
│           │   ├── enigme5.js
│           │   └── enigmes.js
│           ├── game.js
│           ├── GUI
│           │   ├── arrowsInputHoverEffect.js
│           │   ├── dragNdrop.js
│           │   ├── effects.js
│           │   ├── enigmeManager.js
│           │   ├── fetchContent.js
│           │   ├── gameOver.js
│           │   ├── hiddenQuest.js
│           │   ├── leaderboard.js
│           │   ├── manageATH.js
│           │   ├── manageInteractBox.js
│           │   ├── messagePopUp.js
│           │   ├── pseudo.js
│           │   └── startTimer.js
│           ├── main.js
│           ├── models
│           │   ├── entity.js
│           │   ├── interactionManager.js
│           │   ├── player.js
│           │   └── renderer.js
│           ├── services
│           │   └── localStorageService.js
│           ├── utils.js
│           └── variables.js
```

---

## 🎬 Presentation

The link for the Trello board is [here](https://trello.com/invite/b/67d2d3325da5a2c80e30d729/ATTId7dc33a9cfd4bfbb517200c1bf774f2796DA07FF/projet-js)

## 🎮 Play

Here is a demo playable [online](https://challenge-js.doomoon.fr)

### 👥 Credits

<a href="https://github.com/Oiha-dev"><img src="https://avatars.githubusercontent.com/u/115953539" alt="Gauthier Cenes" width="69" height="69"/></a>
<a href="https://github.com/DantesDels"><img src="https://avatars.githubusercontent.com/u/170110923" alt="Sébastien Delver" width="69" height="69"/></a>
<a href="https://github.com/naolatam"><img src="https://avatars.githubusercontent.com/u/59016480" alt="Sébastien Delver" width="69" height="69"/></a>
