<template>
  <div class="viewer">
    <canvas ref="canvas" touch-action="none" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  AssetsManager,
  MeshAssetTask,
  MeshBuilder,
  StandardMaterial,
  Texture,
  ActionManager,
  ExecuteCodeAction,
  ActionEvent,
  CannonJSPlugin,
  PhysicsImpostor,
  Mesh
} from '@babylonjs/core'
import '@babylonjs/core/Loading/loadingScreen'
import '@babylonjs/core/Collisions/collisionCoordinator'

// import '@babylonjs/loaders'
import { SkyMaterial } from '@babylonjs/materials/sky/skyMaterial'

@Component
export default class Viewer extends Vue {
  private engine!: Engine
  private scene!: Scene
  private camera!: FreeCamera
  private assetsManager!: AssetsManager

  private async mounted () {
    const canvas = this.$refs.canvas as HTMLCanvasElement
    this.engine = new Engine(canvas)

    this.scene = new Scene(this.engine)

    this.camera = new FreeCamera('camera', new Vector3(0, 2, 0), this.scene)
    this.camera.attachControl(canvas, true)
    this.camera.ellipsoid = new Vector3(1, 1, 1)

    const light = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7

    const gravityVector = new Vector3(0, -9.81, 0)
    const physicsPlugin = new CannonJSPlugin()
    this.scene.enablePhysics(gravityVector, physicsPlugin)

    // this.assetsManager = new AssetsManager(this.scene)
    //
    // this.loadAsset('model task', this.modelUrl)
    //   .then((task) => {
    //     const mesh = task.loadedMeshes[0]
    //     this.camera.setTarget(mesh.position)
    //   })
    //
    // this.assetsManager.load()

    // https://doc.babylonjs.com/extensions/sky
    const skybox = MeshBuilder.CreateBox('skybox', { size: 1000 }, this.scene)
    const skyMaterial = new SkyMaterial('skyMaterial', this.scene)
    skyMaterial.backFaceCulling = false
    skybox.material = skyMaterial

    const ground = MeshBuilder.CreateBox('ground', { width: 100, depth: 100, height: 1 }, this.scene)
    // ground.material = new StandardMaterial('groundMat', this.scene)
    // ground.material.backFaceCulling = false
    // ground.checkCollisions = true
    ground.receiveShadows = true
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, this.scene)

    const menuBoxes = [
      { name: 'box1', position: new Vector3(-2, 1, -5), url: 'https://www.google.com/', physicsEnabled: true, texture: '../assets/TestCactus1.png' },
      { name: 'box2', position: new Vector3(0, 1, -5), url: 'https://www.google.com/', physicsEnabled: true, texture: 'assets/TestCactus2.png' },
      { name: 'box3', position: new Vector3(2, 1, -5), url: 'https://www.google.com/', physicsEnabled: true, texture: 'assets/TestCactus3.png' },
      { name: 'box4', position: new Vector3(-2, 3, -5), url: 'https://www.google.com/', physicsEnabled: false, texture: 'assets/TestCactus1.png' },
      { name: 'box5', position: new Vector3(0, 3, -5), url: 'https://www.google.com/', physicsEnabled: false, texture: 'assets/TestCactus2.png' },
      { name: 'box6', position: new Vector3(2, 3, -5), url: 'https://www.google.com/', physicsEnabled: false, texture: 'assets/TestCactus3.png' }
    ]

    menuBoxes.forEach(box => {
      const mesh = MeshBuilder.CreateBox(box.name, { size: 1 }, this.scene)
      mesh.checkCollisions = true
      mesh.position = box.position
      mesh.actionManager = new ActionManager(this.scene)

      mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, (event) => {
          this.onMenuBoxClick(mesh, event, box.url)
        })
      )

      if (box.physicsEnabled) {
        mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 3 }, this.scene)
      }

      const meshMaterial = new StandardMaterial(box.name + '_material', this.scene)
      meshMaterial.diffuseTexture = new Texture(box.texture, this.scene)
      mesh.material = meshMaterial

      mesh.updateFacetData()
    })

    const target = new Vector3(0, 2, -5)
    this.camera.setTarget(target)

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  private loadAsset (taskName: string, url: string) {
    return new Promise<MeshAssetTask>((resolve, reject) => {
      const task = this.assetsManager.addMeshTask(taskName, '', '/assets/', url)
      task.onSuccess = (task) => {
        resolve(task)
      }
      task.onError = (task) => {
        reject(task)
      }
    })
  }

  private onMenuBoxClick (mesh: Mesh, event: ActionEvent, url: string) {
    console.log('onMenuBoxClick', event)

    if (!mesh.physicsImpostor) {
      mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 3 }, this.scene)
    } else {
      // Select the mesh again using a scene pick because apparently I can't get this info via the event...
      const pick = this.scene.pick(event.pointerX, event.pointerY)
      if (pick && pick.getNormal()) {
        console.log(pick.getNormal())

        const impulseDirection = pick.getNormal()
        const impulseMagnitude = 5
        const contactLocalRefPoint = Vector3.Zero()

        mesh.physicsImpostor.applyImpulse(
          impulseDirection.scale(impulseMagnitude),
          mesh.getAbsolutePosition().add(contactLocalRefPoint)
        )
      }
    }

    // window.open(url)
  }
}
</script>

<style scoped lang="scss">
.viewer {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
  outline: none;
  display: block;
}
</style>
