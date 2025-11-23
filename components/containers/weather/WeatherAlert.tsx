import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { X } from 'lucide-react-native'; // for close icon

type WeatherData = {
  rain?: number;
  wind?: number;
  cloud?: number;
};

const WeatherAlert = ({ rain = 0, wind = 0, cloud = 0 }: WeatherData) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

let message = "";
let alertLabel = "";
let alertColor = "";

// Descriptions
const getRainDescription = (rain: number) => {
  if (rain === 0) return "no expected rain";
  if (rain < 50) return `a moderate ${rain}% chance of rain`;
  if (rain < 90) return `a high ${rain}% chance of rain`;
  return `a very high ${rain}% chance of rain`;
};

const getWindDescription = (wind: number) => {
  if (wind < 10) return "calm winds";
  if (wind < 15) return "a light breeze";
  if (wind < 20) return "moderate wind";
  return "strong gusty winds";
};

const getCloudDescription = (cloud: number) => {
  if (cloud < 30) return "mostly clear skies";
  if (cloud < 50) return "partly cloudy skies";
  if (cloud < 100) return "noticeable cloud cover";
  return "overcast skies";
};

const rainDesc = getRainDescription(rain);
const windDesc = getWindDescription(wind);
const cloudDesc = getCloudDescription(cloud);

// ----------------------------
// APPLY NEW RULES
// ----------------------------

// 🌟 EXCELLENT — rain 0%, clouds < 50, wind < 10
if (rain === 0 && cloud < 50 && wind < 10) {
  alertLabel = "Excellent";
  alertColor = "#22c55e";
  message = `Ideal conditions for drying fish: ${cloudDesc}, ${windDesc}, and ${rainDesc}.`;
}

// 👍 GOOD — rain 0%, clouds 50–100%, wind < 15
else if (rain === 0 && cloud <= 100 && wind < 15) {
  alertLabel = "Good";
  alertColor = "#3b82f6";
  message = `Good weather for drying fish with ${cloudDesc}, ${windDesc}, and ${rainDesc}.`;
}

// ⚠️ CAUTION — rain ≥ 50%
else if (rain >= 50 && rain < 90) {
  alertLabel = "Caution";
  alertColor = "#eab308";
  message = `Be cautious: ${cloudDesc}, ${windDesc}, and ${rainDesc}. Drying may be slow or risky.`;
}

// 🟧 WARNING — rain ≥ 90%
else if (rain >= 90 && rain < 100) {
  alertLabel = "Warning";
  alertColor = "#f97316";
  message = `Drying fish is not recommended due to ${cloudDesc}, ${windDesc}, and ${rainDesc}.`;
}

// 🔴 DANGER — max rain OR max cloud OR strong wind
else {
  alertLabel = "Danger";
  alertColor = "#ef4444";
  message = `Avoid drying fish. Extreme conditions: ${cloudDesc}, ${windDesc}, and ${rainDesc}.`;
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
