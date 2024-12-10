class ModelsLoader {
    constructor() {
        this.loader = new THREE.GLTFLoader();
        this.models = {};
    }
  
    async loadModel(path, modelName) {
        try {
            const gltf = await new Promise((resolve, reject) => {
                this.loader.load(path, resolve, 
                    // Progress callback
                    (progress) => {
                        console.log(`Loading ${modelName}: ${(progress.loaded / progress.total * 100)}%`);
                    },
                    // Error callback
                    reject
                );
            });
            this.models[modelName] = gltf.scene;
            console.log(`Successfully loaded ${modelName}`);
            return gltf.scene;
        } catch (error) {
            console.error(`Error loading model ${modelName}:`, error);
            throw error;
        }
    }
  
    getModel(modelName) {
        return this.models[modelName];
    }
}

export { ModelsLoader };