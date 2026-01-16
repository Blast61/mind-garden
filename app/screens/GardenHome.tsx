import React, { useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import type * as THREE from "three";
import { ScatterGarden } from "./ScatterGarden";

function PinkCube() {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.y += delta * 1.5;
    mesh.rotation.x += delta * 0.7;

    // gentle bobbing so you can see time progression even if rotation is subtle
    mesh.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;

    mesh.updateMatrixWorld();
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ff4fd8"
        roughness={0.35}
        metalness={0.05}
        emissive="#2a001f"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

function GardenLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-4, 2, -2]} intensity={0.8} />
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#2b1248" roughness={1} metalness={0} />
    </mesh>
  );
}

function GardenScene() {
  return (
    <>
      {/* Lighting */}
      <GardenLights />

      {/* Keep these for now while you're building */}
      <axesHelper args={[3]} />
      <gridHelper args={[20, 20]} />

      {/* Ground to catch shadows and give scale */}
      <Ground />

      {/* Your animated object */}
      <PinkCube />
    </>
  );
}

function DemandDriver() {
  useFrame((state) => {
    state.invalidate();
  });
  return null;
}


function BasicBox() {
  const ref = React.useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 2.0;
    ref.current.rotation.x += delta * 1.2;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="hotpink" />
    </mesh>
  );
}


function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // slow orbit-ish drift around origin
    const radius = 6;
    state.camera.position.x = Math.sin(t * 0.2) * radius;
    state.camera.position.z = Math.cos(t * 0.2) * radius;
    state.camera.position.y = 2 + Math.sin(t * 0.3) * 0.3;

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function OriginDot() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color="white" />
    </mesh>
  );
}


function FullscreenTest() {
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial color="lime" side={2} />
    </mesh>
  );
}

function CenterCompensator() {
  useFrame((state) => {
    // tweak these numbers until centered
    state.camera.lookAt(-0.8, -0.8, 0);
  });
  return null;
}

function SpinProbe() {
  const ref = React.useRef<THREE.Mesh>(null);
  const acc = React.useRef(0);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 3.0;
    acc.current += delta;
    if (acc.current > 1) {
      acc.current = 0;
      console.log("useFrame alive", state.clock.elapsedTime.toFixed(2));
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="hotpink" />
    </mesh>
  );
}



export function GardenHome() {
  return (
    <View style={styles.container}>
        <View pointerEvents="none" style={styles.debugFrame} />
     <Canvas
      frameloop="always"
      {...({ dpr: 1 } as any)}
      style={styles.canvas}
      gl={{ antialias: false, alpha: false, depth: true, stencil: false }}
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 200 }}
      onCreated={({ gl, size, camera }) => {
          // const dpr = 1; // keep 1 for simulator
          // gl.setPixelRatio(dpr);

          // // IMPORTANT: setSize expects *pixels* when pixelRatio is set
          // gl.setSize(size.width, size.height, false);

          // // Some native surfaces need explicit viewport after setSize
          // gl.setViewport(0, 0, size.width, size.height);

          // gl.setClearColor("#3a0d7a", 1);

          // const cam = camera as THREE.PerspectiveCamera;
          // cam.aspect = size.width / size.height;
          // cam.updateProjectionMatrix();

          // console.log("Canvas size:", size.width, size.height, "dpr:", dpr);
          gl.setPixelRatio(1);
          gl.setClearColor("#3a0d7a", 1);
        }}
        >
      <color attach="background" args={["#3a0d7a"]} />
      {/* <FullscreenTest />
      <OriginDot />
      <CenterCompensator /> */}
      <SpinProbe />
    </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  canvas: { flex: 1, backgroundColor: "transparent" },
  debugFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 4,
    borderColor: "red",
    zIndex: 9999,
  }
});
