class Cliffs {
    constructor(scene, groundLength, movementLimit) {
      this.scene = scene;
      this.groundLength = groundLength;
      this.movementLimit = movementLimit;
  
      // Create cliff material with texture
      const cliffTexture = new THREE.TextureLoader().load('Cliffs.jpg');
      cliffTexture.wrapS = THREE.RepeatWrapping;
      cliffTexture.wrapT = THREE.RepeatWrapping;
  
      this.cliffMaterial = new THREE.MeshLambertMaterial({
        color: 0x808080,
        map: cliffTexture,
        emissive: 0x101010,
      });
  
      // Create the left and right cliffs
      this.leftCliff = this.createCliff(-this.movementLimit - 44, Math.PI / 8);
      this.rightCliff = this.createCliff(this.movementLimit + 44, -Math.PI / 8);
  
      // Add the cliffs to the scene
      this.scene.add(this.leftCliff);
      this.scene.add(this.rightCliff);
  
      // Bounding boxes for collision detection
      this.leftCliffBox = new THREE.Box3().setFromObject(this.leftCliff);
      this.rightCliffBox = new THREE.Box3().setFromObject(this.rightCliff);
    }
  
    createCliff(positionX, rotationZ) {
      const cliffGeometry = new THREE.BoxGeometry(50, 100, this.groundLength * 25);
  
      // Modify UV mapping to prevent stretching
      cliffGeometry.computeVertexNormals(); // Ensure proper shading and lighting
      const cliffUvs = cliffGeometry.attributes.uv.array;
      for (let i = 0; i < cliffUvs.length; i += 2) {
        cliffUvs[i] = cliffUvs[i] * (this.groundLength * 4 / 50); // X-axis scaling
        cliffUvs[i + 1] = cliffUvs[i + 1] * (this.groundLength * 4 / 50); // Y-axis scaling
      }
  
      const cliff = new THREE.Mesh(cliffGeometry, this.cliffMaterial);
      cliff.position.set(positionX, 5, 0); // Position cliff
      cliff.rotation.z = rotationZ; // Tilt outward
      cliff.castShadow = false;
      cliff.receiveShadow = false;
  
      return cliff;
    }
  }
  
  export { Cliffs };
  