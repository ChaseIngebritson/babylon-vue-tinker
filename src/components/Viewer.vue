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
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import '@babylonjs/core/Loading/loadingScreen'
import { AssetsManager, MeshAssetTask } from '@babylonjs/core/Misc/assetsManager'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import '@babylonjs/core/Collisions/collisionCoordinator'

import { NormalMaterial } from '@babylonjs/materials/normal'

import '@babylonjs/loaders'

@Component
export default class Viewer extends Vue {
  private canvas!: HTMLCanvasElement
  private engine!: Engine
  private scene!: Scene
  private camera!: UniversalCamera
  private assetsManager!: AssetsManager

  private async mounted () {
    this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

    this.engine = new Engine(this.canvas)

    this.scene = new Scene(this.engine)
    this.scene.gravity = new Vector3(0, -9.81, 0)
    this.scene.collisionsEnabled = true

    this.camera = new UniversalCamera('camera1', new Vector3(0, 10, 0), this.scene)
    this.camera.setTarget(Vector3.Zero())
    this.camera.attachControl(this.canvas, true)
    this.camera.ellipsoid = new Vector3(1, 1, 1)
    this.camera.checkCollisions = true
    this.camera.applyGravity = true

    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene)
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

    const ground = MeshBuilder.CreateGround('ground', { width: 50, height: 50, subdivisions: 10 }, this.scene)
    ground.material = new NormalMaterial('groundMat', this.scene)
    ground.material.backFaceCulling = false
    ground.checkCollisions = true

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
}
</script>

<style scoped lang="scss">
canvas {
  width: 100%;
  height: 100%;
}
</style>
