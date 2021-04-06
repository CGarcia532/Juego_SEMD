//Randomiza el juego.
function Random(array)
{
	var length = array.length; 
	var aux;
	var randomPos;

	for(var i=0;i<length;i++)
	{
		aux = array[i]; 
		randomPos = Math.floor(Math.random() * length);
		array[i] = array[randomPos]; 
		array[randomPos] = aux; 
	}
	return array; 
}

//Dibuja las piezas
var Piece = function(value,rigthPosX,rigthPosY,posX,posY)
{
	this.value = value; 
	this.isRigthPosition = false; 
	this.posX = posX; 
	this.posY = posY; 
	this.rigthPosX = rigthPosX; 
	this.rigthPosY = rigthPosY; 
}

//Inicializa el juego.
var Game = function()
{
	this.isWrongCount = 0; 
	this.piecesArray = new Array(); 


	this.initializeGame = function()
	{
		var randomArray = new Array(); 
		
		for(var i=0;i<8;i++)
			randomArray[i] = i+1;
		do
		{
			randomArray = Random(randomArray); 
		}
		while(!this.isSolvable(randomArray));
		
		for(var i=0;i<8;i++)
		{

			this.piecesArray[i] = new Piece(i+1,Math.floor(i/3+1),(i%3)+1,Math.floor((randomArray[i]-1)/3)+1,((randomArray[i]-1)%3)+1);

			if((this.piecesArray[i].posX != this.piecesArray[i].rigthPosX) || (this.piecesArray[i].posY != this.piecesArray[i].rigthPosY))
				this.isWrongCount++;
			else
				this.piecesArray[i].isRigthPosition = true; 
		}
		this.piecesArray[8] = new Piece(9,3,3,3,3); 			
	}
	//Verifica que el juego es resolvible
	this.isSolvable = function(random_array)
	{
		var control_sum = 0; 

		var control_array = new Array();  
		var test_array = new Array();
		var length = random_array.length; 
		for(var i=0;i<length;i++) 
			test_array[random_array[i]-1] = i+1;
		for(var i=0;i<length;i++)
			control_array[i] = 0;
		for(var i=0;i<length;i++)
		{
			for(var j=i+1;j<length;j++)
			{
				if(test_array[j]<test_array[i])
					control_array[i]++;
			}
			control_sum += control_array[i]; 
		}	

		if(control_sum % 2 == 0)
			return true;
		else
			return false;
	}
	//inicializa el tablero en el html
	this.drawBoard = function(pixel_size)
	{
		$("body").append('<section id="game_board" style="height:'+pixel_size+'px;width:'+pixel_size+'px;"><section id="piece_container"></section></section>');

		for(var i=0;i<8;i++)
			$("#piece_container").append('<div class="game_piece" style="top:'+((this.piecesArray[i].posX-1)*25)+'%;left:'+((this.piecesArray[i].posY-1)*25)+'%"><div class="number_container">'+this.piecesArray[i].value+'</div></div>');		
	}
	//Verifica la posición de las piezas.
	this.checkPosition = function(piece)
	{
		if((piece.posX == piece.rigthPosX) && (piece.posY == piece.rigthPosY)) 
		{
			piece.isRigthPosition = true; 
			this.isWrongCount--;
		}
		else
		{
			if(piece.isRigthPosition) 
			{
				piece.isRigthPosition = false;
				this.isWrongCount++;
			}
		}
	}

	//Función para mover una pieza
	this.movePiece = function(piece_number)
	{
		var test_posX = this.piecesArray[piece_number-1].posX - this.piecesArray[8].posX;
		var test_posY = this.piecesArray[piece_number-1].posY - this.piecesArray[8].posY;
		var wasMoved = false;
		if(Math.abs(test_posX) + Math.abs(test_posY) == 1)
		{
			var auxX = this.piecesArray[piece_number-1].posX;
			var auxY = this.piecesArray[piece_number-1].posY;
			this.piecesArray[piece_number-1].posX = this.piecesArray[8].posX; 
			this.piecesArray[piece_number-1].posY = this.piecesArray[8].posY;
			this.piecesArray[8].posX = auxX;
			this.piecesArray[8].posY = auxY;
			this.checkPosition(this.piecesArray[piece_number-1]);
			wasMoved = true;
		}
		return wasMoved;
	}
	//Verifica si el juego se resolvio correctamente
	this.checkGame = function()
	{
		if(this.isWrongCount == 0) 
			return true; 
		else
			return false;
	}
}
//Inicia el juego
$(document).ready(function(){
	var game = new Game();
	game.initializeGame();
	game.drawBoard(500);
	$(".game_piece").click(function(){	
		var piece_number = $(this).children().text();	
		if(game.movePiece(piece_number))
			$(this).animate({'top':((game.piecesArray[piece_number-1].posX-1)*25)+'%','left':((game.piecesArray[piece_number-1].posY-1)*25)+'%'},500);
		if(game.checkGame())
			$("#talking_box").text("Has resuelto el juego");		
	});	
});
