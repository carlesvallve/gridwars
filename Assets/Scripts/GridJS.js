#pragma strict

//class GridJS extends MonoBehaviour {
//
//	public static var xsize:int;
//	public static var ysize:int;
//	public static var arr:Cell[,];
//	public static var astar:Astar;
//
//	public static function init(_xsize:int, _ysize:int) {
//        
//        // record grid size
//        xsize = _xsize; 
//        ysize = _ysize;
//        
//		// initialize 2d array of cells
//		arr = new Cell[xsize, ysize];
//        for (var y:int  = 0; y < ysize; y++) {
//            for (var x:int  = 0; x < xsize; x++) {
//            	arr[x, y] = new Cell("empty", x, 0, y, true);
//            }
//        }
//        
//        // initialize  Astar c# plugin
//        astar = new Astar(arr);
//        
//		// initialization log
//        print("InitGrid " + xsize + "," + ysize + ' ' + arr + ' ' + astar);
//    }
//    
//    public function getCell (x: int, y:int): Cell {
//    	return arr[x, y];
//    }
//
//}


// cell object

//public class Cell {
//
//	public var x:float;
//	public var y:float;
//	public var z:float;
//    public var type:String;
//
//    public function Cell(type:String, x:float, y:float, z:float) {
//        this.x = x;
//        this.y = y;
//        this.z = z;
//        this.type = type;
//    }
//
//    public function trace():void {
//        var msg:String = "Cell:" + x + "," + y + "," + z;
//        Debug.Log(msg);
//    }
//}