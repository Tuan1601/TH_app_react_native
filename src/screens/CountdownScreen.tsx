import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from 'react-native';

export default function CountdownScreen() {
  const [inputSeconds, setInputSeconds] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (remainingTime === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remainingTime]);

  const handleTimeUp = () => {
    setIsRunning(false);
    if (Vibration && Vibration.vibrate) {
      Vibration.vibrate([0, 500, 200, 500]);
    }
    if (typeof window !== 'undefined' && window.alert) {
      window.alert("Hết giờ!\n\nTime's up!");
    }
  };

  const handleStart = () => {
    const seconds = parseInt(inputSeconds);
    if (isNaN(seconds) || seconds <= 0) {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Lỗi\n\nVui lòng nhập số giây hợp lệ (> 0)');
      }
      return;
    }
    setRemainingTime(seconds);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    if (remainingTime > 0) {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingTime(0);
    setInputSeconds('');
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đồng hồ đếm ngược</Text>
      
      {remainingTime === 0 && !isRunning ? (
        <View style={styles.inputSection}>
          <Text style={styles.label}>Nhập số giây:</Text>
          <TextInput
            style={styles.input}
            value={inputSeconds}
            onChangeText={setInputSeconds}
            keyboardType="numeric"
            placeholder="Ví dụ: 60"
          />
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.buttonText}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.timerSection}>
          <Text style={styles.timer}>{formatTime(remainingTime)}</Text>
          
          <View style={styles.controls}>
            {isRunning ? (
              <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
                <Text style={styles.buttonText}>Tạm dừng</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.resumeButton} onPress={handleResume}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.buttonText}>Đặt lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
    color: '#333',
  },
  inputSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  timerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 40,
  },
  controls: {
    flexDirection: 'row',
    gap: 15,
  },
  startButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  resumeButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});