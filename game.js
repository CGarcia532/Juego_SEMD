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

function drawButtons()
{
	/*$("body").append('<div><button type="button" id="reiniciar" class="reiniciar">Reiniciar</button><button type="button" id="regresar" class="reiniciar">Regresar</button></div>');*/
	$("body").append('<div id="movBot"><input type="button" value="Reiniciar" onclick="location.reload()"/><p id="talking_boxm" class="texto2">Movimientos<br>0</p></div>');
}

//Dibuja las piezas
var Piece = function(value,rigthPosX,rigthPosY,posX,posY,rigthPosX2,rigthPosY2)
{
	this.value = value; 
	this.isRigthPosition = false; 
	this.isRigthPosition2 = false; 
	this.posX = posX; 
	this.posY = posY; 
	this.rigthPosX = rigthPosX; 
	this.rigthPosY = rigthPosY; 
	this.rigthPosX2 = rigthPosX2; 
	this.rigthPosY2 = rigthPosY2; 
}

//Inicializa el juego.
var Game = function()
{
	this.isWrongCount = 0; 
	this.isWrongCount2 = 0; 
	this.piecesArray = new Array();
	this.contador = 0;  

	this.restart = function(){
		this.isWrongCount = 0; 
		this.isWrongCount2 = 0; 
		this.piecesArray = new Array(); 
		this.contador = 0;  

		document.getElementById("talking_box").remove();
		document.getElementById("talking_boxm").remove();
		$("#textos").append('<p id="talking_box" class="texto1">¡Bienvenido <br>' + localStorage.getItem("name") + '!</p>');
		/*$("#textos").append('<p id="talking_box" class="texto2">¡Empieza el Juego!</p>');*/
	}
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
			if((3-(i%3)-1) != 0){
				console.log(4-Math.floor(i/3+1));
				console.log(3-(i%3)-1);
				this.piecesArray[i] = new Piece(i+1,Math.floor(i/3+1),(i%3)+1,Math.floor((randomArray[i]-1)/3)+1,((randomArray[i]-1)%3)+1,4-Math.floor(i/3+1),3-(i%3)-1);
			}else{
				this.piecesArray[i] = new Piece(i+1,Math.floor(i/3+1),(i%3)+1,Math.floor((randomArray[i]-1)/3)+1,((randomArray[i]-1)%3)+1,4-Math.floor(i/2+1), 3);
				console.log(4-Math.floor(i/2+1));
				console.log(3);
			}
			

			if((this.piecesArray[i].posX != this.piecesArray[i].rigthPosX) || (this.piecesArray[i].posY != this.piecesArray[i].rigthPosY))
				this.isWrongCount++;
			else
				this.piecesArray[i].isRigthPosition = true; 

			if((this.piecesArray[i].posX != this.piecesArray[i].rigthPosX2) || (this.piecesArray[i].posY != this.piecesArray[i].rigthPosY2))
				this.isWrongCount2++;
			else
				this.piecesArray[i].isRigthPosition2 = true; 
		}
		this.piecesArray[8] = new Piece(9,3,3,3,3,3,3); 			
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
	this.drawBoard = function()
	{
		$("body").append('<section id="game_board" class="game_board"><section id="piece_container"></section></section>');

		for(var i=0;i<8;i++)
			$("#piece_container").append('<div class="game_piece" style="top:'+((this.piecesArray[i].posX-1)*33)+'%;left:'+((this.piecesArray[i].posY-1)*33)+'%"><div class="number_container" id="piece'+i+'">'+this.piecesArray[i].value+'</div></div>');		
	}
	//inicializa el tablero en el html
	this.redrawBoard = function()
	{
		$("#game_board").append('<section id="piece_container"></section>');

		for(var i=0;i<8;i++)
			$("#piece_container").append('<div class="game_piece" style="top:'+((this.piecesArray[i].posX-1)*33)+'%;left:'+((this.piecesArray[i].posY-1)*33)+'%"><div class="number_container" id="piece'+i+'">'+this.piecesArray[i].value+'</div></div>');		
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

		if((piece.posX == piece.rigthPosX2) && (piece.posY == piece.rigthPosY2)) 
		{
			piece.isRigthPosition2 = true; 
			this.isWrongCount2--;
		}
		else
		{
			if(piece.isRigthPosition2) 
			{
				piece.isRigthPosition2 = false;
				this.isWrongCount2++;
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
		if(this.isWrongCount == 0 && localStorage.getItem("mode") == "ascendente") 
			return true; 
		else if(this.isWrongCount2 == 0 && localStorage.getItem("mode") == "descendente") 
			return true; 
		else
			return false;
	}

	this.conteo = function()
	{
		this.contador++;
		return this.contador;
	}
}
//Inicia el juego
$(document).ready(function(){
	var game = new Game();
	game.initializeGame();
	game.drawBoard();

	$(".game_piece").click(function(){	
		var piece_number = $(this).children().text();	
		if(game.movePiece(piece_number)){
			$(this).animate({'top':((game.piecesArray[piece_number-1].posX-1)*33)+'%','left':((game.piecesArray[piece_number-1].posY-1)*33)+'%'},540);
			document.getElementById("talking_box").remove();
			document.getElementById("talking_boxm").remove();
			$("#textos").append('<p id="talking_box" class="texto1">¡Bienvenido <br>' + localStorage.getItem("name") + '!</p>');
			$("#movBot").append('<p id="talking_boxm" class="texto2">Movimientos<br> '+ game.conteo() +'</p>');
		} 
		
		if(game.checkGame()){
			document.getElementById("talking_box").remove();
			document.getElementById("talking_boxm").remove();
			$("#textos").append('<p id="talking_box" class="texto1">¡Fin del Juego!</p>');
			$("#movBot").append('<p id="talking_boxm" class="texto2">¡Puzzle Completado!</p>');

			document.getElementById("piece_container").remove();
			$("#game_board").append('<img src="cat.gif" alt="dancing cats" id="cats" />');
		}
	});	

	drawButtons();
	$("#reiniciar").click(function(){	
		try{
			document.getElementById("cats").remove();
		} catch(x){}
		try{
		document.getElementById("piece_container").remove();
		} catch(x){}

		game.restart();
		game.initializeGame();
		game.redrawBoard();

		$(".game_piece").click(function(){	
			var piece_number = $(this).children().text();	
			if(game.movePiece(piece_number)){
				$(this).animate({'top':((game.piecesArray[piece_number-1].posX-1)*33)+'%','left':((game.piecesArray[piece_number-1].posY-1)*33)+'%'},540);
				document.getElementById("talking_box").remove();
				document.getElementById("talking_boxm").remove();
				$("#textos").append('<p id="talking_box" class="texto1">¡Bienvenido <br>' + localStorage.getItem("name") + '!</p>');
				$("#movBot").append('<p id="talking_boxm" class="texto2">Movimientos<br> '+ game.conteo() +'</p>');
			} 
			
			if(game.checkGame()){
				document.getElementById("talking_box").remove();
				document.getElementById("talking_boxm").remove();
				$("#textos").append('<p id="talking_box" class="texto1">¡Fin del Juego!</p>');
				$("#movBot").append('<p id="talking_boxm" class="texto2">¡Puzzle Completado!</p>');
	
				document.getElementById("piece_container").remove();
				$("#game_board").append('<img src="cat.gif" alt="dancing cats" id="cats" />');
			}
		});	
	});	

	$("#regresar").click(function(){	
		window.history.back();
	});	
});
