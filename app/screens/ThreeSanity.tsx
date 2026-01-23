import React, { useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { GLView } from "expo-gl";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import type { Mesh } from "three";

const SHOW_GL_PROBE = false;

function Box() {
  const ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;

    mesh.rotation.y += delta * 4.0;
    mesh.rotation.x += delta * 2.0;

    // safe + obvious motion
    const t = state.clock.getElapsedTime();
    mesh.position.y = Math.sin(t * 2.0) * 0.25;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

/**
 * If your native GL surface ever "idles", this nudges it.
 * IMPORTANT: we grab invalidate from the store (useThree),
 * not from the frame-state object (which can be flaky on some setups).
 */
function ForceRender() {
  const invalidate = useThree((s) => s.invalidate);

  useFrame(() => {
    // guard: never crash if invalidate is missing for some reason
    if (typeof invalidate === "function") invalidate();
  });

  return null;
}

function GLProbe() {
  return (
    <GLView
      style={styles.canvas}
      onContextCreate={(gl) => {
        console.log("🧪 GLView context created");
        let t = 0;
        const loop = () => {
          t += 0.03;
          const c = Math.sin(t) * 0.5 + 0.5;
          gl.clearColor(c, 0.0, 1.0 - c, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.endFrameEXP();
          requestAnimationFrame(loop);
        };
        loop();
      }}
    />
  );
}

export default function ThreeSanity() {
  return (
    <View style={styles.container}>
      {SHOW_GL_PROBE ? (
        <GLProbe />
      ) : (
        <Canvas
          style={styles.canvas}
          frameloop="always"
          camera={{ position: [0, 0, 5], fov: 60 }}
          onCreated={({ gl }) => {
            console.log("✅ Canvas created");
            gl.setClearColor(0x000000, 1);
          }}
        >
          <color attach="background" args={["#000000"]} />
          <axesHelper args={[2]} />
          <Box />
        </Canvas>
      )}

      {/* Simple overlay to prove the RN view tree is alive even if GL dies */}
      <View pointerEvents="none" style={styles.overlay}>
        <Text style={styles.overlayText}>ThreeSanity running</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  canvas: { flex: 1 },
  overlay: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
  },
  overlayText: { color: "white" },
});
