
let mycanvas=document.getElementById("myCanvas");
let ctx=mycanvas.getContext('2d');
//set vi tri cho nhan vat 1	  
	let bx=100,	by=360;
	let hx=bx-54, hy=300;
	let fx = hx, fy=300;


	let dir = 0;
	let rad, ox, oy;
	let lastSpawn = -1;
	let spawnRate = 1000;
	let rateOfDescent = 1;
	let startTime, gameTime = 20000;
	let score = 0;
	let name=''
	//tao nhan vat
	let playerImg = new Image();
		playerImg.src="images/rightX.png";
	

	let bgPlay = new Image();
        bgPlay.src="images/bgPlay.png";
	let bgPause = new Image();
        bgPause.src="images/bgPause.png";
	
	let boxArray;
	boxArray = new Array();
	
	window.onload = function(){ 		
    ctx.drawImage(bgPause, 0, 0);
	ctx.font = "italic small-caps bold 30px consolas";
	ctx.fillStyle="white";
	ctx.textAlign = "center";
	ctx.fillText("If The Fruit Hit Your Head: Score -1", mycanvas.width/2, 150);
	ctx.fillText("Press SPACEBAR to Start or Stop the Game. ", mycanvas.width/2, mycanvas.height/2);
	ctx.fillText("Use ARROW Keys to move. Good Luck!", mycanvas.width/2,300);
}
	
	let x123 = 1;

	function myFunction() {  
    if(x123 == 0){
		location.reload();
 	}else{
		startTime = Date.now();
		playSound("sound/start.mp3");
		playMusic("sound/bgm.mp3");
		animate();}
	}
	
	function drawBasket(){	
	ctx.globalAlpha = 0.0;
	ctx.fillStyle = "black";
	ctx.fillRect(bx,by,54,50);
	}
	
	function drawHead(){	
	ctx.globalAlpha = 0.0;
	ctx.fillStyle = "red";
	ctx.fillRect(hx,hy,54,50);
	}
	//set chuc nang cho nut
	window.addEventListener('keydown', function(e){
		switch(e.keyCode){
			case 32:
				myFunction();
				break;
			case 37:
				if(bx>0)
				{
					if(dir == 0)
					{
						hx=bx-54;
						bx-=108;						
						dir = 1;
					}
					else{						
						bx-=25;	
						hx=bx+54;
					}
				}
				fx=bx;
				playerImg.src="images/leftX.png";
				break;
				
			case 39:
				if(bx<(mycanvas.width-54)){
					if(dir == 1)
					{
						hx=bx+54;
						bx+=108;	
						fx=bx;
						dir = 0;
					}
					else{						
						bx+=25;
						hx=bx-54;
					}
				}
				fx=hx;
				playerImg.src="images/rightX.png";
				break;
			case 38:
				if(by >= 360){
				by = by - 10;
				hy = hy - 10;
				fy = fy - 10;}
				break;
			case 40:
				if(by < 370){
				by = by + 10;
				hy = hy + 10;
				fy = fy + 10}
				break;
		}
	}
	);

	
	function spawnRandomObject(){
		{
			let newBox = new Object();
			newBox.x = Math.floor(Math.random() * 500);
			newBox.y = Math.floor(Math.random() * 10);
			newBox.t = Date.now();
			boxArray.push(newBox);
		}
	}
	
	
	function animate(){	
		let timeNow = Date.now();
		if(timeNow - startTime < gameTime){
		x123 = 0;
		requestAnimationFrame(animate);
		ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
		ctx.drawImage(bgPlay,0,0);
		drawBasket();	
		drawHead();
		ctx.globalAlpha=1;
		//player 1
		ctx.drawImage(playerImg,fx,fy);
			
			if(score>0){
			ctx.beginPath();
			ctx.arc(bx+22, by+24, 8, 0, 2 * Math.PI, false);
			ctx.fillStyle="orange";
			ctx.fill();
			ctx.stroke();}
			if(score>2){
			ctx.beginPath();
			ctx.arc(bx+28, by+24, 8, 0, 2 * Math.PI, false);
			ctx.fillStyle="orange";
			ctx.fill();
			ctx.stroke();}
			if(score>5){
			ctx.beginPath();
			ctx.arc(bx+25, by+18, 8, 0, 2 * Math.PI, false);
			ctx.fillStyle="orange";
			ctx.fill();
			ctx.stroke();}
			if(score>10){
			ctx.beginPath();
			ctx.arc(bx+29, by+18, 8, 0, 2 * Math.PI, false);
			ctx.fillStyle="orange";	
			ctx.fill();
			ctx.stroke();}
			
		//name
		ctx.font = "italic small-caps bold 24px arial";
		ctx.fillStyle="white";
		ctx.fillText("Player 1" + name,50,23);
		//score	
		ctx.font = "italic small-caps bold 14px arial";
		ctx.fillStyle="white";
		ctx.fillText("Score:" + score,375,293);
		
		//time left	
		let A = gameTime - (timeNow - startTime);
		let seconds=Math.floor((A/1000)%60);
		let	minutes=Math.floor((A/(1000*60))%60);
			ctx.fillText( "* Time Left *",700,20);
		ctx.font = "italic small-caps bold 24px arial";
		if(seconds>9)	
			ctx.fillText( minutes + ":" + seconds,700,40);
		else
			ctx.fillText( minutes + ":0" + seconds,700,40);	
		
		let time = Date.now();
		if(time > (lastSpawn + spawnRate)){
			lastSpawn = time;
			spawnRandomObject();
		}
		
		for(let i=0; i< boxArray.length; i++){
			
			let orange = boxArray[i];
			if(orange.y > mycanvas.height)
					{
						boxArray.splice(i,1);
					}
					console.log(boxArray.length);
			let timeDiff = Date.now()-orange.t;
			if(timeDiff < 4000){				
				rad = (timeDiff/4000)*20; ox = orange.x; oy = orange.y;
				growOrange(rad,ox,oy);					
			}
			else{
					orange.y+=rateOfDescent;
					drawRect(orange.x+50,orange.y+120);
			}

			if(intersects(orange.x+30, orange.y+100, 40, 40, bx, by, 54, 40))
			{
				playSound("sound/catch.mp3");
				score++;
				orange.y = 800;
			}
			
			if(intersects(orange.x+30, orange.y+100, 40, 40, hx, hy, 54, 50))
			{
				playSound("sound/hit.mp3");
				score--;
				orange.y = 800;
				if(dir == 0){
					playerImg.src="images/missRightX.png";
					setTimeout(function(){ playerImg.src="images/rightX.png" }, 250);
				}else if(dir == 1){
					playerImg.src="images/missLeftX.png";
					setTimeout(function(){ playerImg.src="images/leftX.png" }, 250);
				}
			}
		}
		}
		else{
			ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
			ctx.drawImage(bgPause, 0, 0);
			ctx.font = "italic small-caps bold 34px arial";
			ctx.fillStyle="white";
			ctx.textAlign = "center";
			ctx.fillText("TIME OVER !", mycanvas.width/2, mycanvas.height/2,);
			ctx.fillText("Your Score in 20 seconds: " + score, mycanvas.width/2,120);
			ctx.font = "italic small-caps bold 14px arial";
			ctx.fillText("Press SPACEBAR to Reset", mycanvas.width/2,320);
			requestAnimationFrame(animate);
		}
	}
	
	function playSound(soundfile) 
	{
		document.getElementById("dummy").innerHTML=
    "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
	}
	function playMusic(sndfile) 
	{
		document.getElementById("musicDummy").innerHTML=
    "<embed src=\""+sndfile+"\" hidden=\"true\" autostart=\"true\" loop=\"true\" />";
	}
	
	function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
			w2 += x2;
			w1 += x1;
			if (x2 > w1 || x1 > w2) return false;
			h2 += y2;
			h1 += y1;
			if (y2 > h1 || y1 > h2) return false;
		  return true;
		}
	
	function drawRect(xPos, yPos)
	{
		ctx.beginPath();
      	ctx.arc(xPos, yPos, 20, 0, 2 * Math.PI, false);
      	ctx.fillStyle = 'orange';
      	ctx.fill();
      	ctx.strokeStyle = '#003300';
      	ctx.stroke();		
	}
	
	
	function growOrange(radius, orx, ory)
	{
			ctx.beginPath();
			var mygradient=ctx.createRadialGradient(orx+50, ory+120,radius/6,orx+50, ory+120,radius);
			mygradient.addColorStop(0, "rgba(6,199,16,1.00)"); 
			mygradient.addColorStop(0.3,"rgba(170,235,0,1.00)");
			mygradient.addColorStop(1,"rgba(255,214,42,0.80)");
			ctx.arc(orx+50, ory+120, radius, 0, 2 * Math.PI, false);
			ctx.fillStyle=mygradient;
			ctx.fill();
      		ctx.stroke();
	}