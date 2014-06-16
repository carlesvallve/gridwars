#pragma strict

class Anim extends MonoBehaviour {


	// idle pose

	public static function idle(av:Player) {
    	// body, torax, hip, head
    	av.body.localPosition = new Vector3(0, 0, 0);
	    av.toraxRot = av.bodyRot;
	    av.hipRot = Quaternion.identity;
	    av.headRot = Quaternion.identity;
	    // legs
	    av.legRRot = Quaternion.Euler(Vector3(0,0, 5));
    	av.legLRot = Quaternion.Euler(Vector3(0,0, -5));
    	av.sublegRRot = Quaternion.identity;
    	av.sublegLRot = Quaternion.identity;
	    // no weapon pose
	    av.armRRot = Quaternion.Euler(new Vector3(0, 0, 10));
	    av.subarmRRot = Quaternion.identity;
	    av.handRRot = Quaternion.identity;
	    av.armLRot = Quaternion.Euler(new Vector3(0, 0, -10));
	    av.subarmLRot = Quaternion.identity;
	    av.handLRot = Quaternion.identity;
	    av.gunRot = Quaternion.Euler(new Vector3(90, 0, 0));
	    // weapon poses
	    switch (av.weapon.pose) {
	        case "melee": // carrying a melee weapon

			    av.subarmRRot = Quaternion.Euler(new Vector3(-0, 15, 0));
			    av.gunRot = Quaternion.Euler(new Vector3(90, 0, 0));
			    break;
			 case "gun": // carrying a gun or a shield
			 case 'shield':
			    av.gunRot = Quaternion.Euler(new Vector3(90, 0, 0));
			 	break;
			 case 'rifle': // carrying a large rifle
			    av.subarmRRot = Quaternion.Euler(new Vector3(-45, 0, -20));
			    av.gunRot = Quaternion.Euler(new Vector3(55, -55, -45));
			    break;
	    }
	    //if crouching, redefine default pose to crouch stance
        if (av.stance == "crouch") {
            //body
			av.body.localPosition = new Vector3(0, -.15, 0);
	        av.hipRot =  Quaternion.Euler(new Vector3(80, 0, 0));
	        av.toraxRot = av.toraxRot * Quaternion.Euler(new Vector3(80, 0, 0));
	        av.headRot = av.headRot * Quaternion.Euler(new Vector3(-80, 0, 0));
			//arms
        	av.armRRot =  av.armRRot * Quaternion.Euler(new Vector3(-55-25, 0, 0));
        	av.subarmRRot = Quaternion.Euler(new Vector3(-55, 0, -20));
        	av.armLRot = Quaternion.Euler(new Vector3(-55-25, -0, 0));
        	av.subarmLRot = Quaternion.Euler(new Vector3(-55, 0, 20));

        	if(av.weapon.pose == 'melee') {
        		av.armRRot = av.armRRot * Quaternion.Euler(new Vector3(45, 4, 65));
        		av.subarmRRot = av.subarmRRot * Quaternion.Euler(new Vector3(-15, 65, -20));
        	}
        }
	}


	// aim pose

	public static function aim(av:Player) {

    	switch (av.weapon.pose) {

    	//set avatar into melee pose
        case "melee":
        	av.toraxRot = av.toraxRot * Quaternion.Euler(new Vector3(0, 35, 0));
        	av.headRot = Quaternion.LookRotation(av.target.head.position - av.head.position);
        	av.armRRot = Quaternion.Euler(new Vector3(0, 0, 42));
        	av.subarmRRot = Quaternion.Euler(new Vector3(0, 0, 0));
	        av.armLRot = Quaternion.Euler(new Vector3(0, 0, -42));
	        av.subarmLRot = Quaternion.Euler(new Vector3(-42, 0, 0));

	        if(av.stance!='crouch') {
        		av.hipRot = Quaternion.Euler(new Vector3(0, 35, 0));
        	}
        	break;

        //set avatar into ranged aim pose
        default:

        	// get aim displace angle set at setAimLine and multiply torax, arm and gun by it
        	var displace = Quaternion.Euler(av.aimDisplace);

        	av.toraxRot = av.toraxRot * displace;
        	av.headRot = Quaternion.LookRotation(av.target.head.position - av.head.position);
        	av.armRRot = Quaternion.Euler(new Vector3(-42, 0, 0)) * displace;
	        av.subarmRRot = Quaternion.Euler(new Vector3(-42, 0, 0)) ;
	        av.gunRot = Quaternion.LookRotation(av.target.torax.position - av.gun.position) * displace;

        	if (av.stance == "crouch") {
        		av.armRRot = Quaternion.Euler(new Vector3(-42*1.5, 20, 0)) * displace;
	            av.subarmRRot = Quaternion.Euler(new Vector3(-42*2, 0, 0)) ;
	            av.armLRot = Quaternion.Euler(new Vector3(-42*1.5, 0, 0)) * displace;
	            av.subarmLRot = Quaternion.Euler(new Vector3(-42*2, 0, 0)) ;

        	} else {
        		av.armLRot = Quaternion.Euler(new Vector3(20, 0, -10));
	        	av.subarmLRot = Quaternion.Euler(new Vector3(0, 0, 0));
        	}

        	break;
        }

	}


	// shoot animation

	public static function shoot(av:Player):IEnumerator {
    	av.ax = 'shoot';
    	av.speedRot = 16;

    	var recoil:float = av.weapon.recoil * 2;

    	//Audio.play('audio/fx/shotA', av.transform.position, .7, Random.Range(1.0, 1.5));
    	av.toraxRot = av.torax.localRotation;
    	av.toraxRot = av.toraxRot * Quaternion.Euler(Vector3(-recoil * 2, Random.Range(-5, 5), Random.Range(-5, 5)));
    	av.headRot =av.head.localRotation;
    	av.armRRot = av.armRRot * Quaternion.Euler(Vector3(-recoil, 0, 0));
    	av.subarmRRot = av.subarmRRot * Quaternion.Euler(Vector3(-av.weapon.recoil*2, 0, 0));

    	yield WaitForSeconds (0.1);

    	av.ax = 'none';
    	av.speedRot = 8;

    	yield WaitForSeconds (av.weapon.speed * 0.1);

    	if(av.target && av.weapon.burstMode && av.weapon.burstNum < av.weapon.burstMax) {
    		av.weapon.burstNum++;
			av.shoot();
		} else {
			av.weapon.burstNum = 0;
		}
	}


	// slash animation

	public static function slash(av:Player):IEnumerator {

		av.ax = 'slash';
		av.speedRot = 16;
		Audio.play('audio/fx/swishA', av.transform.position, .7, Random.Range(.5, 1.0));
		av.toraxRot = av.torax.localRotation * Quaternion.Euler(new Vector3(Random.Range(-10,10), Random.Range(30,45), Random.Range(-20,20)));
		av.headRot = Quaternion.Euler(new Vector3(0, -15, 0));
		av.armRRot = av.armRRot * Quaternion.Euler(new Vector3(-45, 45, 45));

		yield WaitForSeconds(0.2);

        av.speedRot = 16;
        Audio.play('audio/fx/swishA', av.transform.position, .7, Random.Range(.5, 1.0));
        av.toraxRot = av.toraxRot * Quaternion.Euler(new Vector3(Random.Range(-0,20), Random.Range(-120,-150), Random.Range(-20,20)));
        av.headRot = Quaternion.Euler(new Vector3(Random.Range(-10,10), Random.Range(-10,10), 0));
        av.armRRot = av.armRRot * Quaternion.Euler(new Vector3(45 + Random.Range(-10,10), -45, -45));
        av.subarmRRot = Quaternion.Euler(new Vector3(-22, 0, 0));

		// set impact on target
		av.target.impact(av, av.target.transform, 0);

		yield WaitForSeconds(0.1);

		av.speedRot = 8;
		av.ax = 'none';


	}


	// parry animation

	public static function parry(av:Player) {
		yield WaitForSeconds(av.weapon.speed/2);
        Audio.play('audio/fx/swordC', av.transform.position, .6, Random.Range(1.0, 1.5));
	}


	// impact animation

	public static function impact(av:Player, shooter:Player, transf:Transform, delay:float, damage:int) {


		yield WaitForSeconds(delay);

		av.ax = 'impact';
		av.speedRot = 16;

		//record current rotations
        var toraxRotTemp:Quaternion = av.torax.rotation;
        var headRotTemp:Quaternion = av.head.localRotation;

        Audio.play('audio/fx/hitC', av.transform.position, .6, Random.Range(.7, 1.3));
		Audio.play('audio/fx/painA', av.transform.position, .6, Random.Range(2.0, 3.0));

		//rotate torax and head randomly
        if(av.stance == 'stand') {
        	var d:int = 30; var d2:int = 30;
        	av.toraxRot = Quaternion.Euler(Vector3(Random.Range(-d,d),Random.Range(-d,d),Random.Range(-d,d)));
        	av.headRot = Quaternion.Euler(Vector3(Random.Range(-d2,d2),Random.Range(-d2,d2),Random.Range(-d2,d2)));
    	} else {
    		d = 5; d2 = 5;
    		av.toraxRot = Quaternion.Euler(Vector3(80 + Random.Range(-d,d),Random.Range(-d,d),Random.Range(-d,d)));
        	av.headRot = Quaternion.Euler(Vector3(-80+ Random.Range(-d2,d2),Random.Range(-d2,d2),Random.Range(-d2,d2)));
        }


        // discount hp and escape if we are dead
		av.hp -= damage;
		if(av.hp <=0) { return; }


        yield WaitForSeconds(0.25);

		// return to normal
		av.toraxRot = toraxRotTemp;
		av.headRot = headRotTemp;

		av.ax = 'none';
		av.speedRot = 8;
	}


	// death animation

	public static function death(av:Player, shooter:Player, transf:Transform, delay:float) {

		//yield WaitForSeconds(delay + 0.4);

		av.hp = 0;

		if(av.target) { av.deselectTarget(); }

		av.ax = 'death';
		av.speedRot = 16;

		Audio.play('audio/fx/hitC', av.transform.position, .6, Random.Range(.7, 1.3));
		Audio.play('audio/fx/painC', av.transform.position, .6, Random.Range(1.5, 2.5));

		var d:int = 90; var d2:int = 90;
    	var h:int = [90,-90][Random.Range(0,2)];

		//rotate torax and head randomly
        if(av.stance == 'stand') {
        	//stand
        	av.toraxRot = Quaternion.Euler(Vector3(Random.Range(-5,5),0,Random.Range(-d,d)));
        	av.headRot = Quaternion.Euler(Vector3(Random.Range(-5,5),Random.Range(-d2,d2),Random.Range(-5,5)));
        	av.toraxRot = av.toraxRot  * Quaternion.Euler(new Vector3(h, 0, 0));
        	av.hipRot = av.hipRot  * Quaternion.Euler(new Vector3(h, 0, 0));
    	} else {
    		//crouch
    		av.toraxRot = Quaternion.Euler(Vector3(h + Random.Range(5,5),0,Random.Range(-d,d)));
        	av.headRot = Quaternion.Euler(Vector3(Random.Range(5,5),Random.Range(-d2,d2),Random.Range(-d2,d2)));
        	av.hipRot = Quaternion.Euler(new Vector3(h, 0, 0));
        }

        // relocate body downwards
		av.body.localPosition = new Vector3(0, -.2, 0);


		yield WaitForSeconds(0.1); //25

		if(shooter.target) { shooter.deselectTarget(); }

		av.stance = 'crouch';
		av.speedRot = 8;

		av.weapon.entity.orientate(av.weapon.go.transform.forward);

		// set dead state
		if(av.dead) { return; }
		av.dead = true;

		// remove player from list
		av.team.players.RemoveAt(av.num);

		// re-assign player numbers
		for(var i:int = 0; i < av.team.players.length; i++) {
    		var temp:Player = av.team.players[i];
    		temp.num = i;
    	}
	}


	//reload animation

    public static function reload(av:Player):IEnumerator {
        av.ax = 'reload';
        av.speedRot = 16;

        Audio.play('audio/fx/reloadB', av.transform.position, 1.0, Random.Range(1.5, 2.0));

        var toraxRotTemp:Quaternion = av.toraxRot;
        var headRotTemp:Quaternion = av.headRot;
        var armRRotTemp:Quaternion = av.armRRot;
        var subarmRRotTemp:Quaternion = av.subarmRRot;
        var armLRotTemp:Quaternion = av.armLRot;
        var subarmLRotTemp:Quaternion = av.subarmLRot;

        av.toraxRot = av.torax.localRotation;
        av.headRot = av.head.localRotation * Quaternion.Euler(new Vector3(10, 0, 0)); ;
        av.armRRot = Quaternion.Euler(new Vector3(-45, 0, 10));
        av.subarmRRot = Quaternion.Euler(new Vector3(-15, 0, -45));
        av.armLRot = Quaternion.Euler(new Vector3(-45, 0, 10));
        av.subarmLRot = Quaternion.Euler(new Vector3(-15, 0, 45));

        //-------------------------------------
        yield WaitForSeconds(0.5);
        //-------------------------------------

        av.toraxRot = toraxRotTemp;
        av.headRot = headRotTemp;
        av.armRRot = armRRotTemp;
        av.subarmRRot = subarmRRotTemp;
        av.armLRot = armLRotTemp;
        av.subarmLRot = subarmLRotTemp;

        av.ax = 'none';
        av.speedRot = 8;
    }


	// jump animation

    public static function jump(av:Player, time:float):IEnumerator {
        av.ax = 'jump';
        av.speedRot = 16;

        var armRRotTemp:Quaternion = av.armRRot;
        av.armRRot = Quaternion.Euler(new Vector3(-45, 0, 80));

        var armLRotTemp:Quaternion = av.armLRot;
        av.armLRot = Quaternion.Euler(new Vector3(-45, 0, -80));

        var legRRotTemp:Quaternion = av.legRRot;
        av.legRRot = Quaternion.Euler(new Vector3(-40, 0, 20));

        var legLRotTemp:Quaternion = av.legLRot;
        av.legLRot = Quaternion.Euler(new Vector3(-40, 0, -20));

        //-------------------------------------
        yield WaitForSeconds(time);
        //-------------------------------------

        av.armRRot = armRRotTemp;
        av.armLRot = armLRotTemp;
        av.legRRot = legRRotTemp;
        av.legLRot = legLRotTemp;
   }


    // pickup animation

    public static function pickup(av:Player):IEnumerator {
        av.ax = 'pickup';
        av.speedRot = 16;

        //av.deselectTarget();

		var toraxRotTemp:Quaternion = av.torax.rotation;
		var armRRotTemp:Quaternion = av.torax.localRotation;

        av.toraxRot = av.torax.localRotation * Quaternion.Euler(new Vector3(90, 0, 0));
        av.armRRot = av.armRRot * Quaternion.Euler(new Vector3(-90, 0, 0));

        //-------------------------------------
        yield WaitForSeconds(0.25);
        //-------------------------------------


        print('>>> ' + av.inventory.weapons[0] + ' ' + av.weapon.id);

        av.toraxRot = toraxRotTemp;
        av.armRRot = armRRotTemp;

        av.ax = 'none';
        av.speedRot = 16;
    }


//    // parry animation
//    public function parry(delay:float):IEnumerator {
//        ax = 'defend';
//        //-------------------------------------
//        yield WaitForSeconds(delay);
//        //-------------------------------------
//        torax.Rotate(new Vector3(0, -90, 0));
//        head.Rotate(new Vector3(0, 35, 0));
//        subarmR.rotation = armR.rotation;
//        subarmR.Rotate(new Vector3(-22, 0, 0));
//        //-------------------------------------
//        yield WaitForSeconds(speed);
//        //-------------------------------------
//        if (target) {
//        	torax.Rotate(new Vector3(0, 45, 0));
//        	head.LookAt(target.head.position);
//        }
//        //-------------------------------------
//        yield WaitForSeconds(speed);
//        //-------------------------------------
//        ax = 'none';
//    }


}

