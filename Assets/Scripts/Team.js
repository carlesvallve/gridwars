#pragma strict

class Team extends MonoBehaviour {

	var players:Array = [];
	var num:int;
	var teamName:String;
	var spawnPoint:Vector2;
	var color:Color;

	function init(parent:Transform, num:int, name:String, pos:Vector2, color:Color): void {
		transform.parent = transform;
		this.name = 'Team' + num;
		this.num = num;
		this.teamName = name;
		this.spawnPoint = pos;
		this.color = color;
		initPlayers(2);
	}


	public function select(): void {
		// if no players left alive, dont change team
		if(!players || players.length == 0) {
			return;
		}

		// regenerate ap of team members
		for(var n:int = 0; n < players.length; n++) {
			var av:Player = players[n];
			av.ap = av.apMax;
		}

		// select first player
		selectPlayer(0);

		// change selected team
    	Audio.play('Audio/fx/key', World.cam.transform.position, 0.2, Random.Range(.8,1.2));
    	World.team = World.teams[this.num];
	}


	function initPlayers (max: int): void {
		players = [];

		for(var i:int = 0; i < max; i++) {
			var obj:GameObject = Instantiate(Resources.Load("prefabs/avatar/Avatar"), Vector3.zero, Quaternion.identity) as GameObject;

	    	var me:Player = obj.AddComponent("Player") as Player;
	    	me.init(transform, i, 'Player' + i, Vector2(0, 0), color);
	    	me.team = this;

			var rect:Rect = Rect(this.spawnPoint.x, this.spawnPoint.y, 1, 1);
        	me.position = me.locate(me.getRandomPosition(rect));
        	Grid.setWalkable(me.position.x, me.position.z, false);

	    	players.push(me);
		}
	}


	function selectPlayer(num:int): void {
		if(!players || players == []) { return; }

    	var av: Player = players[num];
    	if(av.dead) { return; }
    	World.av = av;
    	World.cam.setTarget(av.gameObject.transform);
    	Audio.play('Audio/fx/clickA', World.cam.transform.position, 0.2, Random.Range(.8,1.2));
	}


    function selectNextPlayer(): void {
    	var num = World.av.num + 1;
    	if(num == players.length) { num = 0; }

    	selectPlayer(num);
    }


    function destroy(): void {
    	for(var i:int = 0; i < players.length; i++) {
    		var player:Player = players[i];
    		player.destroy();
    	}
    	players = [];
    	Destroy(gameObject);
    }

}