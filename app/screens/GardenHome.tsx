import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import * as THREE from "three";

function SpinningBox() {
  const mesh = React.useRef<THREE.Mesh>(null);
  const acc = React.useRef(0);

  useFrame((state, delta) => {
    // Log every ~0.5s (reliably)
    acc.current += delta;
    if (acc.current > 0.5) {
      acc.current = 0;
      console.log("🟩 frame tick", state.clock.elapsedTime.toFixed(2));
    }

    if (!mesh.current) return;

    // BIG obvious motion
    mesh.current.rotation.y += 2.0 * delta;
    mesh.current.rotation.x += 1.2 * delta;

    // In case frameloop is effectively "demand" somewhere, force invalidation
    // (harmless if already always)
    // @ts-ignore
    state.invalidate?.();
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1.5, 0.8, 0.6]} />
      <meshBasicMaterial color="#ff2d95" />
    </mesh>
  );
}


export function GardenHome() {
  return (
    <View style={styles.container}>
      <Canvas
        style={styles.canvas}
        // Keep this minimal—preserveDrawingBuffer can cause weirdness on sim.
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0, 7], fov: 60, near: 0.1, far: 200 }}
        onCreated={({ gl, camera }) => {
          console.log("✅ onCreated fired");
          console.log("✅ webgl2:", (gl as any).capabilities?.isWebGL2);

          // Force non-black clear to prove the buffer is presenting
          gl.setClearColor("#1b0033", 1);

          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
        }}
      >
        {/* Background MUST be here */}
        <color attach="background" args={["#1b0033"]} />

        {/* These helpers should ALWAYS show if the scene is presenting */}
        <axesHelper args={[3]} />
        <gridHelper args={[10, 10]} />

        <SpinningBox />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  canvas: { flex: 1 },
});
