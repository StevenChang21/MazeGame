class PlayState extends GameState {
	constructor(gameSystem) {
		super(gameSystem);
	}

	start() {
		this.gameSystem.maze.Generate();
		this.gameSystem.player.Spawn();
		// Destination set next to player this.destination = this.gameSystem.maze.GetCellByCoordinate(this.gameSystem.maze.rows_number / 2 + 1, this.gameSystem.maze.columns_number / 2);
		this.destination = this.gameSystem.maze.all_cells[this.gameSystem.maze.all_cells.length - 1];
		classifyDirection(this);
	}

	execute() {
		this.gameSystem.maze.Render(color(244, 162, 97), color(38, 70, 83));
		this.gameSystem.player.Render(color(42, 157, 143));
		this.checkHasWon();
	}

	checkHasWon() {
		this.destination.Show(color(233, 196, 106), color("black"));
		if (this.gameSystem.player.cell_in === this.destination) {
			gameSystem.gameState = new WonState(this.gameSystem);
		}
	}
}
