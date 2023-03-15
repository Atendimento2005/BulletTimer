import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState, useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Text, View, Pressable} from "react-native";
import * as Font from "expo-font";

const green = '#7abd7e';
const yellow = '#f8d66d';
const orange = '#ff964f';
const red = '#f1433f';
const grey = '#FAFAFA';

SplashScreen.preventAutoHideAsync();

export default function App() {
	const [curMS, setCurMS] = useState(0);
  const [startTime, setStartTime] = useState(Date.now())
  const [totalTime, setTotalTime] = useState(0);
	const [curState, setCurState] = useState(0);
  const [bgColor, setBgColor] = useState(grey)
  const [solved, setSolved] = useState(0)
  const [appIsReady, setAppIsReady] = useState(false);
  
  let containerStyle = {
		flex: 1,
		backgroundColor: bgColor,
		alignItems: "center",
		justifyContent: "space-between",
	}

	useEffect(() => {
		let interval = null;
    let curTime = null;
		if (curState == 1) {
      interval = setInterval(() => {
        curTime = Date.now();
        setCurMS(curMS => curTime-startTime);
        if(curMS >= 180000){
          setBgColor(red)
        }else if(curMS >= 120000){
          setBgColor(orange)
        }else if(curMS >= 60000){
          setBgColor(yellow)
        }
			}, 10);
		} else if (curState != 1) {
      clearInterval(interval);
		}
    
		return () => clearInterval(interval);
	}, [curState, curMS]);


  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          poppinsBold: require("./assets/fonts/Poppins_500Medium.ttf"),
          notosansBold: require("./assets/fonts/NotoSansMono_Condensed-Regular.ttf")
        });
        
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    
    prepare();
  }, []);
  
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {

      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);
  
  
	if (!appIsReady) {
    return null;
	}
  
	const toggle = () => {
    if (curState == 1) {
      setCurState(2)
      setSolved(solved => solved + 1);
      setTotalTime(totalTime => totalTime += curMS)
		} else if (curState == 2) {
      setCurMS(0);
			setCurState(0);
      setBgColor(grey);
		}else {
      setBgColor(green);
      setStartTime(startTime => Date.now());
      setCurState(1);
    }
	};

  const reset = () => {
    setCurState(0);
    setSolved(0);
    setTotalTime(0);
    setCurMS(0);
    setBgColor(grey);
  };
  
	// < 1 min green
	// 1 min yellow

	return (
    <Pressable style={containerStyle} onPress={toggle} onLongPress={reset} onLayout={onLayoutRootView}>
      <StatusBar style={{backgroundColor: bgColor}}></StatusBar>
      <View style={{height: 100}}></View>
      <View style={styles.timerWrapper}>
        <Text style={styles.timerText}>{`${String(Math.floor(curMS / 60000)).padStart(2, '0')}:${String(Math.floor(curMS / 1000)%60).padStart(2, '0')}:${String(Math.floor(curMS % 100)).padStart(2, '0')}`}</Text>
      </View>
			<View style={styles.questionsWrapper}>
				<Text style={styles.questionsText}>{`Questions Solved: ${solved}`}</Text>
				<Text style={styles.questionsText}>{solved == 0 ? `Total Time: -` : `Total Time: ${String(Math.floor((totalTime)/60000)%60).padStart(2, '0')}:${String(Math.floor((totalTime/1000)%60)).padStart(2, '0')}`}</Text>
				<Text style={styles.questionsText}>{solved == 0 ? `Avg Time: -` : `Avg Time: ${String(Math.floor((totalTime/solved)/60000)%60).padStart(2, '0')}:${String(Math.floor(((totalTime/solved)/1000)%60)).padStart(2, '0')}`}</Text>
			</View>
		</Pressable>
	);
}
const styles = StyleSheet.create({
	questionsText: {
		fontSize: 26,
		fontFamily: "poppinsBold",
		textAlign: "center",
	},
  timerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '90%',
  },
  timerText: {
    fontSize: 80,
		fontFamily: "notosansBold",
    textAlign: "left",
  },
  questionsWrapper:{
    marginBottom: 50,
  }
});

