Shader "Terrain/Four Layer" {
Properties {
    _Color ("Main Color", Color) = (1,1,1,1)
    _MainTex ("Color 1 (RGB)", 2D) = "white" {}
    _MainTex2 ("Color 2 (RGB)", 2D) = "white" {}
    _MainTex3 ("Color 3 (RGB)", 2D) = "white" {}
    _MainTex4 ("Color 4 (RGB)", 2D) = "white" {}
    _Mask ("Mixing Mask (RGBA)", 2D) = "gray" {}
}
SubShader {
    Pass {
        Lighting On
        Material {
            Diffuse [_Color]
            Ambient [_Color]
        }
    
CGPROGRAM
// profiles arbfp1
// fragment frag

sampler2D _MainTex : register(s0);
sampler2D _MainTex2 : register(s1);
sampler2D _MainTex3 : register(s2);
sampler2D _MainTex4 : register(s3);
sampler2D _Mask : register(s4);

struct v2f {
    float4 uv[5] : TEXCOORD0;
    float4 diffuse : COLOR;
};

half4 frag( v2f i ) : COLOR
{
    // get the four layer colors
    half4 color1 = tex2D( _MainTex, i.uv[0].xy );
    half4 color2 = tex2D( _MainTex2, i.uv[1].xy );
    half4 color3 = tex2D( _MainTex3, i.uv[2].xy );
    half4 color4 = tex2D( _MainTex4, i.uv[3].xy );
    // get the mixing mask texture
    half4 mask = tex2D( _Mask, i.uv[4].xy );
    // mix the four layers
    half4 color = color1 * mask.r + color2 * mask.g + color3 * mask.b + color4 * mask.a;
    // multiply and double by the lighting
    return color * i.diffuse * 2.0;
}
ENDCG
        SetTexture[_MainTex] {}
        SetTexture[_MainTex2] {}
        SetTexture[_MainTex3] {}
        SetTexture[_MainTex4] {}
        SetTexture[_Mask] {}
    }
} 
FallBack " VertexLit", 1
}
