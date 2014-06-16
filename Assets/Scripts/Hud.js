#pragma strict

   
class Hud extends MonoBehaviour {

	var font:Font;
	var shadowStyle:GUIStyle;
	var labelStyle:GUIStyle; 
	

	function Start() {
		// set label style
		labelStyle.fixedWidth = 50;
		labelStyle.font = font;
		labelStyle.fontSize = 11;
		labelStyle.normal.textColor = Color.white; 
		labelStyle.alignment = TextAnchor.LowerCenter; 
		
		// set shadow style
		shadowStyle.fixedWidth = 50;
		shadowStyle.font = font;
		shadowStyle.fontSize = 11;
		shadowStyle.normal.textColor = Color.black;
		shadowStyle.alignment = TextAnchor.LowerCenter; 
	}
	
	
	function OnGUI() {
		if (!World.team) { return; }
		// render a label over each avatar
		for(var i:int = 0; i < World.team.players.length; i++) {
			var av:Player = World.team.players[i]; 
			setName(av);
			setAP(av);
			setHP(av);
		}
	}


	//--------------------------------------------------------------
	// Player Labels
	
	
	// Name
	
	function setName(av:Player) {	
		var offset:Vector3 = Vector3.up * .45; 
		
		labelStyle.normal.textColor = av.color; 

		var str:String = av.name;
		GUI.Label(GetLabelRect(str, av.head, offset, new Vector2(1, 1)), str, shadowStyle); //name+ ' ' + av.hp
		GUI.Label(GetLabelRect(str, av.head, offset, new Vector2(0, 0)), str, labelStyle);
	}
	
	
	// AP
	
	function setAP(av:Player) {	
		var offset:Vector3 = Vector3.up * .35;
		var p:Vector3 = GetLabelScreenPos(av.head, offset);
		if(p.x <= 0.035 || p.x >= 0.965 || p.y <= 0.035 || p.y >= 0.965) { return; }
		
		labelStyle.normal.textColor = Color.yellow;
		labelStyle.alignment = TextAnchor.MiddleLeft; 
		shadowStyle.alignment = TextAnchor.MiddleLeft; 
		
		var str:String = '' + av.ap;
		GUI.Label(GetLabelRect(str, av.head, offset, new Vector2(1, 1)), str, shadowStyle); 
		GUI.Label(GetLabelRect(str, av.head, offset, new Vector2(0, 0)), str, labelStyle);
		
	}
	
	
	// HP
	
	function setHP(av:Player) {
		var offset:Vector3 = Vector3.up * .35;	
		var p:Vector3 = GetLabelScreenPos(av.head, offset);
		if(p.x <= 0.035 || p.x >= 0.965 || p.y <= 0.035 || p.y >= 0.965) { return; }
		
		labelStyle.normal.textColor = Color.red;  //Helpers.HexToRGB('990000'); //

		var str:String = '';
		for(var i:int = 1; i <= av.hp; i++) {
			str +='●';
		}
		
		var d:int = 11; 
		if(av.ap >=10) { d = 17; }
		
		GUI.Label(GetLabelRect(str, av.head, offset, new Vector2(1 + d, 1)), str, shadowStyle); 
		GUI.Label(GetLabelRect(str, av.head, offset, new Vector2(0 + d, 0)), str, labelStyle);
	}
	
	
	//--------------------------------------------------------------
	// Helpers
	
	
	// get the final rect on screen of a given message
	
	function GetLabelRect(msg:String, target:Transform, offset:Vector3, d:Vector2):Rect  {
        var width:int = labelStyle.fixedWidth; //10 + msg.Length * 10; //* 7;
        var p:Vector3 = GetLabelScreenPos(target, offset);
        var rect:Rect = new Rect(d.x-width / 2 + p.x * Screen.width, d.y-10 + Screen.height - p.y * Screen.height, width, 20);
        return rect;
    }
    

    //get the screen position (0 to 1, 0 to 1)
    
    function GetLabelScreenPos(target:Transform, offset:Vector3 ):Vector3  {
        var p:Vector3;
        var clampBorder:float  = 0.035;
        if (clampBorder > 0) {
            var relativePosition:Vector3 = Camera.main.transform.InverseTransformPoint(target.position);
            relativePosition.z = Mathf.Max(relativePosition.z, 1.0);
            p = Camera.main.WorldToViewportPoint(Camera.main.transform.TransformPoint(relativePosition + offset));
            p = new Vector3(Mathf.Clamp(p.x, clampBorder, 1.0f - clampBorder), Mathf.Clamp(p.y, clampBorder, 1.0 - clampBorder), p.z);
        } else {
            p = Camera.main.WorldToViewportPoint(target.position + offset);
        }
        return p;
    }
    
    
    
    
    
    
//--------------------------------------------------------------
// Player Portraits
//--------------------------------------------------------------
	
//var texRed:Texture2D;
//var texBlue:Texture2D;
//texRed = createTextureColor(Color(1,0,0,.5));
//texBlue = createTextureColor(Color(0,1,1,.5));

//	function createTextureColor(color:Color) {
//		var tex:Texture2D = new Texture2D(1,1);
//		tex.SetPixel(0, 0, color);
//        tex.Apply();
//        return tex;
//	}

// create avatar portraits
//for(n = 0; n < World.players.length; n++) {
//	setPortrait(World.players[n]);
//}
	
//	function setPortrait(av:Player) {	
//		// box
//		GUI.BeginGroup( Rect (10,10+(av.num*75), 60, 70));
//			GUI.Box(Rect(0,0,60,70), 'hp:' + av.hp);
//			
//			//portrait
//			GUI.BeginGroup( Rect (5,5, 50, 50));
//				GUI.DrawTexture(Rect(0,0,50,50), av.portrait, ScaleMode.StretchToFill, false, 30.0);
//				GUI.DrawTexture(getHp(av,50), texRed, ScaleMode.StretchToFill, true, 30.0);	
//			GUI.EndGroup();
//			
//			// ap bar
//			GUI.BeginGroup( Rect (5,60, 50, 5));
//				GUI.Box(Rect(0,0,50,5), 'ap:' + av.ap);
//				GUI.DrawTexture(getAp(av.apMax,50), texBlue, ScaleMode.StretchToFill, true, 30.0);
//				GUI.DrawTexture(getAp(av.ap,50), texBlue, ScaleMode.StretchToFill, true, 30.0);
//			GUI.EndGroup();
//
//		GUI.EndGroup();
//	}
//	
//	function getHp(av:Player, max:int):Rect {
//		max = max-2;	
//		var d:int = av.hp * max / av.hpMax;
//		return Rect(1, 1+max-(max-d), max, max-d);
//	}
//	
//	function getAp(prop:int, max:int):Rect {	
//		max = max-2;	
//		var d:int = prop * max / 20; //av.apMax;
//		return Rect(1, 1, d, 3);
//	}


}
