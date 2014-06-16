#pragma strict

class Audio extends MonoBehaviour {

	public static function play(wav:String, point:Vector3, volume:float, pitch:float):AudioSource {

        //load wav file as an audioclip
        var clip:AudioClip = Resources.Load(wav) as AudioClip;

        if(!clip) {
        	print('Error while loading audio clip!');
        	return;
        }

        // create an empty game object at given point
        var go:GameObject = new GameObject("Audio: " + clip.name);
        go.transform.parent = World.temp.transform;
        go.transform.position = point;

        //Create the audio source
        var source:AudioSource = go.AddComponent('AudioSource') as AudioSource;
        if(!source) {
        	print('Error while creating audio source component!');
        	return;
        }

        // set audio source props
        source.clip = clip;
        source.volume = volume;
        source.pitch = pitch;

        // play it
        source.Play();

        // destroy it
        Destroy(go, clip.length);

        // return it in case we need it for something
        return source;
    }

}