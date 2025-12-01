import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { X } from 'lucide-react-native'; // for close icon

type WeatherData = {
  rain?: number;
  wind?: number;
  cloud?: number;
};

const WeatherAlert = ({ rain = 0, cloud = 0 }: WeatherData) => {
  const rainPercent = Math.round(rain * 100);
    
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

let message = "";
let alertLabel = "";
let alertColor = "";

// Descriptions
const getRainDescription = (rainPercent: number) => {
  if (rainPercent === 0) return "no expected rain";
  if (rainPercent < 50) return `a moderate ${rainPercent}% chance of rain`;
  if (rainPercent < 90) return `a high ${rainPercent}% chance of rain`;
  return `a very high ${rainPercent}% chance of rain`;
};

const getCloudDescription = (cloud: number) => {
  if (cloud < 30) return "mostly clear skies";
  if (cloud < 50) return "partly cloudy skies";
  if (cloud < 100) return "noticeable cloud cover";
  return "overcast skies";
};

const rainDesc = getRainDescription(rainPercent);
const cloudDesc = getCloudDescription(cloud);

// ----------------------------
// APPLY NEW RULES
// ----------------------------

if (rainPercent === 0 && cloud < 50) {
  alertLabel = "Excellent";
  alertColor = "#22c55e";
  message = `Ideal conditions for drying fish: ${cloudDesc}, and ${rainDesc}.`;
}

else if (rainPercent === 0 && cloud <= 100) {
  alertLabel = "Good";
  alertColor = "#3b82f6";
  message = `Good weather for drying fish with ${cloudDesc}, and ${rainDesc}.`;
}

else if (rainPercent <= 80 && rainPercent > 0 && cloud <= 100) {
  alertLabel = "Caution";
  alertColor = "#eab308";
  message = `Be cautious: ${cloudDesc}, and ${rainDesc}. Drying may be slow or risky.`;
}

else if (rainPercent > 80 && rainPercent < 99) {
  alertLabel = "Warning";
  alertColor = "#f97316";
  message = `Drying fish is not recommended due to ${cloudDesc}, and ${rainDesc}.`;
}

else {
  alertLabel = "Danger";
  alertColor = "#ef4444";
  message = `Avoid drying fish. Extreme conditions: ${cloudDesc}, and ${rainDesc}.`;
}


  return (
    <View className="px-5 mt-5" style={{ zIndex: 0}}>
      <View className="border border-zinc-300 rounded-xl p-3 relative">
        {/* Close Button */}
        <Pressable
          onPress={() => setVisible(false)}
          style={{ position: 'absolute', top: 5, right: 5 }}
        >
          <X size={18} color="#6b7280" />
        </Pressable>

        <View style={{ gap: 5 }} className="flex-row justify-center items-center">
          <Text
            style={{
              fontFamily: 'PoppinsSemiBold',
              color: alertColor,
              fontSize: 16,
            }}
          >
            {alertLabel}
          </Text>
        </View>

        <Text
          style={{ fontFamily: 'PoppinsRegular' }}
          className="text-zinc-500 mt-2 text-center text-sm"
        >
          {message}
        </Text>
      </View>
    </View>
  );
};

export default WeatherAlert;
