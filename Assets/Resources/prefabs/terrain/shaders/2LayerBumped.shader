// Upgrade NOTE: replaced 'PositionFog()' with multiply of UNITY_MATRIX_MVP by position
// Upgrade NOTE: replaced 'V2F_POS_FOG' with 'float4 pos : SV_POSITION'

Shader "Terrain/TwoLayer Bumped" {
Properties {
    _Color ("Main Color", Color) = (1,1,1,0.5)
    _MainTex ("Base (RGB)", 2D) = "white" {}
    _MainTex2 ("Base 2 (RGB)", 2D) = "white" {}
    _Mask ("Mix Mask (A)", 2D) = "gray" {}
    _BumpMap ("Bumpmap (RGB)", 2D) = "bump" {}
}
 
Category {
    /* Upgrade NOTE: commented out, possibly part of old style per-pixel lighting: Blend AppSrcAdd AppDstAdd */
    Fog { Color [_AddFog] }
 
    // ------------------------------------------------------------------
    // ARB fragment program
    
    #warning Upgrade NOTE: SubShader commented out; uses Unity 2.x per-pixel lighting. You should rewrite shader into a Surface Shader.
/*SubShader {
        // Ambient pass
        Pass {
            Tags {"LightMode" = "Always" /* Upgrade NOTE: changed from PixelOrNone to Always */}
            Color [_PPLAmbient]
            SetTexture [_MainTex] { combine texture }
            SetTexture [_Mask] { combine previous, texture }
            SetTexture [_MainTex2] { combine texture lerp (previous) previous }
            SetTexture [_MainTex2] { constantColor [_Color] combine previous * primary DOUBLE, previous * constant }
        }
        // Vertex lights
        Pass { 
            Tags {"LightMode" = "Vertex"}
            Lighting On
            Material {
                Diffuse [_Color]
                Emission [_PPLAmbient]
            }
            SetTexture [_MainTex] { combine texture }
            SetTexture [_Mask] { combine previous, texture }
            SetTexture [_MainTex2] { combine texture lerp (previous) previous }
            SetTexture [_MainTex2] { constantColor [_Color] combine previous * primary DOUBLE, previous * constant }
        }
        
        // Pixel lights
        Pass {
            Name "PPL"
            Tags { "LightMode" = "Pixel" }
                
CGPROGRAM
// Upgrade NOTE: excluded shader from DX11 and Xbox360; has structs without semantics (struct v2f members uv,lightDirT)
#pragma exclude_renderers d3d11 xbox360
// Upgrade NOTE: excluded shader from Xbox360; has structs without semantics (struct v2f members uv,lightDirT)
#pragma exclude_renderers xbox360
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
    float2  uv[4];
    float3  lightDirT;
}; 

float4 _MainTex_ST, _MainTex2_ST, _Mask_ST, _BumpMap_ST; 
 
v2f vert (appdata_tan v)
{
    v2f o;
    o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
    o.uv[0] = TRANSFORM_TEX(v.texcoord, _MainTex);
    o.uv[1] = TRANSFORM_TEX(v.texcoord, _MainTex2);
    o.uv[2] = TRANSFORM_TEX(v.texcoord, _Mask);
    o.uv[3] = TRANSFORM_TEX(v.texcoord, _BumpMap);
    
    TANGENT_SPACE_ROTATION;
    o.lightDirT = mul( rotation, ObjSpaceLightDir( v.vertex ) );    
    
    TRANSFER_VERTEX_TO_FRAGMENT(o);
    return o;
}
 
uniform sampler2D _MainTex;
uniform sampler2D _MainTex2;
uniform sampler2D _Mask;
uniform sampler2D _BumpMap;
 
float4 frag (v2f i) : COLOR
{
    half4 col1 = tex2D(_MainTex,i.uv[0]);
    half4 col2 = tex2D(_MainTex2,i.uv[1]);
    half mix = tex2D(_Mask,i.uv[2]).a;
    half4 texcol = lerp(col1,col2,mix);
    
    // get normal from the normal map
    float3 normal = tex2D(_BumpMap, i.uv[3]).xyz * 2 - 1;
    
    return DiffuseLight( i.lightDirT, normal, texcol, LIGHT_ATTENUATION(i) );
}
ENDCG              
        }
    }*/
    
    // ------------------------------------------------------------------
    // Four texture cards
    
    SubShader {
        // Vertex lit
        Pass { 
            Lighting On
            Material {
                Diffuse [_Color]
                Ambient [_Color]
            }
            SetTexture [_MainTex] { combine texture }
            SetTexture [_Mask] { combine previous, texture }
            SetTexture [_MainTex2] { combine texture lerp (previous) previous }
            SetTexture [_MainTex2] { constantColor [_Color] combine previous * primary DOUBLE, previous * constant }
        }
    }
}
 
FallBack "VertexLit"
 
}
