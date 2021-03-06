class Maze {
	rows;
	columns;
	cell_length;
	all_cells = [];

	constructor(cell_length, width, height) {
		this.SetSize(cell_length, width, height);
	}

	clearCache() {
		this.all_cells = undefined;
	}

	SetSize(cell_length, width, height) {
		this.cell_length = floor(cell_length);
		this.columns = floor(width / cell_length);
		this.rows = floor(height / cell_length);
	}

	Render(cell_color, wall_color) {
		for (let i = 0; i < this.all_cells.length; i++) {
			this.all_cells[i].Show(wall_color, cell_color);
		}
	}

	Generate(start_point) {
		this.all_cells = [];
		let stack = [];
		let visited_cells = [];
		this.AddAllCellsToMaze();
		let current_cell = this.all_cells[0];

		if (start_point) {
			current_cell = this.GetCellByCoordinate(start_point.x, start_point.y);
		}

		do {
			visited_cells.push(current_cell);
			let next = current_cell.CheckNeighbors(visited_cells);
			if (next) {
				visited_cells.push(next);
				stack.push(current_cell);
				this.ConnectNeighbours(current_cell, next);
				current_cell = next;
			} else {
				current_cell = stack.pop();
			}
		} while (stack.length > 0);
	}

	ConnectNeighbours(currentCell, neighbourCell) {
		if (!currentCell || !neighbourCell) return;
		//Remove the walls to connect the cells(set the target side of the wall to value: False)
		const bisectorOfDisplacement = createVector(
			currentCell.absolute_v.y - neighbourCell.absolute_v.y,
			neighbourCell.absolute_v.x - currentCell.absolute_v.x
		);
		for (let i = 0; i < currentCell.walls.length; i++) {
			const wallVetices = currentCell.walls[i].vertices;
			let wall_vector = p5.Vector.sub(wallVetices.vertexOne, wallVetices.vertexTwo);
			if (wall_vector.dist(bisectorOfDisplacement) <= 0.1) {
				neighbourCell.walls[i].is_active = false;
				let j = i + currentCell.walls.length / 2;
				if (i >= currentCell.walls.length / 2) {
					j -= currentCell.walls.length;
				}
				currentCell.walls[j].is_active = false;
			}
		}
	}

	AddAllCellsToMaze() {
		//Add every single cell in the maze to an array so we can get the cell from that array
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.columns; i++) {
				let cell = new Cell(i, j, this);
				this.all_cells.push(cell);
			}
		}
	}

	GetCellByCoordinate(x, y) {
		if (this.all_cells.length <= 0) {
			console.warn("Maze has no cell !!!");
			return null;
		}
		return this.all_cells[Maze.GetCellIndexByCoordinate(x, y, this)];
	}

	static GetCellIndexByCoordinate(x, y, maze) {
		//There is an array that holds all the cells in the genrated maze, use the coordinate of the cell to get the index of the cell in that array
		if (x < 0 || y < 0 || x > maze.columns - 1 || y > maze.rows - 1) {
			return -1;
		}
		return floor(x) + floor(y) * maze.columns;
	}
}
