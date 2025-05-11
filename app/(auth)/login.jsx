// import React, { useState } from "react";
// import {
//   Image,
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   ActivityIndicator,
//   StatusBar,
//   KeyboardAvoidingView,
//   ScrollView,
//   Platform,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../../store/authSlice";
// import { Ionicons } from "@expo/vector-icons";
// import * as Localization from "expo-localization";

// export default function LoginScreen() {
//   const [userName, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [inputError, setInputError] = useState(null);

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.auth);


//   const locales = Localization.getLocales();
//   const isRTL = true;
//   const writingDirection = "rtl";
//   const textAlign = "right";
//   const iconSide = { left: 15 };

//   const handleLogin = () => {
//     if (!userName || !password) {
//       setInputError("يرجى إدخال  اسم المستخدم  وكلمة المرور");
//       return;
//     }
//     setInputError(null);

//     dispatch(login({ userName, password }))
//       .unwrap()
//       .then(() => {
//         router.replace("/home");
//       })
//       .catch((err) => {
//         console.error("Login failed:", err);
//       });
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1 }}
//           keyboardShouldPersistTaps="handled"
//         >
//           <SafeAreaView style={[styles.container, { writingDirection }]}>
//             <StatusBar backgroundColor="#1769aa" barStyle="light-content" />

//             <View style={styles.header}>
//               <Image
//                 style={styles.logo}
//                 source={require("../../assets/images/splash.png")}
//               />
//               <Text style={styles.title}>تسجيل الدخول</Text>
//               <Text style={styles.subtitle}>أدخل اسم المستخدم وكلمة المرور</Text>
//             </View>

//             <View style={styles.formContainer}>
//               <View style={styles.inputGroup}>
//                 <Text style={[styles.label, { textAlign }]}> اسم المستخدم</Text>
//                 <TextInput
//                   placeholder="test@10"
//                   value={userName}
//                   onChangeText={setUserName}
//                   style={[styles.input, { textAlign }]}
//                   autoCapitalize="none"
//                 />
//               </View>

//               {/* Password Input */}
//               <View style={styles.inputGroup}>
//                 <Text style={[styles.label, { textAlign }]}>كلمة المرور</Text>
//                 <View style={styles.passwordContainer}>
//                   <TextInput
//                     placeholder="......."
//                     value={password}
//                     onChangeText={setPassword}
//                     secureTextEntry={!showPassword}
//                     style={[styles.input, { textAlign }]}
//                   />
//                   <TouchableOpacity
//                     onPress={() => setShowPassword(!showPassword)}
//                     style={[styles.passwordIcon, iconSide]}
//                   >
//                     <Ionicons
//                       name={showPassword ? "eye-off" : "eye"}
//                       size={24}
//                       color="#1769aa"
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {inputError && <Text style={styles.errorText}>{inputError}</Text>}
//               {error && <Text style={styles.errorText}>{error}</Text>}

//               {loading ? (
//                 <ActivityIndicator size="large" color="#1769aa" />
//               ) : (
//                 <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//                   <Text style={styles.loginButtonText}>دخول</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </SafeAreaView>
//         </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#024a70",
//   },
//   header: {
//     alignItems: "center",
//     paddingTop: 50,
//     paddingBottom: 30,
//     backgroundColor: "#024a70",
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginBottom: 15,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#e0e0e0",
//   },
//   formContainer: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 25,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     fontSize: 16,
//     backgroundColor: "#f9f9f9",
//     color: "#333",
//   },
//   passwordContainer: {
//     flexDirection: "row-reverse",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 25,
//     backgroundColor: "#f9f9f9",
//     paddingHorizontal: 10,
//   },
//   passwordIcon: {
//     paddingHorizontal: 10,

//   },
//   loginButton: {
//     backgroundColor: "#f1c40f",
//     paddingVertical: 15,
//     borderRadius: 25,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   loginButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   errorText: {
//     color: "red",
//     textAlign: "center",
//     marginTop: 10,
//   },
// });

import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    if (!userName || !password) {
      setInputError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    setInputError(null);

    dispatch(login({ userName, password }))
      .unwrap()
      .then(() => {
        router.replace("/home");
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={[styles.container, { writingDirection: "rtl" }]}>
          <StatusBar backgroundColor="#1769aa" barStyle="light-content" />

          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require("../../assets/images/splash.png")}
            />
            <Text style={styles.title}>تسجيل الدخول</Text>
            <Text style={styles.subtitle}>أدخل اسم المستخدم وكلمة المرور</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { textAlign: "right" }]}>اسم المستخدم</Text>
              <TextInput
                placeholder="test@10"
                value={userName}
                onChangeText={setUserName}
                style={[styles.input, { textAlign: "right" }]}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { textAlign: "right" }]}>كلمة المرور</Text>
              <View style={styles.passwordContainer}>
  <TextInput
    placeholder="......."
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    style={[styles.input, { textAlign: "right" }]} // <-- paddingRight لتفادي تغطية النص بالأيقونة
  />
  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
    style={styles.passwordIcon}
  >
    <Ionicons
      name={showPassword ? "eye-off" : "eye"}
      size={24}
      color="#1769aa"
    />
  </TouchableOpacity>
</View>

            </View>

            {inputError && <Text style={styles.errorText}>{inputError}</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {loading ? (
              <ActivityIndicator size="large" color="#1769aa" />
            ) : (
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>دخول</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#024a70",
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: "#024a70",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e0e0",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  passwordIcon: {
    position: "absolute",
    left: 15, 
    top: "50%",
    transform: [{ translateY: -12 }],  },
  loginButton: {
    backgroundColor: "#024a70",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#f5f5f5",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
