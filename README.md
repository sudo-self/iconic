## <a href="https://iconic.jessejesse.xyz">iconic - HQ icon Generator</a>

<img width="1440" height="820" alt="iconic-og" src="https://github.com/user-attachments/assets/5519f71b-8b89-4d1c-96d7-084bf7636f05" />

### 10+ Project Icons and an SVG

<img width="259" height="257" alt="Screenshot 2025-07-24 at 2 52 45 AM" src="https://github.com/user-attachments/assets/8cf570dc-8ae9-44b3-a0d1-e753a9c134f8" />

### <a href="https://developers.cloudflare.com/workers-ai/models/stable-diffusion-xl-base-1.0/">workers-ai/models/stable-diffusion-xl-base-1.0</a>

#### curl
```

curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0  \
  -X POST  \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"  \
  -d '{ "prompt": "cyberpunk cat" }'
```

#### api

```

{
    "type": "object",
    "properties": {
        "prompt": {
            "type": "string",
            "minLength": 1,
            "description": "A text description of the image you want to generate"
        },
        "negative_prompt": {
            "type": "string",
            "description": "Text describing elements to avoid in the generated image"
        },
        "height": {
            "type": "integer",
            "minimum": 256,
            "maximum": 2048,
            "description": "The height of the generated image in pixels"
        },
        "width": {
            "type": "integer",
            "minimum": 256,
            "maximum": 2048,
            "description": "The width of the generated image in pixels"
        },
        "image": {
            "type": "array",
            "description": "For use with img2img tasks. An array of integers that represent the image data constrained to 8-bit unsigned integer values",
            "items": {
                "type": "number",
                "description": "A value between 0 and 255"
            }
        },
        "image_b64": {
            "type": "string",
            "description": "For use with img2img tasks. A base64-encoded string of the input image"
        },
        "mask": {
            "type": "array",
            "description": "An array representing An array of integers that represent mask image data for inpainting constrained to 8-bit unsigned integer values",
            "items": {
                "type": "number",
                "description": "A value between 0 and 255"
            }
        },
        "num_steps": {
            "type": "integer",
            "default": 20,
            "maximum": 20,
            "description": "The number of diffusion steps; higher values can improve quality but take longer"
        },
        "strength": {
            "type": "number",
            "default": 1,
            "description": "A value between 0 and 1 indicating how strongly to apply the transformation during img2img tasks; lower values make the output closer to the input image"
        },
        "guidance": {
            "type": "number",
            "default": 7.5,
            "description": "Controls how closely the generated image should adhere to the prompt; higher values make the image more aligned with the prompt"
        },
        "seed": {
            "type": "integer",
            "description": "Random seed for reproducibility of the image generation"
        }
    },
    "required": [
        "prompt"
    ]
}

```
