document.addEventListener("DOMContentLoaded", async () => {
    // DOM elements
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

    // Tile configuration object
    const tileConfig = {
        // Base tile configurations
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
        // For higher values
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

    // Game variables
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
    let timeLeft = 120 // 2 minutes
    let obstacles = []
    let animationInProgress = false
    let playerName = localStorage.getItem("playerName") || "Игрок"
    let gameStartTime = null
    let gameEndTime = null
    let leaderboard = []

    async function initializeGameSettings() {
        boardSizeSelect.value = boardSize.toString()
        leaderboard = await getLeaderboard()
        bestScoreDisplay.textContent = bestScore
    }

    await initializeGameSettings()

    // Set initial board size from localStorage
    boardSizeSelect.value = boardSize.toString()

    // Menu navigation
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

    // Board size change
    boardSizeSelect.addEventListener("change", () => {
        boardSize = Number.parseInt(boardSizeSelect.value)
        localStorage.setItem("boardSize", boardSize)
    })

    // Leaderboard controls
    leaderboardModeSelect.addEventListener("change", updateLeaderboardDisplay)
    leaderboardSizeSelect.addEventListener("change", updateLeaderboardDisplay)
    leaderboardSortSelect.addEventListener("change", updateLeaderboardDisplay)
    leaderboardLimitSelect.addEventListener("change", updateLeaderboardDisplay)

    function updateScore() {
        scoreDisplay.textContent = score

        if (score > personalBest) {
            personalBest = score
            personalBestDisplay.textContent = personalBest
            setPersonalBestScore(playerName, score)
        } else {
            personalBestDisplay.textContent = personalBest
        }

        if (score > bestScore) {
            bestScore = score
            bestScoreDisplay.textContent = bestScore
            setGlobalBestScore(bestScore)
        } else {
            bestScoreDisplay.textContent = bestScore
        }
    }

    // Update personal best score for current game mode and size
    async function updatePersonalBest() {
        // Get personal best for current mode and size
        personalBest = await getPersonalBest(gameMode, boardSize)
        personalBestDisplay.textContent = personalBest
    }

    // Get personal best score for a specific game mode and board size
    async function getPersonalBest(mode, size) {
        const specificBest = await getPersonalBestScore(playerName)
        if (specificBest !== null) {
            return specificBest
        }

        // Otherwise filter leaderboard entries
        const playerEntries = leaderboard.filter(
            (entry) => entry.mode === mode && entry.size === size && entry.name === playerName,
        )

        // Sort by score in descending order
        playerEntries.sort((a, b) => b.score - a.score)

        // Return the highest score or 0 if no entries
        return playerEntries.length > 0 ? playerEntries[0].score : 0
    }


    // Name input dialog
    saveScoreBtn.addEventListener("click", async () => {
        const name = playerNameInput.value.trim() || "Игрок"
        playerName = name

        // Add score to leaderboard
        await addScore({name, score, gameMode, boardSize, gameStartTime, gameEndTime})

        // Hide dialog
        nameInputDialog.classList.add("hidden")

        // Update leaderboard display if visible
        if (!leaderboardScreen.classList.contains("hidden")) {
            await updateLeaderboardDisplay()
        }
    })

    cancelSaveBtn.addEventListener("click", () => {
        nameInputDialog.classList.add("hidden")
    })

    // Show the game board
    function showGame() {
        gameMenu.classList.add("hidden")
        gameContainer.classList.remove("hidden")
    }

    // Initialize the game
    function startGame() {
        // Reset game state
        grid = createEmptyGrid()
        score = 0
        gameOver = false
        won = false
        keepPlaying = false
        gameStartTime = new Date()
        gameEndTime = null

        // Update personal best for current mode and size
        updatePersonalBest()

        // Reset timer if in time attack mode
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

        // Clear obstacles
        clearObstacles()

        // Create the grid based on board size
        createGrid()

        // Add obstacles if in obstacles mode
        if (gameMode === "obstacles") {
            addObstacles()
        }

        // Update UI
        updateScore()
        clearTiles()
        gameMessage.classList.add("hidden")

        // Add initial tiles
        addRandomTile()
        addRandomTile()
    }

    // Create an empty grid of the specified size
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

    // Create the grid DOM elements
    function createGrid() {
        // Clear existing grid
        const gridContainer = document.querySelector(".grid-container")
        gridContainer.innerHTML = ""

        // Add board size class to game board
        const gameBoard = document.querySelector(".game-board")
        gameBoard.className = `game-board board-size-${boardSize}`

        // Set grid template
        gridContainer.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`
        gridContainer.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`

        // Create cells
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

    // Add obstacles to the grid
    function addObstacles() {
        // Add obstacles based on board size
        const numObstacles = Math.floor((boardSize * boardSize) / 5) // About 20% of cells
        obstacles = []

        for (let i = 0; i < numObstacles; i++) {
            let row, col
            do {
                row = Math.floor(Math.random() * boardSize)
                col = Math.floor(Math.random() * boardSize)
            } while (grid[row][col] !== 0 || isObstacle(row, col))

            obstacles.push({ row, col })

            // Mark the cell as an obstacle
            const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`)
            if (cell) {
                cell.classList.add("obstacle")
            }
        }
    }

    // Clear obstacles
    function clearObstacles() {
        obstacles = []
        document.querySelectorAll(".grid-cell.obstacle").forEach((cell) => {
            cell.classList.remove("obstacle")
        })
    }

    // Check if a cell is an obstacle
    function isObstacle(row, col) {
        return obstacles.some((obs) => obs.row === row && obs.col === col)
    }

    // Add a random tile (2 or 4) to an empty cell
    function addRandomTile() {
        if (isFull()) return

        const emptyCells = []
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (grid[i][j] === 0 && !isObstacle(i, j)) {
                    emptyCells.push({ row: i, col: j })
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
            const value = Math.random() < 0.9 ? 2 : 4
            grid[randomCell.row][randomCell.col] = value

            // Create tile element with 'new' animation
            createTileElement(randomCell.row, randomCell.col, value, true)
        }
    }

    // Create a tile DOM element with styles from tileConfig
    function createTileElement(row, col, value, isNew = false, isMerged = false) {
        const tile = document.createElement("div")
        tile.className = "tile"
        if (isNew) tile.classList.add("new")
        if (isMerged) tile.classList.add("merged")

        // Get tile configuration
        const config = value > 65536 ? tileConfig.super : tileConfig[value] || tileConfig.super

        // Apply styles from configuration
        tile.style.backgroundColor = config.background
        tile.style.color = config.color
        tile.style.fontSize = config.fontSize[boardSize]

        tile.textContent = value
        tile.setAttribute("data-row", row)
        tile.setAttribute("data-col", col)
        tile.setAttribute("data-value", value)

        // Position the tile
        positionTile(tile, row, col)

        tileContainer.appendChild(tile)
        return tile
    }

    // Position a tile on the grid
    function positionTile(tile, row, col) {
        // Calculate position based on grid layout
        const gap = 10// Gap between cells (10px total)
        const cellSize = (470 - gap * (boardSize - 1)) / boardSize// Percentage of container

        // Calculate position including gaps
        const top = row * (cellSize + gap)
        const left = col * (cellSize + gap)

        // Calculate size (accounting for gaps)
        const size = cellSize

        tile.style.top = `${top}px`
        tile.style.left = `${left}px`
        tile.style.width = `${size}px`
        tile.style.height = `${size}px`
    }

    // Clear all tiles from the board
    function clearTiles() {
        tileContainer.innerHTML = ""
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
        }
    }

    // Update the timer display
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60)
        const seconds = timeLeft % 60
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    // Check if the grid is full
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

    // Check if any moves are possible
    function isGameOver() {
        // Check for empty cells
        if (!isFull()) return false

        // Check for possible merges horizontally
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize - 1; j++) {
                // Skip obstacles
                if (isObstacle(i, j) || isObstacle(i, j + 1)) continue

                // Check if adjacent cells have the same value
                if (grid[i][j] === grid[i][j + 1] && grid[i][j] !== 0) {
                    return false
                }
            }
        }

        // Check for possible merges vertically
        for (let j = 0; j < boardSize; j++) {
            for (let i = 0; i < boardSize - 1; i++) {
                // Skip obstacles
                if (isObstacle(i, j) || isObstacle(i + 1, j)) continue

                // Check if adjacent cells have the same value
                if (grid[i][j] === grid[i + 1][j] && grid[i][j] !== 0) {
                    return false
                }
            }
        }

        return true
    }

    // Render the current state of the grid with animations
    function renderGrid(previousPositions = null) {
        // If we have previous positions, animate the movement
        if (previousPositions) {
            animationInProgress = true

            // Get all current tiles
            const tiles = Array.from(tileContainer.querySelectorAll(".tile"))
            const tilesToMerge = []

            // First phase: Move tiles to their new positions
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    if (grid[i][j] !== 0) {
                        const value = grid[i][j]
                        const prevPositions = previousPositions.filter((pos) => pos.newRow === i && pos.newCol === j)

                        if (prevPositions.length === 1) {
                            // Single tile moved to this position
                            const prevPos = prevPositions[0]

                            // Find the tile element
                            const tile = tiles.find(
                                (t) =>
                                    Number.parseInt(t.getAttribute("data-row")) === prevPos.oldRow &&
                                    Number.parseInt(t.getAttribute("data-col")) === prevPos.oldCol &&
                                    Number.parseInt(t.getAttribute("data-value")) === prevPos.value,
                            )

                            if (tile) {
                                // Update data attributes
                                tile.setAttribute("data-row", i)
                                tile.setAttribute("data-col", j)

                                // Animate to new position
                                positionTile(tile, i, j)

                                // If this tile should be merged later, track it
                                if (prevPos.merged) {
                                    tilesToMerge.push({
                                        row: i,
                                        col: j,
                                        value: value / 2, // The original value before merging
                                    })
                                }
                            }
                        } else if (prevPositions.length === 2) {
                            // Two tiles merged into this position
                            // Find both tiles
                            for (const prevPos of prevPositions) {
                                const tile = tiles.find(
                                    (t) =>
                                        Number.parseInt(t.getAttribute("data-row")) === prevPos.oldRow &&
                                        Number.parseInt(t.getAttribute("data-col")) === prevPos.oldCol &&
                                        Number.parseInt(t.getAttribute("data-value")) === prevPos.value,
                                )

                                if (tile) {
                                    // Update data attributes
                                    tile.setAttribute("data-row", i)
                                    tile.setAttribute("data-col", j)

                                    // Animate to new position
                                    positionTile(tile, i, j)

                                    // Add to merge list
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

            // After the first phase of movement completes, handle merges
            setTimeout(() => {
                // Second phase: Merge tiles
                for (const mergeInfo of tilesToMerge) {
                    // For tiles that need to be merged, we'll remove all but one
                    const tilesAtPosition = Array.from(tileContainer.querySelectorAll(".tile")).filter(
                        (t) =>
                            Number.parseInt(t.getAttribute("data-row")) === mergeInfo.row &&
                            Number.parseInt(t.getAttribute("data-col")) === mergeInfo.col,
                    )

                    // Keep only one tile and update its value
                    if (tilesAtPosition.length > 1) {
                        // Keep the first tile, remove others
                        const keptTile = tilesAtPosition[0]
                        const newValue = grid[mergeInfo.row][mergeInfo.col]
                        keptTile.textContent = newValue
                        keptTile.setAttribute("data-value", newValue)

                        // Update the tile style based on its new value
                        const config = newValue > 65536 ? tileConfig.super : tileConfig[newValue] || tileConfig.super
                        keptTile.style.backgroundColor = config.background
                        keptTile.style.color = config.color
                        keptTile.style.fontSize = config.fontSize[boardSize]

                        // Add merged animation
                        keptTile.classList.add("merged")

                        // Remove other tiles
                        for (let i = 1; i < tilesAtPosition.length; i++) {
                            tilesAtPosition[i].remove()
                        }
                    }
                }

                // After animations complete, clean up and add a new tile
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

                    // Check for game over after adding new tile
                    if (isGameOver()) {
                        gameOver = true
                        gameEndTime = new Date()
                        showGameOver()
                        showNameInputDialog()
                    }

                    animationInProgress = false
                }, 200) // Time for merge animation
            }, 150) // Time for movement animation
        } else {
            // No animations, just render the current state
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

    // Move tiles in a direction
    function moveTiles(direction) {
        if (gameOver && !keepPlaying) return false
        if (animationInProgress) return false

        // Create a copy of the grid to check if it changed
        const previousGrid = JSON.parse(JSON.stringify(grid))

        // Track tile movements for animation
        const tileMovements = []

        // Get current tile positions before moving
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

        // If the grid changed, render with animations
        if (moved) {
            renderGrid(tileMovements)
            updateScore()

            // Check for win condition
            checkWinCondition()
        }

        return moved
    }

    // Move tiles up
    // Универсальная функция для обработки слияний
    function handleMerge(row, col, direction, merged, tileMovements, originalValue) {
        const directions = {
            left:  { x: 0, y: -1 },
            right: { x: 0, y: 1 },
            up:    { x: -1, y: 0 },
            down:  { x: 1, y: 0 }
        };

        const dir = directions[direction];
        const newRow = row + dir.x;
        const newCol = col + dir.y;

        if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) return false;
        if (grid[newRow][newCol] !== grid[row][col]) return false;
        if (merged[newRow][newCol]) return false;

        // Помечаем плитки для анимации
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

        // Выполняем слияние
        grid[newRow][newCol] *= 2;
        grid[row][col] = 0;
        score += grid[newRow][newCol];
        merged[newRow][newCol] = true;

        return true;
    }

// Move Right (Обработка справа налево)
    function moveRight(tileMovements) {
        let moved = false;
        const merged = Array.from({ length: boardSize }, () =>
            Array(boardSize).fill(false)
        );

        for (let i = 0; i < boardSize; i++) {
            // Обрабатываем справа налево
            for (let j = boardSize - 2; j >= 0; j--) {
                if (grid[i][j] === 0) continue;

                let newJ = j;
                const originalValue = grid[i][j];

                // Двигаем плитку вправо
                while (newJ < boardSize - 1 &&
                grid[i][newJ + 1] === 0 &&
                !isObstacle(i, newJ + 1)) {
                    grid[i][newJ + 1] = grid[i][newJ];
                    grid[i][newJ] = 0;
                    newJ++;
                    moved = true;
                }

                // Обновляем позицию для анимации
                const tileIndex = tileMovements.findIndex(t =>
                    t.newRow === i &&
                    t.newCol === j &&
                    t.value === originalValue
                );

                if (tileIndex !== -1) {
                    tileMovements[tileIndex].newCol = newJ;
                }

                // Пытаемся выполнить слияние
                if (handleMerge(i, newJ, 'right', merged, tileMovements, originalValue)) {
                    moved = true;
                    newJ++; // После слияния сдвигаемся ещё правее
                }
            }
        }
        return moved;
    }

// Move Left (Обработка слева направо)
    function moveLeft(tileMovements) {
        let moved = false;
        const merged = Array.from({ length: boardSize }, () =>
            Array(boardSize).fill(false)
        );

        for (let i = 0; i < boardSize; i++) {
            for (let j = 1; j < boardSize; j++) {
                if (grid[i][j] === 0) continue;

                let newJ = j;
                const originalValue = grid[i][j];

                // Двигаем плитку влево
                while (newJ > 0 &&
                grid[i][newJ - 1] === 0 &&
                !isObstacle(i, newJ - 1)) {
                    grid[i][newJ - 1] = grid[i][newJ];
                    grid[i][newJ] = 0;
                    newJ--;
                    moved = true;
                }

                // Обновляем позицию для анимации
                const tileIndex = tileMovements.findIndex(t =>
                    t.newRow === i &&
                    t.newCol === j &&
                    t.value === originalValue
                );

                if (tileIndex !== -1) {
                    tileMovements[tileIndex].newCol = newJ;
                }

                // Пытаемся выполнить слияние
                if (handleMerge(i, newJ, 'left', merged, tileMovements, originalValue)) {
                    moved = true;
                    newJ--; // После слияния сдвигаемся ещё левее
                }
            }
        }
        return moved;
    }

// Move Down (Обработка снизу вверх)
    function moveDown(tileMovements) {
        let moved = false;
        const merged = Array.from({ length: boardSize }, () =>
            Array(boardSize).fill(false)
        );

        for (let j = 0; j < boardSize; j++) {
            for (let i = boardSize - 2; i >= 0; i--) {
                if (grid[i][j] === 0) continue;

                let newI = i;
                const originalValue = grid[i][j];

                // Двигаем плитку вниз
                while (newI < boardSize - 1 &&
                grid[newI + 1][j] === 0 &&
                !isObstacle(newI + 1, j)) {
                    grid[newI + 1][j] = grid[newI][j];
                    grid[newI][j] = 0;
                    newI++;
                    moved = true;
                }

                // Обновляем позицию для анимации
                const tileIndex = tileMovements.findIndex(t =>
                    t.newRow === i &&
                    t.newCol === j &&
                    t.value === originalValue
                );

                if (tileIndex !== -1) {
                    tileMovements[tileIndex].newRow = newI;
                }

                // Пытаемся выполнить слияние
                if (handleMerge(newI, j, 'down', merged, tileMovements, originalValue)) {
                    moved = true;
                    newI++; // После слияния сдвигаемся ещё ниже
                }
            }
        }
        return moved;
    }

// Move Up (Обработка сверху вниз)
    function moveUp(tileMovements) {
        let moved = false;
        const merged = Array.from({ length: boardSize }, () =>
            Array(boardSize).fill(false)
        );

        for (let j = 0; j < boardSize; j++) {
            for (let i = 1; i < boardSize; i++) {
                if (grid[i][j] === 0) continue;

                let newI = i;
                const originalValue = grid[i][j];

                // Двигаем плитку вверх
                while (newI > 0 &&
                grid[newI - 1][j] === 0 &&
                !isObstacle(newI - 1, j)) {
                    grid[newI - 1][j] = grid[newI][j];
                    grid[newI][j] = 0;
                    newI--;
                    moved = true;
                }

                // Обновляем позицию для анимации
                const tileIndex = tileMovements.findIndex(t =>
                    t.newRow === i &&
                    t.newCol === j &&
                    t.value === originalValue
                );

                if (tileIndex !== -1) {
                    tileMovements[tileIndex].newRow = newI;
                }

                // Пытаемся выполнить слияние
                if (handleMerge(newI, j, 'up', merged, tileMovements, originalValue)) {
                    moved = true;
                    newI--; // После слияния сдвигаемся ещё выше
                }
            }
        }
        return moved;
    }

    // Check if the player has won (reached 2048)
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

    // Show win message
    function showWin() {
        gameMessageText.textContent = "Вы достигли 2048!"
        gameMessage.classList.remove("hidden")
        keepPlayingBtn.classList.remove("hidden")
        gameEndTime = new Date()
        showNameInputDialog()
    }

    // Show game over message
    function showGameOver(message = "Игра окончена!") {
        gameMessageText.textContent = message
        gameMessage.classList.remove("hidden")
        keepPlayingBtn.classList.add("hidden")
        stopTimer()
    }

    // Show name input dialog
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
            const score = await response.json()
            if (score) {
                return score
            }
            return 0
        } catch (error) {
            console.error("getBestScore error:", error)
            return 0
        }
    }

    async function getPersonalBestScore(name) {
        try {
            const params = new URLSearchParams({name})
            const response = await fetch(`/api/score/name?${params}`)
            if (!response.ok) throw new Error("Failed to fetch personal best score")
            const score = await response.json()
            if (score) {
                return score
            }
            return 0
        } catch (error) {
            console.error("getPersonalBest error:", error)
            return 0
        }
    }

    async function setGlobalBestScore(score) {
        try {
            const response = await fetch("/api/score/global", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score }),
            })

            if (!response.ok) throw new Error("Failed to add global best score")
            const result = await response.json()
            return result
        } catch (error) {
            console.error("addScore error:", error)
            return { success: false, error: error.message }
        }
    }

    async function setPersonalBestScore(name, score) {
        try {
            const response = await fetch("/api/score/name", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, score }),
            })
            if (!response.ok) throw new Error("Failed to add best personal score")
            const result = await response.json()
            return result
        } catch (error) {
            console.error("addScore error:", error)
            return { success: false, error: error.message }
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


    async function addScore({ name, score, mode, size, date, duration }) {
        try {
            const response = await fetch("/api/leaderboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, score, mode, size, date, duration }),
            })
            console.log(response.json())
            if (!response.ok) throw new Error("Failed to add score")
            return await response.json()
        } catch (error) {
            console.error("addScore error:", error)
            return { success: false, error: error.message }
        }
    }

    // Update the leaderboard display function
    async function updateLeaderboardDisplay() {
        // Get filter values
        const modeFilter = leaderboardModeSelect.value
        const sizeFilter = leaderboardSizeSelect.value
        const sortBy = leaderboardSortSelect.value
        const limit = Number.parseInt(leaderboardLimitSelect.value)

        // Make sure leaderboard is up to date
        leaderboard = await getLeaderboard()

        // Filter entries by mode and size
        let filteredEntries = [...leaderboard]
        if (modeFilter !== "all") {
            filteredEntries = filteredEntries.filter((entry) => entry.mode === modeFilter)
        }
        if (sizeFilter !== "all") {
            filteredEntries = filteredEntries.filter((entry) => entry.size === Number.parseInt(sizeFilter))
        }

        // Sort entries
        if (sortBy === "score") {
            filteredEntries.sort((a, b) => b.score - a.score)
        } else if (sortBy === "time") {
            filteredEntries.sort((a, b) => {
                // Sort by date (newest first)
                return new Date(b.date) - new Date(a.date)
            })
        }

        // Apply limit
        if (limit > 0) {
            filteredEntries = filteredEntries.slice(0, limit)
        }

        // Clear table
        leaderboardTableBody.innerHTML = ""

        // Show message if no entries
        if (filteredEntries.length === 0) {
            noRecordsMessage.classList.remove("hidden")
        } else {
            noRecordsMessage.classList.add("hidden")

            // Add entries to table
            filteredEntries.forEach((entry, index) => {
                const row = document.createElement("tr")

                // Format date
                const date = new Date(entry.date)
                const formattedDate = date.toLocaleString()

                // Format mode name
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

    // Keyboard controls
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

    // Handle Enter key in name input
    playerNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveScoreBtn.click()
        }
    })

    // Touch controls
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
        { passive: false },
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

        // Determine which direction had the greater movement
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

    // Initialize best score from localStorage
    bestScoreDisplay.textContent = bestScore
})
