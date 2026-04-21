import { Notification } from "@/utils/types";
import { View, Text } from "react-native"

const alertColors = {
  Excellent: { bg: "#EAF3DE", text: "#3B6D11", dot: "#639922" },
  Good:      { bg: "#E6F1FB", text: "#185FA5", dot: "#378ADD" },
  Caution:   { bg: "#FAEEDA", text: "#854F0B", dot: "#EF9F27" },
  Warning:   { bg: "#FAEEDA", text: "#633806", dot: "#BA7517" },
  Danger:    { bg: "#FCEBEB", text: "#A32D2D", dot: "#E24B4A" },
};

function parseDays(body: string) {
  // Split on blank lines between day blocks
  const dayBlocks = body.trim().split(/\n\n+/);

  return dayBlocks.filter(Boolean).map((block) => {
    const lines = block.trim().split("\n").map(s => s.trim()).filter(Boolean);
    // line 0: "April 23, 2026"
    // line 1: "Clear Sky. High 32.8°C / Low 25.2°C"
    // line 2: "Chance of rain up to 0%"
    // line 3: "Fish Drying Alert: Excellent"
    // line 4: "Ideal conditions for drying fish: ..."

    const date      = lines[0] ?? "";
    const tempLine  = lines[1] ?? "";
    const rainLine  = lines[2] ?? "";
    const alertLine = lines[3] ?? "";
    const desc      = lines[4] ?? "";

    // "Clear Sky. High 32.8°C / Low 25.2°C"
    const condition = tempLine.split(".")[0]?.trim() ?? "—";
    const high      = tempLine.match(/High\s+([\d.]+°C)/i)?.[1] ?? "—";
    const low       = tempLine.match(/Low\s+([\d.]+°C)/i)?.[1]  ?? "—";

    // "Chance of rain up to 0%"
    const rain = (rainLine.match(/(\d+)%/)?.[1] ?? "0") + "%";

    // "Fish Drying Alert: Excellent"
    const alert     = alertLine.replace("Fish Drying Alert:", "").trim();

    return { date, condition, high, low, rain, alert, desc };
  });
}

export function WeatherNotificationBody({ notification }: { notification: Notification }) {
  const days = parseDays(notification.body);
  const overallAlert = notification.data?.alert ?? "Excellent";
  const colors = alertColors[overallAlert as keyof typeof alertColors] ?? alertColors.Excellent;

  return (
    <View style={{ gap: 12 }}>

      {/* Overall alert pill */}
      <View style={{
        flexDirection: "row", alignItems: "center", gap: 8,
        backgroundColor: colors.bg,
        borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
        alignSelf: "flex-start",
      }}>
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.dot }} />
        <Text style={{ fontFamily: "PoppinsMedium", fontSize: 12, color: colors.text }}>
          Fish Drying: {overallAlert}
        </Text>
      </View>

      {/* Day cards */}
      {days.map((day, i) => (
        <View key={i} style={{
          borderWidth: 0.5, borderColor: "#e4e4e7",
          borderRadius: 14, padding: 16, gap: 12,
          backgroundColor: "#ffffff",
        }}>
          {/* Date + condition */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 13, color: "#18181b" }}>
              {day.date}
            </Text>
            <Text style={{ fontFamily: "PoppinsRegular", fontSize: 12, color: "#71717a" }}>
              {day.condition}
            </Text>
          </View>

          {/* Stats row */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { label: "High", value: day.high, color: "#BA7517" },
              { label: "Low",  value: day.low,  color: "#185FA5" },
              { label: "Rain", value: day.rain, color: "#185FA5" },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1, backgroundColor: "#f4f4f5",
                borderRadius: 8, padding: 10,
              }}>
                <Text style={{ fontFamily: "PoppinsRegular", fontSize: 11, color: "#71717a", marginBottom: 2 }}>
                  {stat.label}
                </Text>
                <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 13, color: stat.color }}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Alert row */}
          {day.alert ? (
            <View style={{
              flexDirection: "row", alignItems: "flex-start", gap: 8,
              backgroundColor: colors.bg, borderRadius: 8, padding: 10,
            }}>
              {/* checkmark circle */}
              <View style={{
                width: 16, height: 16, borderRadius: 8,
                borderWidth: 1.2, borderColor: colors.dot,
                alignItems: "center", justifyContent: "center", marginTop: 1,
              }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.dot }} />
              </View>
              <Text style={{ fontFamily: "PoppinsRegular", fontSize: 12, color: colors.text, flex: 1, lineHeight: 18 }}>
                <Text style={{ fontFamily: "PoppinsMedium" }}>Alert: {day.alert}</Text>
                {day.desc ? ` — ${day.desc}` : ""}
              </Text>
            </View>
          ) : null}
        </View>
      ))}
      <View className="mt-10"/>
    </View>
  );
}