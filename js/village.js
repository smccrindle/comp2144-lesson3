// Get the canvas element as a const
const canvas = document.getElementById("renderCanvas");
// Create the BABYON 3D engine, and attach it to the canvas
const engine = new BABYLON.Engine(canvas, true);
// The createScene function
const createScene = function() {
    // Create a new BABYLON scene, passing in the engine as an argument
    const scene = new BABYLON.Scene(engine);
    
    // Add a camera and allow it to control the canvas
    // const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0)); // Add Arc Rotate Camera
    // camera.attachControl(canvas, true);
    // Replace the above two lines of code for the camera with the below XR if you have a headset
    
    // Include a light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    
    // STEP 1: Add a ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10});

    // STEP 9: Colour the ground
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0.33, 0.42, 0.18);
    ground.material = groundMat;

    // STEP 12b: Add an array to position the image properly on each of the four visible sides (notice we will not set 4 and 5)
    //options parameter to set different images on each side
    const faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0); //rear face
    faceUV[1] = new BABYLON.Vector4(0.3, 0.0, 0.5, 1.0); //front face
    faceUV[2] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //right side
    faceUV[3] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //left side    

    // STEP 2: Add a box to serve as a house
    // const box = BABYLON.MeshBuilder.CreateBox("box", {});
    // STEP 12c: Change the above declaration to include a material wrap
    const box = BABYLON.MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});

    // STEP 3a: Preview the result - noticing that the box is sunk into the ground
    // STEP 3b: Adjust the vertical position of the box (default box height is 1 size unit)
    box.position.y = 0.5;

    // STEP 5a: Scale the box to resemble more of a house shape
    box.scaling.x = 2;
    box.scaling.y = 1.5;
    box.scaling.z = 3;
    // STEP 5b: ...or use a vector object to scale the box instead
    // box.scaling = new BABYLON.Vector3(2, 1.5, 3);

    // STEP 6a: Repostion the box 
    box.position.x = 1;
    box.position.y = 0.75; // Box is now 1.5 units in height, so to sit on the ground, we need to raise it up 0.75
    box.position.z = 2;
    // STEP 6b: ...or with a vector object
    // box.position = new BABYLON.Vector3(4, 0.75, -5);

    // STEP 7: Rotate the box (Babylon.JS uses radians - so convert if you wish)
    box.rotation.y = Math.PI / 4;
    box.rotation.y = BABYLON.Tools.ToRadians(45);

    // STEP 11: Add a texture to the walls of the house (the box)
    const boxMat = new BABYLON.StandardMaterial("boxMat");
    // boxMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png");
    boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/semihouse.png");
    box.material = boxMat;

    // STEP 12a: Change the texture above to use an image with doors and windows instead
    
    // STEP 8a: Build a roof - using a cylinder mesh
    const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 2.8, height: 3.5, tessellation: 3});
    // STEP 8b: 
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2; // 90deg
    roof.rotation.y = Math.PI / -4;
    roof.position.x = 1;
    roof.position.y = 2;
    roof.position.z = 2;

    // STEP 10: Add a texture to the roof
    const roofMat = new BABYLON.StandardMaterial("roofMat");
    roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
    roof.material = roofMat;

    // STEP 13a: Let's combine the box and the roof meshes into one mesh called 'house'
    // const house = BABYLON.Mesh.MergeMeshes([box, roof]);
    // STEP 13b: Yikes - now the two meshes share the same material - we must allow multiple materials within the same mesh
    const house = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);

    // STEP 4: Add some ambient sounds ("Chirping Birds Ambience" by Alex from Pixabay - https://pixabay.com/sound-effects/search/birds%20chirping/)
    // const sound = new BABYLON.Sound("birds", "../media/chirping-birds-ambience-217410.mp3", scene, null, { loop: true, autoplay: true });
    
    // Return the scene
    return scene;
}

// Fire up the XR session
const xr = await scene.createDefaultXRExperienceAsync({ 
    // ... other options
    uiOptions: { 
        sessionMode: BABYLON.WebXRSessionMode.IMMERSIVE_VR 
    } 
});
const featureManager = xr.baseExperience.featuresManager;
featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT);

// Call the createScene function
const scene = createScene();
// Use the runRenderLoop() method to render the scene repeatedly
engine.runRenderLoop(function(){
    scene.render();
})
// Add an event listener that adapts to the user resizing the screen
window.addEventListener("resize", function() {
    engine.resize();
})
