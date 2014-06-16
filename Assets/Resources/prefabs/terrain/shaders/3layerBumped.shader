// Upgrade NOTE: replaced 'PositionFog()' with multiply of UNITY_MATRIX_MVP by position
// Upgrade NOTE: replaced 'V2F_POS_FOG' with 'float4 pos : SV_POSITION'

Shader "Terrain/ThreeLayer Bumped" {

 

Properties {

    _Color ("Main Color", Color) = (1,1,1,1)

    _Shadow ("AO shadow", Color) = (1,1,1,1)

     _Roughness ("Roughness", Range (0.0, 1.0)) = 0.0

     // _Burn ("Lightmap multiplier", Range (0.0, 2.0)) = 1.3

        _SpecColor ("Specular Color", Color) = (0.5, 0.5, 0.5, 1)

    _Shininess ("Shininess", Range (0.01, 1)) = 0.078125

    _Parallax ("Height", Range (0.005, 0.08)) = 0.02

    _MainTex ("Base (RGBA)", 2D) = "white" {}

      _MainTex_b ("Bumpmap (RGBA)", 2D) = "bump" {}

    _MainTex2 ("Base 2 (RGBA)", 2D) = "white" {}

          _MainTex2_b ("Bumpmap 2 (RGBA)", 2D) = "bump" {}

    _MainTex3 ("Base 3 (RGBA)", 2D) = "white" {}

          _MainTex3_b ("Bumpmap 3 (RGBA)", 2D) = "bump" {}

          _lightmap ("Lightmap", 2D) = "white" {}

    _Mask ("Mix Mask (RGBA)", 2D) = "gray" {}

}

 

Category {

 

Tags{   "RenderType"="Opaque"}

 

/* Upgrade NOTE: commented out, possibly part of old style per-pixel lighting: Blend AppSrcAdd AppDstAdd */ 

       

      Cull Back

    #warning Upgrade NOTE: SubShader commented out; uses Unity 2.x per-pixel lighting. You should rewrite shader into a Surface Shader.
/*SubShader {

    

            

UsePass "Diffuse/BASE" 

        Pass {

            Name "Blend_Layers"

            Tags { "LightMode" = "Pixel"}

             Color [_PPLAmbient]

          Material { Diffuse [_Color]       

  } 

 

                

CGPROGRAM

#pragma target 3.0

#pragma vertex vert

#pragma fragment frag

#pragma fragmentoption ARB_fog_exp2

#pragma fragmentoption ARB_precision_hint_fastest

#pragma multi_compile_builtin

#include "UnityCG.cginc"

#include "AutoLight.cginc"

 

 

 

 

struct v2f { 

 

    float4 pos : SV_POSITION;

    LIGHTING_COORDS

    half3  uv;

    half2 uv2 ;

        half3   viewDirT;

   half3  lightDirT;

 

}; 

half4 _MainTex_ST,_Mask_ST; 

 uniform float _Shininess;

 

v2f vert (appdata_tan v)

{

    v2f o;

    o.pos = mul (UNITY_MATRIX_MVP, v.vertex);

    o.uv.xy = 1-TRANSFORM_TEX(v.texcoord, _MainTex);

    o.uv.z = _Shininess * 128;

    o.uv2 = TRANSFORM_TEX(v.texcoord, _Mask);

    TANGENT_SPACE_ROTATION;

    o.viewDirT = mul( rotation, ObjSpaceViewDir( v.vertex ) );  

    o.lightDirT = mul( rotation, ObjSpaceLightDir( v.vertex ) );    

    TRANSFER_VERTEX_TO_FRAGMENT(o);

    return o;

}

 

uniform sampler2D _MainTex;

uniform sampler2D _MainTex2;

uniform sampler2D _MainTex3;

uniform sampler2D _MainTex_b;

uniform sampler2D _MainTex2_b;

uniform sampler2D _MainTex3_b;

uniform sampler2D _lightmap;

uniform sampler2D _Mask;

uniform half _Parallax;

uniform half _Roughness;

uniform half3 _Shadow;

//uniform half _Burn;

 

 

 

float4 frag (v2f i) : COLOR

{

 

 

   half4 mix = tex2D(_Mask,i.uv2);

                                

 

    half n1 = tex2D(_MainTex_b, i.uv.xy).a  ;

    half n2 = tex2D(_MainTex2_b, i.uv.xy).a  ;

    half n3 = tex2D(_MainTex3_b, i.uv.xy).a ;

 

    half result=n1;

    result=((result*(1-mix.g)) + n2*(mix.g));

    result=((result*(1-mix.b))+n3*(mix.b));

 

    half2 offset = ParallaxOffset( result, -_Parallax, i.viewDirT )+i.uv.xy;

 

        

    half3 normal1 = tex2D(_MainTex_b, (offset)).rgb * 2 -1;

    half3 normal2 = tex2D(_MainTex2_b, (offset)).rgb * 2 -1;

    half3 normal3 = tex2D(_MainTex3_b, (offset)).rgb * 2 -1;

 

    half3 resultn=normal1;

    resultn=  ((resultn*(1-mix.g)) + normal2*(mix.g));

    resultn=  ((resultn*(1-mix.b))+normal3*(mix.b));

 

 

 

    half4 col1 = tex2D(_MainTex,offset);

    half4 col2 = tex2D(_MainTex2,offset);

    half4 col3 = tex2D(_MainTex3,offset);

    

    

    half3 lightmap = tex2D(_lightmap,(i.uv2)).rgb;

        

    half4 result1=col1;

    result1=  ((result1*(1-mix.g)) + col2*(mix.g));

    result1=  ((result1*(1-mix.b))+col3*(mix.b));

 

    

    result1.rgb=lerp(result1.rgb,result1.rgb*_Shadow,-((result-1)+(resultn.r+resultn.g))*_Roughness);

        result1.rgb *=1.2*lightmap;

    

    return SpecularLight( i.lightDirT, i.viewDirT,resultn, result1,i.uv.z-result1.rgb*_Shadow, LIGHT_ATTENUATION(i) );

}

ENDCG              

        }

        }*/

        }

    

 

  Fallback "Diffuse", 1

 

}