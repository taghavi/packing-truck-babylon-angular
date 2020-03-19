// You have to create a function called createthis.scene. This function must return a BABYLON.this.scene object
// You can reference the following variables: this.scene, canvas
// You must at least define a camera
// More info here: https://doc.babylonjs.com/generals/The_Playground_Tutorial
import { ElementRef, Injectable, NgZone } from '@angular/core';
import {
  Engine,
  FreeCamera,
  Scene,
  Light,
  Mesh,
  Color3,
  Color4,
  Vector3,
  HemisphericLight,
  StandardMaterial,
  Texture,
  DynamicTexture,
  ArcRotateCamera,
  Plane
} from 'babylonjs';
import * as GUI from "babylonjs-gui"
import  'babylonjs-materials'
import { DataService } from '../services/data.service'



//var camera;
var draggableObj = [], holders = [];
//const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;


// Get the canvas element from the DOM.

// Associate a Babylon Engine to it.
//const engine = new Engine(canvas);
//var this.scene = new BABYLON.this.scene(this.engine);
@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private light: Light;

  public constructor(private ngZone: NgZone) { }

  public createScene = function (canvas) {

    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new Engine(this.canvas, true);

    // create a basic BJS this.scene object
    this.scene = new Scene(this.engine);

    this.scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);
    //Set gravity for the scene (G force like, on Y-axis)
    this.scene.gravity = new BABYLON.Vector3(0, -9.9, 0);

    // Enable Collisions
    this.scene.collisionsEnabled = true;

    this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, 1.1, 170, BABYLON.Vector3.Zero(), this.scene);
    //  camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), this.scene);
    this.camera.applyGravity = true;
    this.camera.attachControl(this.canvas, false);
    // camera.lowerRadiusLimit = 40;
    // camera.upperRadiusLimit = 300;
    // camera.upperBetaLimit = null;
    this.camera.panningSensibility = 0;
    this.scene.activeCamera = this.camera;

    this.camera.lowerBetaLimit = 0.1;
    this.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    this.camera.lowerRadiusLimit = 150;
    this.camera.checkCollisions = true
    this.camera.collisionRadius = new BABYLON.Vector3(0.5, 0.5, 0.5)
    //camera.setPosition(new BABYLON.Vector3(.120, .120, .140));
    // main view
    var left = .15;
    var bottom = .05;
    var width = .79;
    var height = .95;
    var viewport = new BABYLON.Viewport(left, bottom, width, height);
    this.camera.viewport = viewport;

    console.log(this.camera);
    //add_border_design(this.scene);
    // lights
    this.light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, -0.5, 0), this.scene);

      
    

    var hightCont = 26, widthCont = 24, lenghtCont = 136;
    //the grid
    
    var ground = BABYLON.Mesh.CreateGround("ground", lenghtCont, widthCont, 1, this.scene, false);//  BABYLON.MeshBuilder.CreatePlane("ground", {width:120,height:30}, this.scene);//BABYLON.Mesh.CreatePlane("plane", 100.0, this.scene);
    ground.renderingGroupId = 1;
    ground.checkCollisions = true;
    //the grid
    var groundMaterial = new BABYLON.GridMaterial("groundMaterial", this.scene);
    groundMaterial.majorUnitFrequency = 3;
    groundMaterial.minorUnitVisibility = 0.3;
    groundMaterial.gridRatio = 2;
    groundMaterial.backFaceCulling = false;
    groundMaterial.mainColor = BABYLON.Color3.Black();
    groundMaterial.lineColor = BABYLON.Color3.Black();
    groundMaterial.opacity = .99;
    //  ground.rotation.x = Math.PI/2;
    var groundMaterial1 = new BABYLON.StandardMaterial("ground", this.scene);
    groundMaterial1.diffuseColor = BABYLON.Color3.Gray();
    // groundMaterial1.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    // groundMaterial1.emissiveColor = new BABYLON.Color3(1, 1, 1);
    // groundMaterial1.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);    
    ground.material = groundMaterial;

    var mat2 = new BABYLON.StandardMaterial('mat2', this.scene);
    mat2.diffuseColor = BABYLON.Color3.FromHexString("#f8ff26");
    var wallTexture = new BABYLON.Texture('assets/textures/wallyellow.jpg', this.scene);
    mat2.diffuseTexture = wallTexture;
    var leftPrt = BABYLON.MeshBuilder.CreateBox("leftPrt", { size: 10, height: hightCont, width: lenghtCont, depth: .52 }, this.scene);
    leftPrt.position = new BABYLON.Vector3(0, hightCont / 2, widthCont / 2);
    leftPrt.material = mat2;

    var rightPrt = BABYLON.MeshBuilder.CreateBox("rightPrt", { size: 10, height: hightCont, width: lenghtCont, depth: .52 }, this.scene);
    rightPrt.position = new BABYLON.Vector3(0, hightCont / 2, -widthCont / 2);
    rightPrt.material = mat2;

    var backPrt = BABYLON.MeshBuilder.CreateBox("rightPrt", { size: 10, height: hightCont, width: widthCont, depth: .52 }, this.scene);
    backPrt.position = new BABYLON.Vector3(lenghtCont / 2, hightCont / 2, 0);
    backPrt.material = mat2;
    backPrt.rotation.y += 4.7;

    /*-----------------------Wheel------------------------------------------*/

    //Wheel Material 
    var wheelMaterial = new BABYLON.StandardMaterial("wheel_mat", this.scene);
    // var wheelTexture = new BABYLON.Texture("http://i.imgur.com/ZUWbT6L.png", this.scene);
    var wheelTexture = new BABYLON.Texture('assets/textures/tyre.png', this.scene);
    wheelMaterial.diffuseTexture = wheelTexture;
    
    //Set color for wheel tread as black
    var faceColors = [];
    faceColors[2] = new BABYLON.Color3(0, 0, 0);

    //set texture for flat face of wheel 
    var faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.5, 1);
    faceUV[1] = new BABYLON.Vector4(0.5, 0.5, 1, 1);
    //faceUV[2] = new BABYLON.Vector4(0, 0, 0.5, 0.5);

    //create wheel front inside and apply material
    var wheelFI = BABYLON.MeshBuilder.CreateCylinder("wheelFI", { diameter: 13, height: 5, tessellation: 24, faceColors: faceColors, faceUV: faceUV }, this.scene);
    wheelFI.material = wheelMaterial;

    //rotate wheel so tread in xz plane  
    wheelFI.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
    //	wheelFI.parent = ground;  


    /*-----------------------End Wheel------------------------------------------*/

    /*------------Create other Wheels as Instances, Parent and Position----------*/
    var wheelFO = wheelFI.createInstance("FO");
    // wheelFO.parent = ground;
    wheelFO.position = new BABYLON.Vector3(-lenghtCont / 3, -hightCont / 3, -widthCont / 2);

    var wheelRI = wheelFI.createInstance("RI");
    // wheelRI.parent = carBody;
    wheelRI.position = new BABYLON.Vector3(-lenghtCont / 3, -hightCont / 3, widthCont / 2);
    wheelRI.addRotation(3.14159,0,0);// this number is in radian equal to 180 degree
    var wheelRO = wheelFI.createInstance("RO");
    //   wheelRO.parent = carBody;
    wheelRO.position = new BABYLON.Vector3(-lenghtCont / 4 + 1, -hightCont / 3, widthCont / 2);
    wheelRO.addRotation(3.14159,0,0);// this number is in radian equal to 180 degree

    wheelFI.position = new BABYLON.Vector3(-lenghtCont / 4 + 1, -hightCont / 3, -widthCont / 2);

    this.scene.registerAfterRender(function () {
      wheelFI.rotate(BABYLON.Axis.Z, -Math.PI / 64, BABYLON.Space.WORLD);
      wheelFO.rotate(BABYLON.Axis.Z, -Math.PI / 64, BABYLON.Space.WORLD);
      wheelRI.rotate(BABYLON.Axis.Z, -Math.PI / 64, BABYLON.Space.WORLD);
      wheelRO.rotate(BABYLON.Axis.Z, -Math.PI / 64, BABYLON.Space.WORLD);

    });
    /*------------End Create other Wheels as Instances, Parent and Position----------*/


    //  // Light
    //  var light = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 50, 0), this.scene);

    // var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, this.scene, false);
    // var groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
    // groundMaterial.specularColor = BABYLON.Color3.Black();
    // ground.material = groundMaterial;

    //header menu plane
    var plane = BABYLON.MeshBuilder.CreatePlane("CamPlane", { width: 300, height: 30 }, this.scene);
    plane.rotation.x = Math.PI / 2 - 1.1;
    plane.renderingGroupId = 2;
    plane.position.y = 68;
    //plane.position.z = 0;
    plane.position.x = 0;
    plane.setParent(this.camera);
    //imaginary plane
    // var imPlane = BABYLON.Mesh.CreatePlane("imCamPlane", 400.0, this.scene);
    // imPlane.rotation.x = Math.PI/2 -1.1;
    // //imPlane.isVisible = false;
    // imPlane.scaling.y = 2;
    // imPlane.position.z = 300;
    // imPlane.setParent(camera);
    // imPlane.material = new BABYLON.StandardMaterial("SA", this.scene);
    // imPlane.material.alpha = 0.5;

    //draggable objects


    this.scene.registerBeforeRender(function () {

      for (let i = 0; i < holders.length; i++) {
        holders[i].rotation.y += 0.01;
      }
    });


    //drag and drop stuff
    // Events
    //  var canvas = engine.getRenderingCanvas();
    var newParentFlag = false;
    var startingPoint;
    var currentMesh;
    var _this = this;
    var getGroundPosition = function (evt?) {
      // Use a predicate to get position on the ground


      if (currentMesh.menu == true) {

        var pickinfo = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY, function (mesh) { return mesh == plane; });

      }
      else {
        var pickinfo = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY, function (mesh) { return mesh == ground; });

      }

      if (pickinfo.hit) {
        return pickinfo.pickedPoint;
      }

      return null;
    }


    var planeNormal;
    var pickObject = function () {
      return _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY, function (m) { return m != ground });
    }
    var pickParent = function (mesh) {
      return _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY, function (m) { return m != mesh; });
    }


    var onPointerDown = function (evt1) {
      let evt = evt1.event;
      
      if (evt.button !== 0) {
        return;
      }
debugger;
      var elem = document.getElementById('buttonbox');
      if(elem){
        elem.parentNode.removeChild(elem);
        currentMesh.showBoundingBox = false;
        currentMesh.doubleClick = false;

      }
      
      // check if we are under a mesh

      var pickInfo = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY, function (mesh) { return draggableObj.indexOf(mesh) > -1; });
      // var pickInfo = pickObject();
      if (pickInfo.hit) {
        currentMesh = pickInfo.pickedMesh;

        if (currentMesh.menu == true) {
          currentMesh.setParent(null);
        }

        //  startingPoint = getGroundPosition(evt); //mori
        currentMesh.showBoundingBox = true;
        console.log(startingPoint)
        var pickParentInfo = pickParent(currentMesh); //mm
        if (pickParentInfo.hit) {//startingPoint ) { // we need to disconnect camera from canvas

          setTimeout(function () {
            if (currentMesh.menu) {
              // currentMesh.position.y = 10;
              currentMesh.rotation = BABYLON.Vector3.Zero();
              startingPoint = getGroundPosition(evt);
            }
            else if (pickParentInfo.hit) {
              startingPoint = pickParentInfo.pickedPoint;
              planeNormal = pickParentInfo.getNormal(true);

              currentMesh.showBoundingBox = true;
            }
            //    planeNormal = pickParentInfo.getNormal(true); //mm
            _this.camera.detachControl(_this.canvas);
          }, 0);
        }
      }
console.log('pointerDown')
    }

    var onPointerUp = function () {
      //debugger;
      if (startingPoint) {
        if(newParentFlag){
          let ap = currentMesh.getAbsolutePosition()                     
          currentMesh.parent = newParentFlag;
          currentMesh.setAbsolutePosition(ap);
          newParentFlag = false;
      }
        _this.camera.attachControl(_this.canvas, true);
        if (currentMesh.menu) {
          var pickingInfo = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY, function (mesh) { return mesh.name === 'ground'; }, false);

          if (pickingInfo.pickedMesh !== null) {
            currentMesh.position = pickingInfo.pickedPoint;
          }
          else {

            // Do what you need to do in case the drop point is out of the grid
            currentMesh.position = BABYLON.Vector3.Zero();
          }
          currentMesh.menu = false;
          currentMesh.parent = ground;
          currentMesh.position.y = currentMesh.getBoundingInfo().boundingBox.extendSize.y;
        }
        if(currentMesh.doubleClick == true){
          currentMesh.showBoundingBox = true;
        }
        else {
          currentMesh.showBoundingBox = false;
        }
        
        // currentMesh.setParent(ground);
        planeNormal = null;
        //  currentMesh.position.y = 8;
        startingPoint = null;
        
        return;
      }console.log('pointerUP');
    }

    var onPointerMove = function (evt) {
      if (!startingPoint) {
        return;
      }

      var current = getGroundPosition(evt); //mori

      if (!current) {
        return;
      }

      if (currentMesh.menu == true) {
        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);
      }
      else {
        var pickParentInfo = pickParent(currentMesh);
        if (!pickParentInfo.hit) {
          return;
        }

        var current = pickParentInfo.pickedPoint;
        var normal = pickParentInfo.getNormal(true);
        var parentMesh = pickParentInfo.pickedMesh;
        if (parentMesh == currentMesh.parent &&
          normal.x == planeNormal.x &&
          normal.y == planeNormal.y &&
          normal.z == planeNormal.z) {

          var dragVector = current.subtract(startingPoint);
          currentMesh.position.addInPlace(dragVector);
        }
        else {
          var displacement = new BABYLON.Vector3(-0.5, -0.5, -0.5); //TODO: calcular esse vetor de acordo com o ponto zero do mesh
          var vector = normal.multiply(displacement);
          var boundingInfo = currentMesh.getBoundingInfo();
          var dimensions = boundingInfo.maximum.subtract(boundingInfo.minimum);
          var diff1 = dimensions.multiply(vector);
          var absolutePosition = current.subtract(diff1);

          // currentMesh.parent = parentMesh;
          // currentMesh.absolutePosition = absolutePosition;
          // currentMesh.setAbsolutePosition(absolutePosition);
          currentMesh.setAbsolutePosition(absolutePosition.clone());
          newParentFlag = parentMesh;
          planeNormal = normal;
        }
      }


      startingPoint = current;
    }


var onDoubleClick = function(e){
  
  currentMesh = e.pickInfo.pickedMesh;
  currentMesh.boundingBox = true;
  currentMesh.doubleClick = true;
  var buttonbox = document.createElement('div');
    buttonbox.id = "buttonbox";
    buttonbox.style.position = "absolute";
    buttonbox.style.top = e.event.clientY.toString() + "px";
    buttonbox.style.left = e.event.clientX.toString() + "px";
    buttonbox.style.border = "3pt inset blue";
    buttonbox.style.padding = "1pt";
    buttonbox.style.paddingRight = "1pt";
    buttonbox.style.width = "10em";
    buttonbox.style.display = "block";
    document.body.appendChild(buttonbox);
  var b15 = document.createElement('button');
  b15.id = "ShowHidemyMeshTwo";
  b15.textContent = "Delete";
  b15.style.display = "block";
  b15.style.color = "black";
  b15.style.width = "100%";
  b15.style.fontSize = "1.1em";
  buttonbox.appendChild(b15);
  b15.onclick = function() {
      // Show/Hide myMeshThree
      console.log(e.pickInfo.pickedMesh);
          e.pickInfo.pickedMesh.setEnabled(false); 
          e.pickInfo.pickedMesh.dispose();
          var elem = document.getElementById('buttonbox');
          elem.parentNode.removeChild(elem);
  }
}

    this.scene.onPointerObservable.add((e)=>{
      //console.log(e)
      switch(e.type){
          case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
            debugger;
            if(e.pickInfo.pickedMesh){
            if(e.pickInfo.pickedMesh.name.includes("boxInContainer")){              
            console.log("POINTER DOUBLE-TAP");
            onDoubleClick(e);            
          }
        }
            break;
          case BABYLON.PointerEventTypes.POINTERDOWN:
            
            //Pointer Down
            onPointerDown(e)
          break;
          case BABYLON.PointerEventTypes.POINTERUP:
            //Pointer Down
            onPointerUp()
          break;
          case BABYLON.PointerEventTypes.POINTERMOVE:
            //Pointer Move
            onPointerMove(e)
          break;
          
      }
  })

    // this.canvas.addEventListener("pointerdown", onPointerDown, false);
    // this.canvas.addEventListener("pointerup", onPointerUp, false);
    // this.canvas.addEventListener("pointermove", onPointerMove, false);

    // this.scene.onDispose = function () {
    //   this.canvas.removeEventListener("pointerdown", onPointerDown);
    //   this.canvas.removeEventListener("pointerup", onPointerUp);
    //   this.canvas.removeEventListener("pointermove", onPointerMove);
    // }

    //picking function
    var pickWithRay = function (point) {
      var newP = point;

      console.log(newP)

      var rayPick = new BABYLON.Ray(point, new BABYLON.Vector3(0, -1, 0));
      var meshFound = this.scene.pickWithRay(rayPick, function (m) { return (m != currentMesh); });// && (m!=imPlane);});

      console.log(meshFound)

      if (meshFound != null && meshFound.pickedPoint != null) {
        console.log(meshFound.pickedPoint)
        newP = meshFound.pickedPoint;
      }
      return newP;
    }

    return { scene: this.scene, plane: plane, camera: this.camera, canvas: this.canvas };
  }
  //============================================================================


  // public settingCameras(scene)
  // {
  //     //main camera
  // 	this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI/2, 1.1, 170, BABYLON.Vector3.Zero(), scene);
  //   //  camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), this.scene);

  //     camera.attachControl(this.canvas,false);
  // 	// camera.lowerRadiusLimit = 40;
  // 	// camera.upperRadiusLimit = 300;
  // 	// camera.upperBetaLimit = null;
  // 	camera.panningSensibility = 0; 	
  //     this.scene.activeCamera = camera;

  //     camera.lowerBetaLimit = 0.1;
  //     camera.upperBetaLimit = (Math.PI / 2) * 0.99;
  //     camera.lowerRadiusLimit = 150;
  //   //camera.setPosition(new BABYLON.Vector3(.120, .120, .140));
  // 	// main view
  // 	var left = .15;
  // 	var bottom = .05;
  // 	var width = .7;
  // 	var height = .9;
  // 	var viewport = new BABYLON.Viewport(left, bottom, width, height);
  // 	camera.viewport = viewport;

  //     //add_border_design(this.scene);
  //     // lights
  //   	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, -0.5, 0), scene);

  // }

  private resetCamera(cam: BABYLON.ArcRotateCamera): void {
    cam.alpha = -1.5707963267948966;
    cam.beta = 1.1;
  }

  public AddBox(res, inputSizes): void {
    setTimeout( () => {
      // res.camera.detachControl(res.canvas);
      this.resetCamera(res.camera);
      console.log('these are the sizes enterd:');
      console.log(holders.length);

      var obj = BABYLON.MeshBuilder.CreateBox("boxInContainer" + holders.length.toString(),
        { height: inputSizes.height, width: inputSizes.width, depth: inputSizes.length }, res.scene);
      var mat = new BABYLON.StandardMaterial("boxMaterial", res.scene);
      mat.emissiveColor = BABYLON.Color3.Random();
      //adding name of each box 
      var textureGround = new BABYLON.DynamicTexture("dynamic texture", {width:512, height:256}, res.scene,false);   
      var textureContext = textureGround.getContext();
      mat.diffuseTexture = textureGround;
      var font = "bold 64px monospace";
      textureGround.drawText( inputSizes.name, 95, 135, font, "green", "white", true, true);
//-------------------------------------------------------
 
      obj.material = mat;
      obj['menu'] = true;
      obj.renderingGroupId = 3;
      //obj.position.y = -150;
      // obj.position.x = 100;        
      var n = new BABYLON.TransformNode("root1", res.scene);
      // n.setPositionWithLocalVector(new BABYLON.Vector3(-90 + holders.length*60, 30, 300),BABYLON.Space.WORLD);

      // console.log(n.getPivotPoint());
      // console.log(n.getPositionExpressedInLocalSpace())
      // console.log(n.getPositionInCameraSpace());
      n.position = new BABYLON.Vector3(-220 + holders.length * 60, 30, 300);
      n.setParent(res.plane);
      obj.parent = n;
      console.log(n.position);
      draggableObj.push(obj);
      holders.push(n);

      res.camera.attachControl(res.canvas);
    }, 0);

  }
  public add_border_design() {
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene); //if we don't put this.scene there will be error
    for (var i = 0; i < 4; i++) {
      var stack = new GUI.StackPanel('s1');
      stack.background = "#3a3a3a";
      if (i % 2 == 0) {
        stack.width = "3px";
        stack.height = "100%";
        stack.horizontalAlignment = i / 2;
      } else {
        stack.height = "2px";
        stack.width = "100%";
        stack.verticalAlignment = (i - 1) / 2;
      }
      advancedTexture.addControl(stack);
    }
  }


  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene.render();
      };

      if (document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }

      window.addEventListener('resize', () => {
        this.engine.resize();
      });
    });
  }


  // var this.scene1 = createthis.scene();

  // engine.runRenderLoop(() => {
  //     this.scene1.render();
  // });
  // window.addEventListener('resize', function() {
  //     engine.resize();
  // });

}