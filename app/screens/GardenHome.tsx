// import React, { useRef } from "react";
// import { StyleSheet, View } from "react-native";
// import { Canvas, useFrame } from "@react-three/fiber/native";
// import type { Mesh } from "three";





// function RotatingKnot() {
//   const ref = useRef<Mesh>(null);

//   useFrame((_, delta) => {
//     if (!ref.current) return;
//     ref.current.rotation.x += delta * 0.4;
//     ref.current.rotation.y += delta * 0.6;
//     ref.current.rotation.z += delta * 0.2;
//   });

//   return (
//     <mesh ref={ref} scale={0.12}>
//       <torusKnotGeometry args={[10, 3, 256, 32]} />
//       <meshStandardMaterial
//         color="#f2d479"
//         roughness={0.4}
//         metalness={0.15}
//       />
//     </mesh>
//   );
// }

// function ContinuousInvalidate() {
//   useFrame((state) => {
//     state.invalidate();
//   });
//   return null;
// }



// // function PinkCube() {
// //   const meshRef = React.useRef<THREE.Mesh>(null);

// //   useFrame((state, delta) => {
// //     const mesh = meshRef.current;
// //     if (!mesh) return;

// //     mesh.rotation.y += delta * 1.5;
// //     mesh.rotation.x += delta * 0.7;

// //     // gentle bobbing so you can see time progression even if rotation is subtle
// //     mesh.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;

// //     mesh.updateMatrixWorld();
// //   });

// //   return (
// //     <mesh ref={meshRef} castShadow receiveShadow>
// //       <boxGeometry args={[1, 1, 1]} />
// //       <meshStandardMaterial
// //         color="#ff4fd8"
// //         roughness={0.35}
// //         metalness={0.05}
// //         emissive="#2a001f"
// //         emissiveIntensity={0.25}
// //       />
// //     </mesh>
// //   );
// // }

// function GardenLights() {
//   return (
//     <>
//       <ambientLight intensity={0.35} />
//       <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
//       <pointLight position={[-4, 2, -2]} intensity={0.8} />
//     </>
//   );
// }

// function Ground() {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
//       <planeGeometry args={[40, 40]} />
//       <meshStandardMaterial color="#2b1248" roughness={1} metalness={0} />
//     </mesh>
//   );
// }

// // function GardenScene() {
// //   return (
// //     <>
// //       {/* Lighting */}
// //       <GardenLights />

// //       {/* Keep these for now while you're building */}
// //       <axesHelper args={[3]} />
// //       <gridHelper args={[20, 20]} />

// //       {/* Ground to catch shadows and give scale */}
// //       <Ground />

// //       {/* Your animated object */}
// //       <PinkCube />
// //     </>
// //   );
// // }


// function CameraRig() {
//   useFrame((state) => {
//     const t = state.clock.elapsedTime;

//     // slow orbit-ish drift around origin
//     const radius = 6;
//     state.camera.position.x = Math.sin(t * 0.2) * radius;
//     state.camera.position.z = Math.cos(t * 0.2) * radius;
//     state.camera.position.y = 2 + Math.sin(t * 0.3) * 0.3;

//     state.camera.lookAt(0, 0, 0);
//   });

//   return null;
// }


// function SpinProbe() {
//   const ref = React.useRef<Mesh>(null);
//   const acc = React.useRef(0);

//   useFrame((state, delta) => {
//     if (ref.current) ref.current.rotation.y += delta * 3.0;
//     acc.current += delta;
//     if (acc.current > 1) {
//       acc.current = 0;
//       console.log("useFrame alive", state.clock.elapsedTime.toFixed(2));
//     }
//   });

//   return (
//     <mesh ref={ref} position={[0, 0, 0]}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshBasicMaterial color="hotpink" />
//     </mesh>
//   );
// }
// function RotatingBox() {
//   const ref = useRef<Mesh>(null);

//   useFrame((_, delta) => {
//     if (!ref.current) return;
//     ref.current.rotation.x += delta * 2.5;
//     ref.current.rotation.y += delta * 1.8;
//   });

//   return (
//     <mesh ref={ref} scale={1.8}>
//       <boxGeometry />
//       <meshStandardMaterial
//         color="#ff4fd8"
//         roughness={0.35}
//         metalness={0.1}
//       />
//     </mesh>
//   );
// }



// export function GardenHome() {
//   return (
//     <View style={styles.container}>
//       <View pointerEvents="none" style={styles.debugFrame} />
//       <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
//         <color attach="background" args={["#3a0d7a"]} />
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[4, 6, 4]} intensity={1.2} />
//         <RotatingBox />
//         <ContinuousInvalidate />
//       </Canvas>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   canvas: { flex: 1, backgroundColor: "transparent" },
//   debugFrame: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderWidth: 4,
//     borderColor: "red",
//     zIndex: 9999,
//   }
// });
