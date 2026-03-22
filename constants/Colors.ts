/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Factory, Gauge, PanelsLeftRightIcon, Settings, Users } from "lucide-react-native";

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const modules = [
  {
    title: 'Module 1: Processing & Pre-Drying Preparation',
    image: require('@/assets/images/module-wallpaper1.png'),
    link: '/lessons/lesson1'
  },
  {
    title: 'Module 2: Checking Drying Stage',
    image: require('@/assets/images/module-wallpaper2.png'),
    link: '/lessons/lesson2'
  },
  {
    title: 'Module 3: Post-Drying & Storage',
    image: require('@/assets/images/module-wallpaper3.png'),
    link: '/lessons/lesson3'
  },
]

export const remarkMessages = {
  undried: "Drying incomplete. Fish have not reached the required dryness.",
  dry: "Drying process complete. Ready for harvesting.",
  reject: "Quality issue identified. Remove rejected fish from the batch.",
  mostlyUndried: "Most fish are still undried. Continue the drying process until sufficient dryness is achieved.",
  mostlyDry: "Most fish are properly dried, but a few still need additional drying time.",
  noFish: "No fish detected in the image. Please try again.",
};


export const farmMenu = [
  {
    title: "Home",
    icon: Gauge
  },
  {
    title: "Trays",
    icon: PanelsLeftRightIcon
  },
  {
    title: "Production",
    icon: Factory,
    private: true
  },
  {
    title: "Members",
    icon: Users
  },
  {
    title: "Settings",
    icon: Settings
  },
]

// export const apiUrl = 'http://3.106.134.49:8000' // AWS
export const apiUrl = 'http://10.41.7.217:8000' // ITD WIFI
// export const apiUrl = 'https://thesis-backend-zprj.onrender.com' // MY WIFI

export const lesson1Content = [
  {
    title: "Sardinella Fimbriata(Sardinella spp)",
    text: "Sardinella fimbriata, locally known as 'lawlaw' or 'tamban,' is a small pelagic fish species commonly found in Philippine coastal waters. This sardine species is characterized by its silvery body, distinct dark spot behind the gill cover, and typically measures 10-15 cm in length. Rich in omega-3 fatty acids and protein, S. fimbriata is widely processed into dried fish products (tuyo) in coastal communities, particularly in regions like Sorsogon. The fish's firm texture and moderate oil content make it ideal for traditional sun-drying methods, where proper processing ensures extended shelf life while preserving nutritional value.",
    image: require("@/assets/images/modules/pre-drying/1.jpg")
  },
  {
    title: "Washing and Cleaning",
    text: "Upon procurement, the fish are transferred to a clean tray and rinsed thoroughly with fresh, clean water. This initial washing is performed twice to remove surface impurities, debris, and any residual slime. After rinsing, the fish are drained and transferred to a cooler or clean container to await the next stage, preventing premature spoilage.",
    image: require("@/assets/images/modules/pre-drying/Screenshot_2025-12-02-19-38-08-55_b783bf344239542886fee7b48fa4b892.jpg")
  },
  {
    title: "Salting",
    text: "ollowing the cleaning process, the fish are arranged in a single layer within a suitable cooling container, such as a chilled basin or cooler box. A measured amount of salt is then evenly sprinkled or layered over the fish. This initial salting begins the moisture extraction process and prepares the fish for the extended brining stage.",
    image: require("@/assets/images/modules/pre-drying/Messenger_creation_A5C66C14-70E1-4698-B59C-F6B5F9142D10.jpeg")
  },
  {
    title: "Brining",
    text: "The salted fish are then completely submerged in a concentrated brine solution or thoroughly covered with dry salt. They are left to soak for a period of approximately twelve hours. This extended brining is critical for preservation, as it deeply penetrates the flesh, inhibits bacterial growth, and contributes to the desired texture and flavor of the final dried product.",
    image: require("@/assets/images/modules/pre-drying/IMG_20251202_222138.jpg")
  },
  {
    title: "Post-Brining Rinse",
    text: "After the brining period, the fish are removed and given a final, single rinse with clean water. This step is essential to remove excess surface salt, which helps control the final product’s salinity, preventing it from becoming overly salty. The fish are then drained thoroughly before being arranged on drying trays, ensuring they are not dripping wet as they enter the sun-drying phase.",
    image: require("@/assets/images/modules/pre-drying/Messenger_creation_D4ACBFD1-B936-4B12-AB60-8D6EF406A06F.jpeg")
  }
];

export const lesson2Content = [
  {
    title: "Sort and Remove Rejects",
    text: "First, do the inspection of fish and take away those which show signs of damage, bruises, decay or ones that are unsuitable for drying. The rejects can be segregated for throwing away or for other purposes.",
    image: require("@/assets/images/modules/drying/IMG_20251203_154957.jpg")
  },
  {
    title: "Arrange Fish on Trays",
    text: "Drying trays should be filled with fish spread out in a single layer. No overlapping should take place so that sunlight and air can get at all surfaces equally.",
    image: require("@/assets/images/modules/drying/Screenshot_2025-12-03-15-55-45-35_f9ee0578fe1cc94de7482bd41accb329.jpg")
  },
  {
    title: "Proper Sunlight Placement",
    text: "Trays should be placed in an open area that receives strong sunlight and has good air circulation. Trays should be elevated to allow for air flow underneath and to hasten the drying process.",
    image: require("@/assets/images/modules/drying/FB_IMG_1764678929171.jpg")
  },
  {
    title: "Midway Drying Checks",
    text: "At times, the fish should be inspected by touching and seeing the texture, firmness, and color. It should be checked that the drying is done properly and no spoilage is taking place.",
    image: require("@/assets/images/modules/drying/FB_IMG_1764678831159.jpg")
  },
  {
    title: "Weather Watch & Protection",
    text: "The weather should be observed carefully. If clouds are coming, humidity is increasing or rain is on the way, then the trays should be covered or moved to a drying rack that is protected from the elements to keep the fish from getting wet again.",
    image: require("@/assets/images/modules/drying/IMG_20251202_222553.jpg")
  },
  {
    title: "Harvest",
    text: "When the fish are dried to the desired level, the drying trays should be taken out of direct sunlight and moved to a shady or protected place.",
    image: require("@/assets/images/modules/drying/IMG_20251203_155017.jpg")
  },
];

export const lesson3Content = [
  {
    title: "Cooling and Resting",
    text: "After the trays are removed from sunlight, the dried fish will be cooled in a shaded, clean area. This step is important to prevent moisture condensation and stabilize the texture.",
    image: require("@/assets/images/modules/post-drying/FB_IMG_1764678812228.jpg")
  },
  {
    title: "Final Inspection",
    text: "Examine the dried fish individually for any signs of under-drying, over-drying, insect damage, or contamination. Dismiss the defective pieces.",
    image: require("@/assets/images/modules/post-drying/FB_IMG_1764681001195.jpg")
  },
  {
    title: "Sorting by Size and Quality",
    text: "The dried fish should be sorted according to their size, appearance, and overall quality. This will facilitate uniformity in packaging and pricing.",
    image: require("@/assets/images/modules/post-drying/FB_IMG_1764678825851.jpg")
  },
  {
    title: "Cleaning",
    text: "Dust, small insects, and fine salt particles that may have settled during the drying process should be brushed off or gently wiped away.",
    image: require("@/assets/images/modules/post-drying/FB_IMG_1764678873582.jpg")
  },
  {
    title: "Packaging",
    text: "Dried fish should be packed into clean plastic bags, sacks, or containers. Make sure that the packaging is airtight so that moisture cannot penetrate and spoil the product.",
    image: require("@/assets/images/modules/post-drying/FB_IMG_1764681609611.jpg")
  },
  {
    title: "Storage",
    text: "Packaged dried fish should be stored in a place that is cool, dry, and well-ventilated. Keep them away from heat and humidity if you want to retain their quality.",
    image: require("@/assets/images/modules/post-drying/received_1267115995158703.jpeg")
  },
  {
    title: "Preparation for Market Transport",
    text: "Product labeling and arranging for delivery or selling. Be sure to seal the storage containers correctly before transit.",
    image: require("@/assets/images/modules/post-drying/FB_IMG_1764681613505.jpg")
  },
];



