import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [username, setUsername] = useState("");

  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Flames
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [flameResult, setFlameResult] = useState("");

  // Guess
  const [guess, setGuess] = useState("");
  const [guessResult, setGuessResult] = useState("");
  const [target] = useState(Math.floor(Math.random() * 10) + 1);

  // RPS
  const [rpsResult, setRpsResult] = useState("");

  // Tap Game
  const [tapCount, setTapCount] = useState(0);

  // Puzzle
  const [puzzle, setPuzzle] = useState([1, 2, 3, 4, 5, 6, 7, 8, ""]);

  // Save History
  useEffect(() => {
    AsyncStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  /* ---------------- GAMES LOGIC ---------------- */

  const playFlames = () => {
    let a = name1.toLowerCase().replace(/\s/g, "");
    let b = name2.toLowerCase().replace(/\s/g, "");
    for (let c of a) if (b.includes(c)) {
      a = a.replace(c, "");
      b = b.replace(c, "");
    }
    const res = ["Friends", "Love", "Affection", "Marriage", "Enemy", "Siblings"][(a.length + b.length) % 6];
    setFlameResult(res);
    setHistory(h => [...h, `FLAMES → ${res}`]);
  };

  const playGuess = () => {
    if (parseInt(guess) === target) {
      setGuessResult("🎉 Correct!");
      setHistory(h => [...h, "Guess Game: Win"]);
    } else {
      setGuessResult("❌ Wrong!");
    }
  };

  const playRPS = (choice) => {
    const arr = ["Rock", "Paper", "Scissors"];
    const bot = arr[Math.floor(Math.random() * 3)];
    let result = "Draw";
    if (
      (choice === "Rock" && bot === "Scissors") ||
      (choice === "Paper" && bot === "Rock") ||
      (choice === "Scissors" && bot === "Paper")
    ) result = "You Win!";
    else if (choice !== bot) result = "You Lose!";
    setRpsResult(`You: ${choice} | Bot: ${bot} → ${result}`);
    setHistory(h => [...h, `RPS: ${result}`]);
  };

  const tapGame = () => {
    setTapCount(c => c + 1);
    if (tapCount + 1 === 20) {
      setHistory(h => [...h, "Tap Game: Completed"]);
    }
  };

  /* ---------------- UI ---------------- */

  if (screen === "login") {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <LinearGradient colors={["#141e30", "#243b55"]} style={styles.container}>
          <Text style={styles.title}>🎮 Mini Game Hub</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setScreen("home")}>
            <Text style={styles.btnText}>Enter</Text>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  if (screen === "home") {
    return (
      <LinearGradient colors={["#1e3c72", "#2a5298"]} style={styles.container}>
        <Text style={styles.title}>Welcome {username}</Text>

        {["Flames", "Guess", "RPS", "Tap", "Puzzle", "Leaderboard"].map(i => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => setScreen(i.toLowerCase())}>
            <Text style={styles.cardText}>{i}</Text>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    );
  }

  /* ============ GAMES ============ */

  if (screen === "flames") {
    return (
      <LinearGradient colors={["#c31432", "#240b36"]} style={styles.container}>
        <Text style={styles.title}>🔥 FLAMES</Text>
        <TextInput style={styles.input} placeholder="Your Name" value={name1} onChangeText={setName1} />
        <TextInput style={styles.input} placeholder="Partner Name" value={name2} onChangeText={setName2} />
        <TouchableOpacity style={styles.primaryBtn} onPress={playFlames}>
          <Text style={styles.btnText}>Check</Text>
        </TouchableOpacity>
        <Text style={styles.result}>{flameResult}</Text>
        <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>⬅ Back</Text></TouchableOpacity>
      </LinearGradient>
    );
  }

  if (screen === "guess") {
    return (
      <LinearGradient colors={["#2193b0", "#6dd5ed"]} style={styles.container}>
        <Text style={styles.title}>🎯 Guess the Number</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={guess} onChangeText={setGuess} />
        <TouchableOpacity style={styles.primaryBtn} onPress={playGuess}>
          <Text style={styles.btnText}>Check</Text>
        </TouchableOpacity>
        <Text style={styles.result}>{guessResult}</Text>
        <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>⬅ Back</Text></TouchableOpacity>
      </LinearGradient>
    );
  }

  if (screen === "rps") {
    return (
      <LinearGradient colors={["#232526", "#414345"]} style={styles.container}>
        <Text style={styles.title}>✊ Rock Paper Scissors</Text>
        {["Rock", "Paper", "Scissors"].map(c => (
          <TouchableOpacity key={c} style={styles.card} onPress={() => playRPS(c)}>
            <Text style={styles.cardText}>{c}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.result}>{rpsResult}</Text>
        <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>⬅ Back</Text></TouchableOpacity>
      </LinearGradient>
    );
  }

  if (screen === "tap") {
    return (
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.container}>
        <Text style={styles.title}>⚡ Tap Game</Text>
        <Text style={styles.result}>Taps: {tapCount}</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={tapGame}>
          <Text style={styles.btnText}>TAP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>⬅ Back</Text></TouchableOpacity>
      </LinearGradient>
    );
  }

  if (screen === "puzzle") {
    return (
      <LinearGradient colors={["#232526", "#414345"]} style={styles.container}>
        <Text style={styles.title}>🧩 Puzzle</Text>
        <Text style={styles.result}>Coming Soon 🚧</Text>
        <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>⬅ Back</Text></TouchableOpacity>
      </LinearGradient>
    );
  }

  if (screen === "leaderboard") {
    return (
      <LinearGradient colors={["#141e30", "#243b55"]} style={styles.container}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        {history.map((h, i) => (
          <Text key={i} style={styles.list}>{h}</Text>
        ))}
        <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.back}>⬅ Back</Text></TouchableOpacity>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 30, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  input: { backgroundColor: "rgba(255,255,255,0.15)", width: "85%", padding: 14, borderRadius: 25, color: "#fff", marginBottom: 10 },
  primaryBtn: { backgroundColor: "#f59e0b", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 25, marginVertical: 10 },
  btnText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "rgba(255,255,255,0.15)", width: "85%", padding: 18, borderRadius: 20, marginVertical: 8, alignItems: "center" },
  cardText: { color: "#fff", fontSize: 18 },
  back: { color: "#fff", marginTop: 20, fontSize: 16 },
  result: { color: "#fff", fontSize: 18, marginTop: 10 },
  list: { color: "#fff", fontSize: 16, marginVertical: 3 }
});
