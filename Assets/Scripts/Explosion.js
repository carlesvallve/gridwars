#pragma strict

class Explosion extends MonoBehaviour {


	public function init(num:int, color:Color, normal:Vector3) {
	
		name = 'Explosion' + num;
		transform.parent = World.temp.transform;
        
        // initialize particles component
        var particles:ParticleEmitter  = gameObject.GetComponent('ParticleEmitter') as ParticleEmitter;
        particles.worldVelocity = normal * 0.5; // new Vector3(0, 0, 0);
        particles.Emit();
        
        //tint particles of given color
        var particleAnimator:ParticleAnimator = gameObject.GetComponent('ParticleAnimator') as ParticleAnimator;
        var m_Color:Color[] = particleAnimator.colorAnimation;
        m_Color[4] = color; m_Color[3] = color; m_Color[2] = color; m_Color[1] = color; m_Color[0] = color;
        particleAnimator.colorAnimation = m_Color;
        
        // wait some time and destroy the explosion
        StartCoroutine(end());
        
	}
	
	
	function end():IEnumerator { 
		yield WaitForSeconds(1.0); 
		Destroy(this.gameObject);  
	}
	
}