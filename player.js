class Player{
  cell_in;
  maze;

  constructor(maze){
    this.maze = maze;
  }

  Spawn(spawning_point, maze){
    if(maze){
      this.maze = maze;
    }
    if(spawning_point){
      const cell = maze.GetCellByCoordinate(spawning_point.x, spawning_point.y);
      if(cell){
        this.cell_in = cell;
        return;
      }
      console.warn("Spawned player outside of the maze !!!");
    }
    this.cell_in = this.maze.GetCellByCoordinate(this.maze.rows_number / 2, this.maze.columns_number / 2);
  }

  Render(side_color, fill_color){
    fill(fill_color);
    rect(this.cell_in.absolute_x, this.cell_in.absolute_y, this.maze.cell_length, this.maze.cell_length);
    if(!side_color || side_color === null){return;}
    stroke(side_color);   // LOKI SKIN
    line(this.cell_in.absolute_x, this.cell_in.absolute_y, this.cell_in.absolute_x + this.maze.cell_length, this.cell_in.absolute_y);
    line(this.cell_in.absolute_x + this.maze.cell_length, this.cell_in.absolute_y, this.cell_in.absolute_x + this.maze.cell_length, this.cell_in.absolute_y + this.maze.cell_length);
    line(this.cell_in.absolute_x + this.maze.cell_length, this.cell_in.absolute_y + this.maze.cell_length, this.cell_in.absolute_x, this.cell_in.absolute_y + this.maze.cell_length);
    line(this.cell_in.absolute_x, this.cell_in.absolute_y + this.maze.cell_length, this.cell_in.absolute_x, this.cell_in.absolute_y);
  }

  Move(direction){
    const translation = this.MoveToCell(direction, this.cell_in);
    this.cell_in =  this.maze.GetCellByCoordinate(translation.x, translation.y);
  }
  
  MoveToCell(direction, coordinate){
    switch (direction) {
    case directions.TOP:
      return createVector(0, -1).add(coordinate.x, coordinate.y);
    case directions.RIGHT:
      return createVector(1, 0).add(coordinate.x, coordinate.y);
    case directions.BOTTOM:
      return createVector(0, 1).add(coordinate.x, coordinate.y);
    case directions.LEFT:
      return createVector(-1, 0).add(coordinate.x, coordinate.y);
    default:
      console.warn("Direction not given");
      break;
    }
  }
}

function keyTyped(){
  if(!(gameSystem.gameState instanceof PlayState)){return;}
  const player = gameSystem.player;
  if(key === 'w' && !player.cell_in.walls[0]){
    player.Move(directions.TOP);
    return;
  }
  else if (key === 'a' && !player.cell_in.walls[3]) {
    player.Move(directions.LEFT);
    return;
  }
  else if (key === 'd' && !player.cell_in.walls[1]) {
    player.Move(directions.RIGHT);
    return;
  }
  else if (key === 's' && !player.cell_in.walls[2]) {
    player.Move(directions.BOTTOM);
  }
}

function PlayerMovementWithLabel() {
  if (label == "Up" && !player.cell_in.walls[0]) {
    player.Move(directions.TOP);
    return;
  }
  else if (label == "Right"&& !player.cell_in.walls[1]) {
    player.Move(directions.RIGHT);
    return;
  }
  else if (label == "Down"&& !player.cell_in.walls[2]) {
    player.Move(directions.BOTTOM);
    return;
  }
  else if (label == "Left"&& !player.cell_in.walls[3]) {
    player.Move(directions.LEFT);
  }
}