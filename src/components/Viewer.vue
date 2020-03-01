<template>
  <div class="viewer">
    <canvas id="renderCanvas" touch-action="none" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import '@babylonjs/core/Loading/loadingScreen'
import { AssetsManager, MeshAssetTask } from '@babylonjs/core/Misc/assetsManager'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import '@babylonjs/core/Collisions/collisionCoordinator'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { ActionManager, ExecuteCodeAction, ActionEvent } from '@babylonjs/core/Actions'

// import '@babylonjs/loaders'
import { SkyMaterial } from '@babylonjs/materials/sky/skyMaterial'

@Component
export default class Viewer extends Vue {
  private canvas!: HTMLCanvasElement
  private engine!: Engine
  private scene!: Scene
  private camera!: FreeCamera
  private assetsManager!: AssetsManager

  private async mounted () {
    this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

    this.engine = new Engine(this.canvas)

    this.scene = new Scene(this.engine)
    this.scene.gravity = new Vector3(0, -1, 0)
    this.scene.collisionsEnabled = true

    this.camera = new FreeCamera('camera', new Vector3(0, 2, 0), this.scene)
    this.camera.attachControl(this.canvas, true)
    this.camera.ellipsoid = new Vector3(1, 1, 1)
    this.camera.checkCollisions = true
    this.camera.applyGravity = true

    const light = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7

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

    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100, subdivisions: 10 }, this.scene)
    ground.material = new StandardMaterial('groundMat', this.scene)
    ground.material.backFaceCulling = false
    ground.checkCollisions = true

    const menuBoxes = [
      { name: 'box1', position: new Vector3(-2, 1, -5), url: 'https://www.google.com/' },
      { name: 'box2', position: new Vector3(0, 1, -5), url: 'https://www.google.com/' },
      { name: 'box3', position: new Vector3(2, 1, -5), url: 'https://www.google.com/' },
      { name: 'box4', position: new Vector3(-2, 3, -5), url: 'https://www.google.com/' },
      { name: 'box5', position: new Vector3(0, 3, -5), url: 'https://www.google.com/' },
      { name: 'box6', position: new Vector3(2, 3, -5), url: 'https://www.google.com/' }
    ]

    menuBoxes.forEach(box => {
      const mesh = MeshBuilder.CreateBox(box.name, { size: 1 }, this.scene)
      mesh.checkCollisions = true
      mesh.position = box.position
      mesh.actionManager = new ActionManager(this.scene)

      mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, (event) => {
          this.onMenuBoxClick(event, box.url)
        })
      )
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

  private onMenuBoxClick (event: ActionEvent, url: string) {
    console.log('onclick')
    window.open(url)
  }
}
</script>

<style scoped lang="scss">
canvas {
  width: 100%;
  height: 100%;
}
</style>
