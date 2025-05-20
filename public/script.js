document.addEventListener("DOMContentLoaded", async () => {
    const gameMenu = document.getElementById("game-menu")
    const gameContainer = document.getElementById("game-container")
    const instructions = document.getElementById("instructions")
    const leaderboardScreen = document.getElementById("leaderboard-screen")
    const startClassicBtn = document.getElementById("start-classic")
    const startTimeAttackBtn = document.getElementById("start-time-attack")
    const startObstaclesBtn = document.getElementById("start-obstacles")
    const showLeaderboardBtn = document.getElementById("show-leaderboard")
    const howToPlayBtn = document.getElementById("how-to-play")
    const backToMenuFromInstructionsBtn = document.getElementById("back-to-menu-from-instructions")
    const backToMenuFromLeaderboardBtn = document.getElementById("back-to-menu-from-leaderboard")
    const backToMenuFromGameBtn = document.getElementById("back-to-menu-from-game")
    const newGameBtn = document.getElementById("new-game")
    const menuButton = document.getElementById("menu-button")
    const scoreDisplay = document.getElementById("score")
    const bestScoreDisplay = document.getElementById("best-score")
    const personalBestDisplay = document.getElementById("personal-best")
    const timerContainer = document.getElementById("timer-container")
    const timerDisplay = document.getElementById("timer")
    const tileContainer = document.getElementById("tile-container")
    const gameMessage = document.getElementById("game-message")
    const gameMessageText = gameMessage.querySelector("p")
    const tryAgainBtn = document.getElementById("try-again")
    const keepPlayingBtn = document.getElementById("keep-playing")
    const nameInputDialog = document.getElementById("name-input-dialog")
    const finalScoreDisplay = document.getElementById("final-score")
    const playerNameInput = document.getElementById("player-name")
    const saveScoreBtn = document.getElementById("save-score")
    const cancelSaveBtn = document.getElementById("cancel-save")
    const leaderboardModeSelect = document.getElementById("leaderboard-mode")
    const leaderboardSizeSelect = document.getElementById("leaderboard-size")
    const leaderboardSortSelect = document.getElementById("leaderboard-sort")
    const leaderboardLimitSelect = document.getElementById("leaderboard-limit")
    const leaderboardTableBody = document.getElementById("leaderboard-table-body")
    const noRecordsMessage = document.getElementById("no-records")
    const boardSizeSelect = document.getElementById("board-size")

    const tileConfig = {
        2: {
            background: "#eee4da",
            color: "#776e65",
            fontSize: {
                3: "65px",
                4: "55px",
                5: "45px",
                6: "35px",
            },
        },
        4: {
            background: "#ede0c8",
            color: "#776e65",
            fontSize: {
                3: "65px",
                4: "55px",
                5: "45px",
                6: "35px",
            },
        },
        8: {
            background: "#f2b179",
            color: "#f9f6f2",
            fontSize: {
                3: "65px",
                4: "55px",
                5: "45px",
                6: "35px",
            },
        },
        16: {
            background: "#f59563",
            color: "#f9f6f2",
            fontSize: {
                3: "65px",
                4: "55px",
                5: "45px",
                6: "35px",
            },
        },
        32: {
            background: "#f67c5f",
            color: "#f9f6f2",
            fontSize: {
                3: "65px",
                4: "55px",
                5: "45px",
                6: "35px",
            },
        },
        64: {
            background: "#f65e3b",
            color: "#f9f6f2",
            fontSize: {
                3: "65px",
                4: "55px",
                5: "45px",
                6: "35px",
            },
        },
        128: {
            background: "#edcf72",
            color: "#f9f6f2",
            fontSize: {
                3: "55px",
                4: "45px",
                5: "35px",
                6: "30px",
            },
        },
        256: {
            background: "#edcc61",
            color: "#f9f6f2",
            fontSize: {
                3: "55px",
                4: "45px",
                5: "35px",
                6: "30px",
            },
        },
        512: {
            background: "#edc850",
            color: "#f9f6f2",
            fontSize: {
                3: "55px",
                4: "45px",
                5: "35px",
                6: "30px",
            },
        },
        1024: {
            background: "#edc53f",
            color: "#f9f6f2",
            fontSize: {
                3: "45px",
                4: "35px",
                5: "30px",
                6: "25px",
            },
        },
        2048: {
            background: "#edc22e",
            color: "#f9f6f2",
            fontSize: {
                3: "45px",
                4: "35px",
                5: "30px",
                6: "25px",
            },
        },
        4096: {
            background: "#b784cc",
            color: "#f9f6f2",
            fontSize: {
                3: "45px",
                4: "35px",
                5: "30px",
                6: "25px",
            },
        },
        8192: {
            background: "#9a4ebb",
            color: "#f9f6f2",
            fontSize: {
                3: "35px",
                4: "35px",
                5: "25px",
                6: "20px",
            },
        },
        16384: {
            background: "#7b2aad",
            color: "#f9f6f2",
            fontSize: {
                3: "30px",
                4: "30px",
                5: "20px",
                6: "18px",
            },
        },
        32768: {
            background: "#5c0f9a",
            color: "#f9f6f2",
            fontSize: {
                3: "30px",
                4: "30px",
                5: "20px",
                6: "18px",
            },
        },
        65536: {
            background: "#3d0080",
            color: "#f9f6f2",
            fontSize: {
                3: "30px",
                4: "30px",
                5: "20px",
                6: "18px",
            },
        },
        super: {
            background: "#333",
            color: "#f9f6f2",
            fontSize: {
                3: "25px",
                4: "25px",
                5: "18px",
                6: "16px",
            },
        },
    }

    let grid = []
    let score = 0
    let bestScore = await getGlobalBestScore() || 0
    let personalBest = 0
    let gameOver = false
    let won = false
    let keepPlaying = false
    let gameMode = "classic"
    let boardSize = Number.parseInt(localStorage.getItem("boardSize") || "4")
    let timerInterval = null
    let timeLeft = 120
    let obstacles = []
    let animationInProgress = false
    let playerName = localStorage.getItem("playerName") || "Игрок"
    let gameStartTime = new Date().toISOString()
    let gameEndTime = null
    let leaderboard = []

    async function initializeGameSettings() {
        boardSizeSelect.value = boardSize.toString()
        leaderboard = await getLeaderboard()
        bestScoreDisplay.textContent = bestScore
    }

    await initializeGameSettings()
    boardSizeSelect.value = boardSize.toString()
    startClassicBtn.addEventListener("click", () => {
        gameMode = "classic"
        boardSize = Number.parseInt(boardSizeSelect.value)
        localStorage.setItem("boardSize", boardSize)
        startGame()
        showGame()
    })

    startTimeAttackBtn.addEventListener("click", () => {
        gameMode = "timeAttack"
        boardSize = Number.parseInt(boardSizeSelect.value)
        localStorage.setItem("boardSize", boardSize)
        startGame()
        showGame()
        startTimer()
    })

    startObstaclesBtn.addEventListener("click", () => {
        gameMode = "obstacles"
        boardSize = Number.parseInt(boardSizeSelect.value)
        localStorage.setItem("boardSize", boardSize)
        startGame()
        showGame()
    })

    showLeaderboardBtn.addEventListener("click", () => {
        gameMenu.classList.add("hidden")
        leaderboardScreen.classList.remove("hidden")
        updateLeaderboardDisplay()
    })

    howToPlayBtn.addEventListener("click", () => {
        gameMenu.classList.add("hidden")
        instructions.classList.remove("hidden")
    })

    backToMenuFromInstructionsBtn.addEventListener("click", () => {
        instructions.classList.add("hidden")
        gameMenu.classList.remove("hidden")
    })

    backToMenuFromLeaderboardBtn.addEventListener("click", () => {
        leaderboardScreen.classList.add("hidden")
        gameMenu.classList.remove("hidden")
    })

    backToMenuFromGameBtn.addEventListener("click", () => {
        gameMessage.classList.add("hidden")
        gameContainer.classList.add("hidden")
        gameMenu.classList.remove("hidden")
        stopTimer()
    })

    menuButton.addEventListener("click", () => {
        stopTimer()
        gameContainer.classList.add("hidden")
        gameMenu.classList.remove("hidden")
    })

    newGameBtn.addEventListener("click", () => {
        startGame()
    })

    tryAgainBtn.addEventListener("click", () => {
        startGame()
    })

    keepPlayingBtn.addEventListener("click", () => {
        keepPlaying = true
        gameMessage.classList.add("hidden")
    })

    boardSizeSelect.addEventListener("change", () => {
        boardSize = Number.parseInt(boardSizeSelect.value)
        localStorage.setItem("boardSize", boardSize)
    })

    leaderboardModeSelect.addEventListener("change", updateLeaderboardDisplay)
    leaderboardSizeSelect.addEventListener("change", updateLeaderboardDisplay)
    leaderboardSortSelect.addEventListener("change", updateLeaderboardDisplay)
    leaderboardLimitSelect.addEventListener("change", updateLeaderboardDisplay)

    function updateScore() {
        scoreDisplay.textContent = score

        if (score > personalBest) {
            personalBest = score
            personalBestDisplay.textContent = personalBest
        } else {
            personalBestDisplay.textContent = personalBest
        }

        if (score > bestScore) {
            bestScore = score
            bestScoreDisplay.textContent = bestScore
        } else {
            bestScoreDisplay.textContent = bestScore
        }
    }

    async function updateScores() {
        let oldPersonalBest =  await getPersonalBestScore(playerName) || 0
        let oldGlobalBest = await getGlobalBestScore() || 0
        personalBest = oldPersonalBest > personalBest ? oldPersonalBest : personalBest
        bestScore = oldGlobalBest > bestScore ? oldGlobalBest : bestScore
        personalBestDisplay.textContent = personalBest
        bestScoreDisplay.textContent = bestScore
        await setGlobalBestScore(bestScore)
        await setPersonalBestScore(playerName, personalBest)
    }

    saveScoreBtn.addEventListener("click", async () => {
        const name = playerNameInput.value.trim() || "Игрок"
        playerName = name
        updateScores()
        await addScore({name, score, mode: gameMode, size: boardSize, date: gameStartTime})

        nameInputDialog.classList.add("hidden")
        if (!leaderboardScreen.classList.contains("hidden")) {
            await updateLeaderboardDisplay()
        }
    })

    cancelSaveBtn.addEventListener("click", () => {
        nameInputDialog.classList.add("hidden")
    })

    function showGame() {
        gameMenu.classList.add("hidden")
        gameContainer.classList.remove("hidden")
    }

    function startGame() {
        grid = createEmptyGrid()
        score = 0
        gameOver = false
        won = false
        keepPlaying = false
        gameStartTime = new Date()
        gameEndTime = null
        updateScore()
        updateScores()
        if (gameMode === "timeAttack") {
            timeLeft = 120
            updateTimer()
            timerContainer.classList.remove("hidden")
            stopTimer()
            startTimer()
        } else {
            timerContainer.classList.add("hidden")
            stopTimer()
        }

        clearObstacles()
        createGrid()
        if (gameMode === "obstacles") {
            addObstacles()
        }

        clearTiles()
        gameMessage.classList.add("hidden")

        addRandomTile()
        addRandomTile()
    }

    function createEmptyGrid() {
        const newGrid = []
        for (let i = 0; i < boardSize; i++) {
            newGrid[i] = []
            for (let j = 0; j < boardSize; j++) {
                newGrid[i][j] = 0
            }
        }
        return newGrid
    }

    function createGrid() {
        const gridContainer = document.querySelector(".grid-container")
        gridContainer.innerHTML = ""
        const gameBoard = document.querySelector(".game-board")
        gameBoard.className = `game-board board-size-${boardSize}`
        gridContainer.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`
        gridContainer.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement("div")
                cell.className = "grid-cell"
                cell.setAttribute("data-row", i)
                cell.setAttribute("data-col", j)
                gridContainer.appendChild(cell)
            }
        }
    }

    function addObstacles() {
        const numObstacles = Math.floor((boardSize * boardSize) / 5)
        obstacles = []
        for (let i = 0; i < numObstacles; i++) {
            let row, col
            do {
                row = Math.floor(Math.random() * boardSize)
                col = Math.floor(Math.random() * boardSize)
            } while (grid[row][col] !== 0 || isObstacle(row, col))

            obstacles.push({row, col})
            const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`)
            if (cell) {
                cell.classList.add("obstacle")
            }
        }
    }

    function clearObstacles() {
        obstacles = []
        document.querySelectorAll(".grid-cell.obstacle").forEach((cell) => {
            cell.classList.remove("obstacle")
        })
    }

    function isObstacle(row, col) {
        return obstacles.some((obs) => obs.row === row && obs.col === col)
    }

    function addRandomTile() {
        if (isFull()) return

        const emptyCells = []
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (grid[i][j] === 0 && !isObstacle(i, j)) {
                    emptyCells.push({row: i, col: j})
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
            const value = Math.random() < 0.9 ? 2 : 4
            grid[randomCell.row][randomCell.col] = value

            createTileElement(randomCell.row, randomCell.col, value, true)
        }
    }

    function createTileElement(row, col, value, isNew = false, isMerged = false) {
        const tile = document.createElement("div")
        tile.className = "tile"
        if (isNew) tile.classList.add("new")
        if (isMerged) tile.classList.add("merged")

        const config = value > 65536 ? tileConfig.super : tileConfig[value] || tileConfig.super

        tile.style.backgroundColor = config.background
        tile.style.color = config.color
        tile.style.fontSize = config.fontSize[boardSize]

        tile.textContent = value
        tile.setAttribute("data-row", row)
        tile.setAttribute("data-col", col)
        tile.setAttribute("data-value", value)

        positionTile(tile, row, col)

        tileContainer.appendChild(tile)
        return tile
    }

    function positionTile(tile, row, col) {
        const gap = 10
        const cellSize = (470 - gap * (boardSize - 1)) / boardSize

        const top = row * (cellSize + gap)
        const left = col * (cellSize + gap)
        const size = cellSize

        tile.style.top = `${top}px`
        tile.style.left = `${left}px`
        tile.style.width = `${size}px`
        tile.style.height = `${size}px`
    }

    function clearTiles() {
        tileContainer.innerHTML = ""
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval)

        timerInterval = setInterval(() => {
            timeLeft--
            updateTimer()

            if (timeLeft <= 0) {
                stopTimer()
                gameOver = true
                gameEndTime = new Date()
                showGameOver("Время вышло!")
                showNameInputDialog()
            }
        }, 1000)
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
        }
    }

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60)
        const seconds = timeLeft % 60
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    function isFull() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (grid[i][j] === 0 && !isObstacle(i, j)) {
                    return false
                }
            }
        }
        return true
    }

    function isGameOver() {
        if (!isFull()) return false
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize - 1; j++) {
                if (isObstacle(i, j) || isObstacle(i, j + 1)) continue
                if (grid[i][j] === grid[i][j + 1] && grid[i][j] !== 0) {
                    return false
                }
            }
        }

        for (let j = 0; j < boardSize; j++) {
            for (let i = 0; i < boardSize - 1; i++) {
                if (isObstacle(i, j) || isObstacle(i + 1, j)) continue
                if (grid[i][j] === grid[i + 1][j] && grid[i][j] !== 0) {
                    return false
                }
            }
        }

        return true
    }

    function renderGrid(previousPositions = null) {
        if (previousPositions) {
            animationInProgress = true

            const tiles = Array.from(tileContainer.querySelectorAll(".tile"))
            const tilesToMerge = []
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    if (grid[i][j] !== 0) {
                        const value = grid[i][j]
                        const prevPositions = previousPositions.filter((pos) => pos.newRow === i && pos.newCol === j)

                        if (prevPositions.length === 1) {
                            const prevPos = prevPositions[0]
                            const tile = tiles.find(
                                (t) =>
                                    Number.parseInt(t.getAttribute("data-row")) === prevPos.oldRow &&
                                    Number.parseInt(t.getAttribute("data-col")) === prevPos.oldCol &&
                                    Number.parseInt(t.getAttribute("data-value")) === prevPos.value,
                            )
                            if (tile) {
                                tile.setAttribute("data-row", i)
                                tile.setAttribute("data-col", j)
                                positionTile(tile, i, j)
                                if (prevPos.merged) {
                                    tilesToMerge.push({
                                        row: i,
                                        col: j,
                                        value: value / 2,
                                    })
                                }
                            }
                        } else if (prevPositions.length === 2) {
                            for (const prevPos of prevPositions) {
                                const tile = tiles.find(
                                    (t) =>
                                        Number.parseInt(t.getAttribute("data-row")) === prevPos.oldRow &&
                                        Number.parseInt(t.getAttribute("data-col")) === prevPos.oldCol &&
                                        Number.parseInt(t.getAttribute("data-value")) === prevPos.value,
                                )

                                if (tile) {
                                    tile.setAttribute("data-row", i)
                                    tile.setAttribute("data-col", j)
                                    positionTile(tile, i, j)
                                    tilesToMerge.push({
                                        element: tile,
                                        row: i,
                                        col: j,
                                        value: prevPos.value,
                                    })
                                }
                            }
                        }
                    }
                }
            }
            setTimeout(() => {
                for (const mergeInfo of tilesToMerge) {
                    const tilesAtPosition = Array.from(tileContainer.querySelectorAll(".tile")).filter(
                        (t) =>
                            Number.parseInt(t.getAttribute("data-row")) === mergeInfo.row &&
                            Number.parseInt(t.getAttribute("data-col")) === mergeInfo.col,
                    )
                    if (tilesAtPosition.length > 1) {
                        const keptTile = tilesAtPosition[0]
                        const newValue = grid[mergeInfo.row][mergeInfo.col]
                        keptTile.textContent = newValue
                        keptTile.setAttribute("data-value", newValue)

                        const config = newValue > 65536 ? tileConfig.super : tileConfig[newValue] || tileConfig.super
                        keptTile.style.backgroundColor = config.background
                        keptTile.style.color = config.color
                        keptTile.style.fontSize = config.fontSize[boardSize]

                        keptTile.classList.add("merged")

                        for (let i = 1; i < tilesAtPosition.length; i++) {
                            tilesAtPosition[i].remove()
                        }
                    }
                }

                setTimeout(() => {
                    clearTiles()
                    for (let i = 0; i < boardSize; i++) {
                        for (let j = 0; j < boardSize; j++) {
                            if (grid[i][j] !== 0) {
                                createTileElement(i, j, grid[i][j])
                            }
                        }
                    }
                    addRandomTile()

                    if (isGameOver()) {
                        gameOver = true
                        gameEndTime = new Date()
                        showGameOver()
                        showNameInputDialog()
                    }

                    animationInProgress = false
                }, 200)
            }, 150)
        } else {
            clearTiles()
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    if (grid[i][j] !== 0) {
                        createTileElement(i, j, grid[i][j])
                    }
                }
            }
        }
    }

    function moveTiles(direction) {
        if (gameOver && !keepPlaying) return false
        if (animationInProgress) return false

        const previousGrid = JSON.parse(JSON.stringify(grid))

        const tileMovements = []

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (previousGrid[i][j] !== 0) {
                    tileMovements.push({
                        value: previousGrid[i][j],
                        oldRow: i,
                        oldCol: j,
                        newRow: i,
                        newCol: j,
                        merged: false,
                    })
                }
            }
        }

        let moved = false

        switch (direction) {
            case "up":
                moved = moveUp(tileMovements)
                break
            case "right":
                moved = moveRight(tileMovements)
                break
            case "down":
                moved = moveDown(tileMovements)
                break
            case "left":
                moved = moveLeft(tileMovements)
                break
        }

        if (moved) {
            renderGrid(tileMovements)
            updateScore()

            checkWinCondition()
        }

        return moved
    }

    function handleMerge(row, col, direction, merged, tileMovements, originalValue) {
        const directions = {
            left: {x: 0, y: -1},
            right: {x: 0, y: 1},
            up: {x: -1, y: 0},
            down: {x: 1, y: 0}
        };

        const dir = directions[direction];
        const newRow = row + dir.x;
        const newCol = col + dir.y;

        if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) return false;
        if (grid[newRow][newCol] !== grid[row][col]) return false;
        if (merged[newRow][newCol]) return false;

        const mergingTile = tileMovements.find(t =>
            t.newRow === row &&
            t.newCol === col &&
            t.value === originalValue
        );

        if (mergingTile) {
            mergingTile.newRow = newRow;
            mergingTile.newCol = newCol;
            mergingTile.merged = true;
        }

        const targetTile = tileMovements.find(t =>
            t.newRow === newRow &&
            t.newCol === newCol &&
            t.value === grid[newRow][newCol]
        );

        if (targetTile) targetTile.merged = true;

        grid[newRow][newCol] *= 2;
        grid[row][col] = 0;
        score += grid[newRow][newCol];
        merged[newRow][newCol] = true;

        return true;
    }

    function moveRight(tileMovements) {
        let moved = false;
        const merged = Array.from({length: boardSize}, () =>
            Array(boardSize).fill(false)
        );

        for (let i = 0; i < boardSize; i++) {
            for (let j = boardSize - 2; j >= 0; j--) {
                if (grid[i][j] === 0) continue;

                let newJ = j;
                const originalValue = grid[i][j];

                while (newJ < boardSize - 1 &&
                grid[i][newJ + 1] === 0 &&
                !isObstacle(i, newJ + 1)) {
                    grid[i][newJ + 1] = grid[i][newJ];
                    grid[i][newJ] = 0;
                    newJ++;
                    moved = true;
                }

                const tileIndex = tileMovements.findIndex(t =>
                    t.newRow === i &&
                    t.newCol === j &&
                    t.value === originalValue
                );

                if (tileIndex !== -1) {
                    tileMovements[tileIndex].newCol = newJ;
                }

                if (handleMerge(i, newJ, 'right', merged, tileMovements, originalValue)) {
                    moved = true;
                    newJ++;
                }
            }
        }
        return moved;
    }

    function moveLeft(tileMovements) {
        let moved = false;
        const merged = Array.from({length: boardSize}, () =>
            Array(boardSize).fill(false)
        );

        for (let i = 0; i < boardSize; i++) {
            for (let j = 1; j < boardSize; j++) {
                if (grid[i][j] === 0) continue;

                let newJ = j;
                const originalValue = grid[i][j];

                while (newJ > 0 &&
                grid[i][newJ - 1] === 0 &&
                !isObstacle(i, newJ - 1)) {
                    grid[i][newJ - 1] = grid[i][newJ];
                    grid[i][newJ] = 0;
                    newJ--;
                    moved = true;
                }

                const tileIndex = tileMovements.findIndex(t =>
                    t.newRow === i &&
                    t.newCol === j &&
                    t.value === originalValue
                );

                if (tileIndex !== -1) {
                    tileMovements[tileIndex].newCol = newJ;
                }

                if (handleMerge(i, newJ, 'left', merged, tileMovements, originalValue)) {
                    moved = true;
                    newJ--;
                }
            }
        }
        return moved;
    }

    function moveDown(tileMovements) {
        let moved = false;
        const merged = Array.from({length: boardSize}, () =>
            Array(boardSize).fill(false)
        );

        for (let j = 0; j < boardSize; j++) {
            for (let i = boardSize - 2; i >= 0; i--) {
                if (grid[i][j] === 0) continue;

                let newI = i;
                const originalValue = grid[i][j];

                while (newI < boardSize - 1 &&
                grid[newI + 1][j] === 0 &&
                !isObstacle(newI + 1, j)) {
                    grid[newI + 1][j] = grid[newI][j];
                    grid[newI][j] = 0;
                    newI++;
                    moved = true;
                }

                const tileIndex = tileMovements.findIndex(t =>
                    t.newRow === i &&
                    t.newCol === j &&
                    t.value === originalValue
                );

                if (tileIndex !== -1) {
                    tileMovements[tileIndex].newRow = newI;
                }

                if (handleMerge(newI, j, 'down', merged, tileMovements, originalValue)) {
                    moved = true;
                    newI++;
                }
            }
        }
        return moved;
    }

    function moveUp(tileMovements) {
        let moved = false;
        const merged = Array.from({length: boardSize}, () =>
            Array(boardSize).fill(false)
        );

        for (let j = 0; j < boardSize; j++) {
            for (let i = 1; i < boardSize; i++) {
                if (grid[i][j] === 0) continue;

                let newI = i;
                const originalValue = grid[i][j];

                while (newI > 0 &&
                grid[newI - 1][j] === 0 &&
                !isObstacle(newI - 1, j)) {
                    grid[newI - 1][j] = grid[newI][j];
                    grid[newI][j] = 0;
                    newI--;
                    moved = true;
                }

                const tileIndex = tileMovements.findIndex(t =>
                    t.newRow === i &&
                    t.newCol === j &&
                    t.value === originalValue
                );

                if (tileIndex !== -1) {
                    tileMovements[tileIndex].newRow = newI;
                }

                if (handleMerge(newI, j, 'up', merged, tileMovements, originalValue)) {
                    moved = true;
                    newI--;
                }
            }
        }
        return moved;
    }

    function checkWinCondition() {
        if (won && !keepPlaying) return

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (grid[i][j] === 2048 && !won) {
                    won = true
                    if (!keepPlaying) {
                        showWin()
                    }
                    return
                }
            }
        }
    }

    function showWin() {
        gameMessageText.textContent = "Вы достигли 2048!"
        gameMessage.classList.remove("hidden")
        keepPlayingBtn.classList.remove("hidden")
        gameEndTime = new Date()
        showNameInputDialog()
    }

    function showGameOver(message = "Игра окончена!") {
        gameMessageText.textContent = message
        gameMessage.classList.remove("hidden")
        keepPlayingBtn.classList.add("hidden")
        stopTimer()
    }

    function showNameInputDialog() {
        finalScoreDisplay.textContent = score
        playerNameInput.value = playerName
        nameInputDialog.classList.remove("hidden")
        playerNameInput.focus()
    }

    async function getGlobalBestScore() {
        try {
            const response = await fetch('/api/score/global')
            if (!response.ok) throw new Error("Failed to fetch global best score")
            return await response.json().then((value) => {
                console.log("global", value)
                if (Object.keys(value).length !== 0) {
                    return value.value
                }
                return 0
            })
        } catch (error) {
            console.error("getBestScore error:", error)
            return 0
        }
    }

    async function getPersonalBestScore(name) {
        try {
            const params = new URLSearchParams({name:name})
            const response = await fetch(`/api/score/user?${params}`)
            if (!response.ok) throw new Error("Failed to fetch personal best score")
            return await response.json().then((value) => {
                console.log("personal", value)
                if (Object.keys(value).length !== 0) {
                    return value.value
                }
                return 0
            })
        } catch (error) {
            console.error("getPersonalBest error:", error)
            return 0
        }
    }

    async function setGlobalBestScore(score) {
        try {
            console.log("set global", score)
            const response = await fetch("/api/score/global", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({score:score}),
            })

            if (!response.ok) throw new Error("Failed to add global best score")
            return await response.json()
        } catch (error) {
            console.error("addScore error:", error)
            return {success: false, error: error.message}
        }
    }

    async function setPersonalBestScore(name, score) {
        try {
            console.log("set personal", name, score)
            const response = await fetch("/api/score/user", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name:name, score:score}),
            })
            if (!response.ok) throw new Error("Failed to add best personal score")
            return await response.json()
        } catch (error) {
            console.error("addScore error:", error)
            return {success: false, error: error.message}
        }
    }

    async function getLeaderboard(mode = "all", size = "all", limit = 50) {
        try {
            const params = new URLSearchParams({
                mode,
                size,
                limit: limit.toString(),
            })

            const response = await fetch(`/api/leaderboard?${params}`)
            if (!response.ok) throw new Error("Failed to fetch leaderboard")

            return await response.json()
        } catch (error) {
            console.error("getLeaderboard error:", error)
            return []
        }
    }


    async function addScore({name, score, mode, size, date}) {
        try {
            const response = await fetch("/api/leaderboard", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name:name, score:score, mode:mode, size:size, date:date, token:"token_ot_debilov"}),
            })
            if (!response.ok) throw new Error("Failed to add score")
            return await response.json()
        } catch (error) {
            console.error("addScore error:", error)
            return {success: false, error: error.message}
        }
    }

    async function updateLeaderboardDisplay() {
        const modeFilter = leaderboardModeSelect.value
        const sizeFilter = leaderboardSizeSelect.value
        const sortBy = leaderboardSortSelect.value
        const limit = Number.parseInt(leaderboardLimitSelect.value)

        leaderboard = await getLeaderboard()

        let filteredEntries = [...leaderboard]
        if (modeFilter !== "all") {
            filteredEntries = filteredEntries.filter((entry) => entry.mode === modeFilter)
        }
        if (sizeFilter !== "all") {
            filteredEntries = filteredEntries.filter((entry) => entry.size === Number.parseInt(sizeFilter))
        }

        if (sortBy === "score") {
            filteredEntries.sort((a, b) => b.score - a.score)
        } else if (sortBy === "time") {
            filteredEntries.sort((a, b) => {
                return new Date(b.date) - new Date(a.date)
            })
        }

        if (limit > 0) {
            filteredEntries = filteredEntries.slice(0, limit)
        }
        leaderboardTableBody.innerHTML = ""

        if (filteredEntries.length === 0) {
            noRecordsMessage.classList.remove("hidden")
        } else {
            noRecordsMessage.classList.add("hidden")

            filteredEntries.forEach((entry, index) => {
                const row = document.createElement("tr")

                const date = new Date(entry.date)
                const formattedDate = date.toLocaleString()

                let modeName = ""
                switch (entry.mode) {
                    case "classic":
                        modeName = "Классический"
                        break
                    case "timeAttack":
                        modeName = "На время"
                        break
                    case "obstacles":
                        modeName = "С препятствиями"
                        break
                    default:
                        modeName = entry.mode
                }

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.name}</td>
                    <td>${entry.score}</td>
                    <td>${modeName}</td>
                    <td>${entry.size}×${entry.size}</td>
                    <td>${formattedDate}</td>
                `

                leaderboardTableBody.appendChild(row)
            })
        }
    }

    document.addEventListener("keydown", (e) => {
        if (gameContainer.classList.contains("hidden")) return
        if (nameInputDialog.classList.contains("hidden") === false) return

        switch (e.key) {
            case "ArrowUp":
                e.preventDefault()
                moveTiles("up")
                break
            case "ArrowRight":
                e.preventDefault()
                moveTiles("right")
                break
            case "ArrowDown":
                e.preventDefault()
                moveTiles("down")
                break
            case "ArrowLeft":
                e.preventDefault()
                moveTiles("left")
                break
            case "Enter":
                if (gameOver) {
                    startGame()
                }
                break
        }
    })
    playerNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveScoreBtn.click()
        }
    })
    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0

    document.addEventListener(
        "touchstart",
        (e) => {
            if (gameContainer.classList.contains("hidden")) return
            if (nameInputDialog.classList.contains("hidden") === false) return

            touchStartX = e.touches[0].clientX
            touchStartY = e.touches[0].clientY
        },
        false,
    )

    document.addEventListener(
        "touchmove",
        (e) => {
            e.preventDefault()
        },
        {passive: false},
    )

    document.addEventListener(
        "touchend",
        (e) => {
            if (gameContainer.classList.contains("hidden")) return
            if (nameInputDialog.classList.contains("hidden") === false) return

            touchEndX = e.changedTouches[0].clientX
            touchEndY = e.changedTouches[0].clientY

            handleSwipe()
        },
        false,
    )

    function handleSwipe() {
        const xDiff = touchEndX - touchStartX
        const yDiff = touchEndY - touchStartY

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                moveTiles("right")
            } else {
                moveTiles("left")
            }
        } else {
            if (yDiff > 0) {
                moveTiles("down")
            } else {
                moveTiles("up")
            }
        }
    }
    bestScoreDisplay.textContent = bestScore
})
