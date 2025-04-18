
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
│   ├── data
│   │   └── leaderboard.json
│   └── server.js
├── static
│   ├── assets
│   │   ├── images
│   │   │   └── sprite
│   │   │       ├── idle
│   │   │       └── walk
│   │   └── song
│   │       └── Fur_elise.mp3
│   ├── scripts
│   │   ├── enigmes.js
│   │   ├── GUI
│   │   │   └── leaderboard.js
│   │   ├── models
│   │   │   └── player.js
│   │   └── services
│   │       └── localStorageService.js
│   └── styles
│       └── style.css
└── index.html
```

---

## 🎬 Presentation

The link for the Trello board is [here](https://trello.com/invite/b/67d2d3325da5a2c80e30d729/ATTId7dc33a9cfd4bfbb517200c1bf774f2796DA07FF/projet-js)

### 👥 Credits

<a href="https://github.com/Oiha-dev"><img src="https://avatars.githubusercontent.com/u/115953539" alt="Gauthier Cenes" width="69" height="69"/></a>
<a href="https://github.com/DantesDels"><img src="https://avatars.githubusercontent.com/u/170110923" alt="Sébastien Delver" width="69" height="69"/></a>
<a href="https://github.com/naolatam"><img src="https://avatars.githubusercontent.com/u/59016480" alt="Sébastien Delver" width="69" height="69"/></a>
